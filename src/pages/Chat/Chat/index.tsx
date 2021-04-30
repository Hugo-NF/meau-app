import React, {
  useCallback, useEffect, useState,
} from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import {
  GiftedChat, InputToolbar, InputToolbarProps, Send, SendProps, MessageProps, IMessage,
} from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HeaderLayout from '../../../layouts/HeaderLayout';
import { Theme } from '../../../constants';
import * as RouteTypes from '../../../types/routes';
import { styledComponents, styles } from './styles';

const mock = [
  {
    _id: 1,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(1),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 2,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(2),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 3,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(3),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 5,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(5),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 6,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(6),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 7,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(7),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 8,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(8),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 4,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(4),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 9,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(9),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 10,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(10),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 11,
    text: 'Olá! Gostaria de adotar o seu gato!',
    createdAt: new Date(11),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 12,
    text: 'Que maravilha, Marília! Você mora aqui em Brasília?',
    createdAt: new Date(12),
    user: {
      _id: 1,
      name: 'React Native',
    },
  },
];

export default (): JSX.Element => {
  const chatTitle = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.title;
  const animalUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.animalUID;
  const targetUserUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.targetUserUID;

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
    }, []),
  );

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // eslint-disable-next-line
    console.log('================ CHAT PAGE ================');
    // eslint-disable-next-line
    console.log('chatAPI.getChat(currentUser, targetUser, animal): ', targetUserUID, animalUID);
    // eslint-disable-next-line
    console.log('...then');
    // eslint-disable-next-line
    console.log('chatAPI.loadMessages(chat, pageSize) if chat');
    setMessages(mock.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }, [targetUserUID, animalUID]);

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
