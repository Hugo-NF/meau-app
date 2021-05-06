// Package imports.
import React, { useCallback } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ImageSourcePropType } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Service imports.
import adoptionAPI from '../../../services/adoption/api';
import chatAPI from '../../../services/chat/api';
import { filterPaginated } from '../../../services/paginated/api';
import userAPI from '../../../services/user/api';

// Component imports.
import InfiniteScroll from '../../../components/InfiniteScroll';

// Utils imports.
import { concatenateNames } from '../../../utils/concatenateNames';
import { formatChatDate } from '../../../utils/formatTexts';
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
  const navigation = useNavigation();

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
      const currentUserDocument = userAPI.currentUserDocument();

      filterPaginated(
        chatAPI.getOwnChats(currentUserDocument),
        {
          lastElementMarker: [lastEntry?.updatedAt],
          marker: 'updatedAt',
          orderByDirection: 'desc',
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

                const otherUserInChatRef = userChatData.users.find(
                  (userRef : FirebaseTypes.DocumentRefData) => userRef.id !== currentUserDocument.id,
                );

                const userDataPromise = new Promise<void>(
                  (resolveUserData, rejectUserData) => {
                    userAPI.getReference(otherUserInChatRef)
                      .then((user) => {
                        const userData = user.data();
                        /* eslint-disable-next-line camelcase */
                        userChatListEntryOtherUserDisplayName = userData?.full_name;

                        const chatTitlePromise = new Promise<void>(
                          (resolveChatTitle, rejectChatTitle) => {
                            adoptionAPI.getAnimalsWhoseInterestsConnectTwoUsers(
                              currentUserDocument, otherUserInChatRef,
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
                                  userChatListEntryOtherUserDisplayName
                                } | ${animalNameConcatenation}`;
                              } else {
                                userChatListEntryTitle = `${
                                  userChatListEntryOtherUserDisplayName
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
                    chatAPI.latestMessageOnChat(chatAPI.chatDocument(userChat.id))
                      .then((message) => {
                        const messageData = message.data();

                        userChatListEntryMessagePreview = messageData.text;
                        userChatListEntryUnseenUpdates = !messageData.seenBy
                          .map((userRef : FirebaseTypes.DocumentRefData) => userRef.id)
                          .includes(currentUserDocument.id);
                        resolveMessageData();
                      })
                      .catch((err) => rejectMessageData(err));
                  },
                );

                Promise.all([messageDataPromise, userDataPromise])
                  .then(() => resolveUserChat({
                    id: userChat.id,
                    image: userChatListEntryImage,
                    messagePreview: userChatListEntryMessagePreview,
                    otherUserDisplayName: userChatListEntryOtherUserDisplayName,
                    updatedAt: userChatData.updatedAt,
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

  function formatChatListEntry(listEntry: ChatListEntry) : JSX.Element {
    return (
      <ChatListEntryContainer
        onPress={() => navigation.navigate('Chat', {
          title: listEntry.otherUserDisplayName,
          chatUID: listEntry.id,
        })}
      >
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
          {formatChatDate(listEntry.updatedAt.toDate())}
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
          dataFetchQuery={fetchChatList}
          formatContent={formatChatListEntry}
          noDataFoundContainerStyles={
            styles.infiniteScroll.noDataFoundContainerStyles
          }
        />
      </Container>
    </HeaderLayout>
  );
}
