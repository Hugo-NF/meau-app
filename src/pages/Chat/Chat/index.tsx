/* eslint-disable camelcase */
import React, {
  useCallback, useEffect, useState,
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
import chatAPI from '../../../services/chat/api';
import userAPI from '../../../services/user/api';

import { styledComponents, styles } from './styles';

export default (): JSX.Element => {
  const chatTitle = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.title;
  const targetUserUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.targetUserUID;
  const chatUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.chatUID;

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
    }, []),
  );

  const navigation = useNavigation();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (chatUID !== null) {
      chatAPI.loadMessages(chatAPI.chatDocument(chatUID), 10)
        .then((loadedMessages) => {
          const sortedMessages = loadedMessages.docs.sort((a, b) => b.data().timestamp.getTime() - a.data().timestamp.getTime());

          const chatMessagesPromises: Array<Promise<IMessage>> = sortedMessages.map((message) => new Promise((resolve, reject) => {
            const messageData = message.data();
            userAPI.getReference(messageData.sender)
              .then((userDocument) => {
                const userData = userDocument.data();
                resolve({
                  _id: messageData.id,
                  text: messageData.text,
                  createdAt: messageData.timestamp,
                  user: {
                    _id: userData?.id,
                    name: userData?.full_name,
                  },
                });
              }).catch((err) => reject(err));
          }));

          Promise.all(chatMessagesPromises)
            .then((chatMessages) => {
              setMessages(chatMessages);
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
    } else {
      setMessages([]);
    }
  }, [targetUserUID, chatUID]);

  const onSend = useCallback((newMessages = []) => {
    // eslint-disable-next-line
    console.log('chatAPI.pushPessages(chat, newMessages): ', newMessages);
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

  const onLoadEarlier = (): void => {
    // eslint-disable-next-line
    console.log('chatAPI.loadMessages(chat, pageSize, lastMessage): ', messages[0]);
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
          onLoadEarlier={onLoadEarlier}
          onSend={(newMessages) => onSend(newMessages)}
          user={{ _id: 1 }}
          messagesContainerStyle={styles.messagesContainer}
          renderAvatar={() => null}
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
