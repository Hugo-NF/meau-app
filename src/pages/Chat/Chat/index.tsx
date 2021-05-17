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

import { Button, Modal, Portal } from 'react-native-paper';
import HeaderLayout from '../../../layouts/HeaderLayout';
import { Theme } from '../../../constants';
import * as RouteTypes from '../../../types/routes';
import { DocumentRefData } from '../../../types/services/Firebase';
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
  const [dialog, setDialog] = useState<boolean>(false);

  const sorter = (a: IMessage, b: IMessage): number => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime();

  const loadMessages = useCallback((lastMessage?: IMessage): void => {
    if (!chatRef) return;

    const lastDate = lastMessage ? lastMessage.createdAt as Date : undefined;

    chatAPI.loadMessages(chatRef, 10, lastDate)
      .then((loadedMessages) => {
        const chatMessages = loadedMessages.docs.map((message) => {
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
  }, [chatRef, navigation]);

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

  useEffect(() => loadMessages(), [loadMessages, chatRef]);

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
    ModalExternalContainer,
    ModalInternalContainer,
    ModalButtonText,
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
        onPress: () => setDialog(true),
      }}
    >
      <Container>
        <Portal>
          <Modal
            visible={dialog}
            onDismiss={() => setDialog(false)}
            style={styles.modalContainer}
          >
            <ModalExternalContainer>
              <ModalInternalContainer>
                <Button
                  style={styles.modalDefaultButton}
                  onPress={() => {
                    if (chatRef) {
                      chatAPI.removeChat(chatRef);
                    }
                    setDialog(false);
                    navigation.goBack();
                  }}
                >
                  <ModalButtonText>APAGAR CHAT</ModalButtonText>
                </Button>
                <Button
                  style={styles.modalAccentButton}
                  onPress={() => setDialog(false)}
                >
                  <ModalButtonText>CANCELAR</ModalButtonText>
                </Button>
              </ModalInternalContainer>
            </ModalExternalContainer>
          </Modal>
        </Portal>
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
