// Package imports.
import React, { useCallback } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ImageSourcePropType } from 'react-native';
import { Avatar } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { useFocusEffect } from '@react-navigation/native';

// Service imports.
import adoptionAPI from '../../../services/adoption/api';
import chatAPI from '../../../services/chat/api';
import { filterPaginated } from '../../../services/paginated/api';
import userAPI from '../../../services/user/api';

// Component imports.
import InfiniteScroll from '../../../components/InfiniteScroll';

// Utils imports.
import { concatenateNames } from '../../../utils/concatenateNames';
import { getNameInitials } from '../../../utils/getNameInitials';

// Layout imports.
import HeaderLayout from '../../../layouts/HeaderLayout';

// Style imports.
import { styles, styledComponents } from './styles';

// Type imports.
import { ChatListEntry } from '../../../types/chat';
import * as FirebaseTypes from '../../../types/firebase';

// Page exported.
export default function ChatList() : JSX.Element {
  // Variable declaration.

  // Styled components.
  const {
    ChatListEntryContainer,
    ChatListEntryMessagePreviewText,
    ChatListEntryMessagePreviewTextFaded,
    ChatListEntryTextContainer,
    ChatListEntryTimestampText,
    ChatListEntryTitleText,
    ChatListEntryTitleTextFaded,
    Container,
  } = styledComponents;

  // Function declaration.
  function chatListEntryKey(listEntry: ChatListEntry) : string {
    return listEntry.id;
  }

  function fetchChatList(
    lastEntry: ChatListEntry | null,
    pageNumber: number,
    pageSize: number,
  ): Promise<Array<ChatListEntry>> {
    return new Promise((resolve, reject) => {
      /* Chat API TODO: Método getAllUserChats para receber um doc de usuário e
       * retornar todos os chats que tem uma referência para esse doc entre os
       * participantes. Se quiser mudar o parâmetro de doc para UID, a vontade.
       */
      const currentUserDocument = userAPI.currentUserDocument();

      filterPaginated(
        chatAPI.allUserChatsQuery(currentUserDocument),
        {
          lastElementMarker: [lastEntry],
          marker: 'updatedAt',
          pageNumber,
          pageSize,
        },
      ).get()
        .then((userChats) => {
          const userChatPromises : Array<Promise<ChatListEntry>> = [];

          userChats.forEach(
            (userChat) => userChatPromises.push(
              new Promise((resolveUserChat, rejectUserChat) => {
                const userChatData = userChat.data();
                let userChatListEntryImage : ImageSourcePropType;
                let userChatListEntryMessagePreview : string;
                let userChatListEntryOtherUserDisplayName : string;
                let userChatListEntryTitle : string;
                let userChatListEntryUnseenUpdates : boolean;

                // ChatAPI TODO: Se o nome do campo de usuário não for "users",
                // corrigir aqui!
                const otherUserInChatRef = userChatData.users.find(
                  (userRef : FirebaseTypes.DocumentRefData) => userRef !== userAPI.currentUserDocument(),
                );

                const userDataPromise = new Promise<void>(
                  (resolveUserData, rejectUserData) => {
                    userAPI.getReference(otherUserInChatRef)
                      .then((user) => {
                        const userData = user.data();
                        userChatListEntryOtherUserDisplayName = userData?.fullName;

                        const chatTitlePromise = new Promise<void>(
                          (resolveChatTitle, rejectChatTitle) => {
                            adoptionAPI.getAnimalsWhoseInterestsConnectUsers(
                              [currentUserDocument, otherUserInChatRef],
                            ).then((animalsFromConnectingInterests) => {
                              const animalNames : Array<string> = [];

                              animalsFromConnectingInterests.forEach(
                                (animal) => {
                                  animalNames.push(animal.data()?.name);
                                },
                              );

                              const animalNameConcatenation = concatenateNames(
                                animalNames,
                              );

                              if (animalNameConcatenation !== '') {
                                userChatListEntryTitle = `${
                                  userData?.fullName
                                } | ${animalNameConcatenation}`;
                              } else {
                                userChatListEntryTitle = `${
                                  userData?.fullName
                                }`;
                              }

                              resolveChatTitle();
                            }).catch((err) => rejectChatTitle(err));
                          },
                        );

                        const chatImagePromise = new Promise<void>(
                          (resolveChatImage, rejectChatImage) => {
                            /* eslint-disable-next-line camelcase */
                            const userProfilePicture = userData?.profile_picture;
                            if (userProfilePicture !== '') {
                              userAPI.getPictureDownloadURL(
                                userProfilePicture,
                              ).then((pictureURL) => {
                                userChatListEntryImage = { uri: pictureURL };
                                resolveChatImage();
                              }).catch((err) => rejectChatImage(err));
                            } else resolveChatImage();
                          },
                        );

                        Promise.all([chatImagePromise, chatTitlePromise])
                          .then(() => resolveUserData())
                          .catch((err) => rejectUserData(err));
                      })
                      .catch((err) => rejectUserData(err));
                  },
                );

                const messageDataPromise = new Promise<void>(
                  (resolveMessageData, rejectMessageData) => {
                    chatAPI.getLastChatMessage(userChatData.id)
                      .then((message) => {
                        const messageData = message.data();

                        userChatListEntryMessagePreview = messageData.text;
                        userChatListEntryUnseenUpdates = !messageData.seenBy
                          .includes(currentUserDocument);
                        resolveMessageData();
                      })
                      .catch((err) => rejectMessageData(err));
                  },
                );

                Promise.all([messageDataPromise, userDataPromise])
                  .then(() => resolveUserChat({
                    id: userChatData.id,
                    image: userChatListEntryImage,
                    messagePreview: userChatListEntryMessagePreview,
                    otherUserDisplayName: userChatListEntryOtherUserDisplayName,
                    timestamp: userChatData.timestamp, // TODO: Format this with date-alguma-coisa;
                    title: userChatListEntryTitle,
                    unseenUpdates: userChatListEntryUnseenUpdates,
                  }))
                  .catch((err) => rejectUserChat(err));
              }),
            ),
          );

          Promise.all(userChatPromises)
            .then((userChatListEntries) => resolve(userChatListEntries))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  function fetchChatListMock(
    lastEntry: ChatListEntry | null,
    pageNumber: number,
    pageSize: number,
  ): Promise<Array<ChatListEntry>> {
    return new Promise((resolve) => {
      if (pageNumber === 1 || lastEntry === null) {
        resolve([
          {
            id: uuidv4(),
            image: null,
            messagePreview: 'Olá, Bob Esponja! Tudo bem?',
            otherUserDisplayName: 'Patrick Estrela',
            timestamp: '17:56',
            title: 'Patrick Estrela | Gary',
            unseenUpdates: false,
          },
          {
            id: uuidv4(),
            image: null,
            messagePreview: 'Bob Esponja, gostaria de adotar o Pin. Acho que preciso de um pet.',
            otherUserDisplayName: 'Lula Molusco',
            timestamp: '17:51',
            title: 'Lula Molusco | Pin',
            unseenUpdates: true,
          },
        ]);
      } else {
        resolve([]);
      }
    });
  }

  function formatChatListEntry(listEntry: ChatListEntry) : JSX.Element {
    return (
      <ChatListEntryContainer>
        {
          listEntry.image !== null ? (
            <Avatar.Image
              size={styles.chatListEntryImage.size}
              source={listEntry.image}
              style={styles.chatListEntryImage.styles}
            />
          ) : (
            <Avatar.Text
              size={styles.chatListEntryImage.size}
              label={getNameInitials(listEntry.otherUserDisplayName)}
              style={styles.chatListEntryImage.styles}
            />
          )
        }
        {
          listEntry.unseenUpdates === true ? (
            <ChatListEntryTextContainer>
              <ChatListEntryTitleText numberOfLines={1}>
                {listEntry.title}
              </ChatListEntryTitleText>
              <ChatListEntryMessagePreviewText numberOfLines={1}>
                {listEntry.messagePreview}
              </ChatListEntryMessagePreviewText>
            </ChatListEntryTextContainer>
          ) : (
            <ChatListEntryTextContainer>
              <ChatListEntryTitleTextFaded numberOfLines={1}>
                {listEntry.title}
              </ChatListEntryTitleTextFaded>
              <ChatListEntryMessagePreviewTextFaded numberOfLines={1}>
                {listEntry.messagePreview}
              </ChatListEntryMessagePreviewTextFaded>
            </ChatListEntryTextContainer>
          )
        }
        <ChatListEntryTimestampText>
          {listEntry.timestamp}
        </ChatListEntryTimestampText>
      </ChatListEntryContainer>
    );
  }

  // Page effects.
  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(styles.statusBarColor, true);
    }, []),
  );

  // JSX returned.
  return (
    <HeaderLayout
      headerShown
      disableScrollView
      title="Chat"
      headerStyles={styles.headerLayout}
      leftAction={{
        hidden: false,
        actionType: 'drawer',
      }}
      rightAction={{
        hidden: false,
        actionType: 'search',
      }}
    >
      <Container>
        <InfiniteScroll
          keyExtractorFunction={chatListEntryKey}
          contentBatchSize={10}
          contentContainerStyles={styles.infiniteScroll.contentContainerStyles}
          dataFetchQuery={fetchChatListMock}
          formatContent={formatChatListEntry}
          noDataFoundContainerStyles={
            styles.infiniteScroll.noDataFoundContainerStyles
          }
        />
      </Container>
    </HeaderLayout>
  );
}
