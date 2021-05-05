/* eslint-disable camelcase */
import React, {
  useCallback, useEffect, useState, useRef,
} from 'react';
import { Alert } from 'react-native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import {
  RouteProp, useFocusEffect, useRoute, useNavigation,
} from '@react-navigation/native';
import {
  GiftedChat, InputToolbar, InputToolbarProps, Send, SendProps, MessageProps, IMessage,
} from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import HeaderLayout from '../../../layouts/HeaderLayout';
import { Theme } from '../../../constants';
import * as RouteTypes from '../../../types/routes';
import { DocumentRefData } from '../../../types/firebase';
import chatAPI from '../../../services/chat/api';
import userAPI from '../../../services/user/api';

import { styledComponents, styles } from './styles';

export default (): JSX.Element => {
  const chatTitle = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.title;
  const targetUserUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.targetUserUID;

  const chatUID = useRef<string>(useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.chatUID);
  const chatRef = useRef<DocumentRefData>(chatAPI.chatDocument(chatUID.current));
  const currentUserRef = userAPI.currentUserDocument();

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
    }, []),
  );

  const navigation = useNavigation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState<boolean>(false);

  const loadMessages = useCallback((lastMessage?: IMessage): void => {
    let lastMessageTimestamp;
    if (lastMessage !== undefined) {
      lastMessageTimestamp = FirebaseFirestoreTypes.Timestamp.fromDate(new Date());
    }

    chatAPI.loadMessages(chatRef.current, 10, lastMessageTimestamp)
      .then((loadedMessages) => {
        // const sortedMessages = loadedMessages.docs.sort((a, b) => b.data().timestamp.toDate().getTime() - a.data().timestamp.toDate().getTime());
        console.log(loadedMessages.docs);
        const chatMessagesPromises: Array<Promise<IMessage>> = loadedMessages.docs.map((message) => new Promise((resolve, reject) => {
          const messageData = message.data();
          userAPI.getReference(messageData.sender)
            .then((userDocument) => {
              const userData = userDocument.data();
              resolve({
                _id: message.id,
                text: messageData.text,
                createdAt: messageData.timestamp.toDate(),
                user: {
                  _id: userDocument.id,
                  name: userData?.full_name,
                },
              });
            }).catch((err) => reject(err));
        }));

        Promise.all(chatMessagesPromises)
          .then((chatMessages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, chatMessages));
            setIsLoadingEarlier(false);
          })
          .catch(() => {
            Alert.alert(
              'Erro!',
              'Ocorreu um erro no carregamento das informações.\n'
                  + 'Retornando para a página anterior.',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                },
              ],
              {
                cancelable: false,
              },
            );
          });
      });
  }, []);

  useEffect(() => {
    if (chatUID.current !== undefined) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [loadMessages]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (chatUID.current === undefined) {
      const chatDetails = await chatAPI.createChat([currentUserRef, userAPI.userDocument(targetUserUID)]);

      chatUID.current = chatDetails.id;
      chatRef.current = chatAPI.chatDocument(chatUID.current);
    }

    chatAPI.pushMessages(chatRef.current, currentUserRef, newMessages.map((x) => x.text));
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

  const onLoadEarlier = (): void => {
    setIsLoadingEarlier(true);
    loadMessages(messages[messages.length - 1]);
  };

  const {
    Container,
    SendWrapper,
    MessageBubble,
    SelfMessageBubble,
    MessageText,
  } = styledComponents;

  const renderInputToolbar = (props: InputToolbarProps): JSX.Element => (
    <InputToolbar {...props} containerStyle={styles.inputContainer} />
  );

  const renderSend = (props: SendProps<IMessage>): JSX.Element => (
    <Send {...props} containerStyle={styles.sendButtonContainer}>
      <SendWrapper>
        <MaterialIcons
          style={styles.sendButtonIcon}
          name="send"
          size={24}
        />
      </SendWrapper>
    </Send>
  );

  const renderMessage = (props: MessageProps<IMessage>): JSX.Element => {
    const isSameUser = props.currentMessage?.user._id === 1;
    const MessageView = isSameUser ? SelfMessageBubble : MessageBubble;

    return (
      <MessageView>
        <MessageText>{props.currentMessage?.text}</MessageText>
      </MessageView>
    );
  };

  return (
    <HeaderLayout
      disableScrollView
      headerShown
      title={chatTitle}
      headerStyles={{
        backgroundColor: Theme.elements.headerPrimary,
        maxHeight: '56px',
        height: '56px',
      }}
      leftAction={{
        hidden: false,
        actionType: 'back',
      }}
      rightAction={{
        hidden: false,
        actionType: 'options',
      }}
    >
      <Container>
        <GiftedChat
          messages={messages}
          loadEarlier
          infiniteScroll
          isLoadingEarlier={isLoadingEarlier}
          onLoadEarlier={onLoadEarlier}
          onSend={(newMessages) => onSend(newMessages)}
          user={{ _id: currentUserRef.id }}
          messagesContainerStyle={styles.messagesContainer}
          placeholder=""
          alignTop
          alwaysShowSend
          textInputProps={{ style: styles.textInput }}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderMessage={renderMessage}
        />
      </Container>
    </HeaderLayout>
  );
};
