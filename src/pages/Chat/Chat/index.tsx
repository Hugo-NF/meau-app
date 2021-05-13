/* eslint-disable camelcase */
import React, {
  useCallback, useEffect, useRef, useState,
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
import { DocumentRefData, QuerySnapshotDocuments } from '../../../types/firebase';
import chatAPI from '../../../services/chat/api';
import userAPI from '../../../services/user/api';

import { styledComponents, styles } from './styles';

export default (): JSX.Element => {
  const chatTitle = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.title;
  const targetUserUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.targetUserUID;

  const routeChatUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Chat'>>().params?.chatUID;
  const currentUserRef = userAPI.currentUserDocument();

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
    }, []),
  );

  const navigation = useNavigation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState<boolean>(false);
  const [chatRef, setChatRef] = useState<DocumentRefData>();
  const [otherIsTyping, setOtherIsTyping] = useState<boolean>(false);
  const typingTimeoutFunction = useRef<NodeJS.Timeout>();
  const ignoreFirstOnInputTextChanged = useRef<boolean>(true);
  const selfIsTyping = useRef<boolean>(false);
  const firstLoad = useRef<boolean>(true);

  const sorter = (a: IMessage, b: IMessage): number => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime();

  const naiveUnique = (msgs: IMessage[]): IMessage[] => {
    // eslint-disable-next-line no-underscore-dangle
    const messagesId = msgs.map((m) => m._id);

    if (!messagesId.every((mid, i) => messagesId.indexOf(mid) === i)) {
      // eslint-disable-next-line no-console
      console.warn('Not unique array: autofixing but something is wrong');
    }
    // eslint-disable-next-line no-underscore-dangle
    return msgs.filter((m, i) => messagesId.indexOf(m._id) === i);
  };

  const addMessages = useCallback((loadedMessages: QuerySnapshotDocuments): void => {
    const chatMessages = loadedMessages.map((message) => {
      const messageData = message.data();
      return {
        _id: message.id,
        text: messageData.text,
        createdAt: messageData.timestamp ? messageData.timestamp.toDate() : new Date(),
        user: {
          _id: messageData.sender.id,
        },
      };
    });

    setMessages((previousMessages) => naiveUnique(GiftedChat.append(previousMessages, chatMessages).sort(sorter)));
  }, []);

  const updateMessages = useCallback((): void => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    if (!chatRef) {
      return;
    }

    const newestDate = messages[0]?.createdAt as Date;
    if (newestDate) {
      chatAPI.loadNewMessages(chatRef, newestDate).then((loadedMessages) => {
        const filteredLoadedMessages = loadedMessages.docs.filter((doc) => doc.data().sender.id !== currentUserRef.id);
        addMessages(filteredLoadedMessages);
      });
    }
  }, [messages, chatRef, currentUserRef, addMessages]);

  const loadMessages = useCallback((lastMessage?: IMessage): void => {
    if (!chatRef) return;

    const lastDate = lastMessage ? lastMessage.createdAt as Date : undefined;

    chatAPI.loadMessages(chatRef, 10, lastDate)
      .then((loadedMessages) => {
        addMessages(loadedMessages.docs);
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
  }, [chatRef, navigation, addMessages]);

  const updateTyping = (): void => {
    // onInputTextChanged triggers when first load
    if (ignoreFirstOnInputTextChanged.current === true) {
      ignoreFirstOnInputTextChanged.current = false;
      return;
    }

    // Updates db if changed selfIsTypingState
    if (selfIsTyping.current === false) {
      if (chatRef) chatAPI.setIsTyping(chatRef, currentUserRef, true);
    }

    selfIsTyping.current = true;

    if (typingTimeoutFunction.current) {
      clearTimeout(typingTimeoutFunction.current);
    }

    typingTimeoutFunction.current = setTimeout(() => {
      selfIsTyping.current = false;
      if (chatRef) chatAPI.setIsTyping(chatRef, currentUserRef, false);
    }, 1000);
  };

  // Effect to load chatRef from routeChatUID or targetUserUID
  useEffect(() => {
    if (routeChatUID !== undefined) {
      setChatRef(chatAPI.chatDocument(routeChatUID));
      chatAPI.markChatMessagesAsSeemByUser(routeChatUID, currentUserRef);
    } else if (routeChatUID === undefined && targetUserUID !== undefined) {
      chatAPI.getChatByTarget(currentUserRef, userAPI.userDocument(targetUserUID)).then((chat) => {
        if (chat?.ref) {
          setChatRef(chat.ref);
          chatAPI.markChatMessagesAsSeemByUser(chat.ref.id, currentUserRef);
        } else {
          setMessages([]);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial load messages when chatRef is set
  useEffect(() => loadMessages(), [loadMessages, chatRef]);

  // Get real time chat updates
  useEffect(() => {
    if (!chatRef) return () => null;

    firstLoad.current = true;
    const unsubscribe = chatRef
      .onSnapshot((chatSnapshot) => {
        const chatSnapshotData = chatSnapshot.data();
        if (chatSnapshotData?.currentlyTyping) {
          const otherIsTypingSnapshot = (chatSnapshotData.currentlyTyping as DocumentRefData[])
            .map((c) => c.id)
            .filter((c) => c !== currentUserRef.id).length > 0;
          setOtherIsTyping(otherIsTypingSnapshot);
        }
        updateMessages();
      });

    return () => {
      unsubscribe();
    };
  }, [chatRef, updateMessages, currentUserRef]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    let cRef: DocumentRefData;
    if (chatRef === undefined) {
      const chatDetails = await chatAPI.createChat([currentUserRef, userAPI.userDocument(targetUserUID)]);

      cRef = chatAPI.chatDocument(chatDetails.id);
      setChatRef(cRef);
    } else {
      cRef = chatRef;
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    }

    chatAPI.pushMessages(cRef, currentUserRef, newMessages.map((x) => x.text));
  }, [chatRef, currentUserRef, targetUserUID]);

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
          isTyping={otherIsTyping}
          onLoadEarlier={onLoadEarlier}
          onSend={(newMessages) => onSend(newMessages)}
          onInputTextChanged={() => updateTyping()}
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
