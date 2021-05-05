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

  const sorter = (a: IMessage, b: IMessage): number => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime();

  const loadMessages = useCallback((lastMessage?: IMessage): void => {
    const lastTimestamp = lastMessage ? lastMessage.createdAt as Date : undefined;

    chatAPI.loadMessages(chatRef.current, 10, lastTimestamp)
      .then((loadedMessages) => {
        const chatMessages = loadedMessages.docs.map((message) => {
          const messageData = message.data();
          return {
            _id: message.id,
            text: messageData.text,
            createdAt: messageData.timestamp.toDate(),
            user: {
              _id: messageData.sender.id,
            },
          };
        });

        setMessages((previousMessages) => GiftedChat.append(previousMessages, chatMessages).sort(sorter));

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
  }, [navigation]);

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
  }, [currentUserRef, targetUserUID]);

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
    const isSameUser = props.currentMessage?.user._id === currentUserRef.id;
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
