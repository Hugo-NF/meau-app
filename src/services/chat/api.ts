import firestore from '@react-native-firebase/firestore';
import {
  DocumentData, DocumentRefData, DocumentSnapshot, Query,
} from '../../types/firebase';

// Collection de chats
// * Id;
// * Array de referências de usuários;
// + * Timestamp da última mensagem (updatedAt);

// Collection de mensagens
// * Id;
// * Texto;
// * Timestamp;
// * Referência para o usuário que enviou;
// * Referência para o chat;
// - * Se visualizado ou não;
// + * Array de referências para usuários que visualizaram;

const chatDocument = (chatUID: string): DocumentRefData => firestore().collection('chats').doc(chatUID);

const createChat = async (users: Array<DocumentRefData>)
  : Promise<DocumentData> => {
  const { FieldValue } = firestore;
  return (await firestore().collection('chats').add({ users, updatedAt: FieldValue.serverTimestamp() })).get();
};

const getChat = async (chatUID: string): Promise<DocumentData> => firestore().collection('chats').doc(chatUID).get();

const getOwnChats = (userRef: DocumentRefData)
  : Query => firestore()
  .collection('chats')
  .where('users', 'array-contains', userRef);

const pushMessages = async (
  chatRef: DocumentRefData,
  senderRef: DocumentRefData,
  messages: Array<string>,
): Promise<void> => {
  const { FieldValue } = firestore;

  messages.forEach(async (message) => {
    await firestore().collection('messages').add({
      text: message,
      timestamp: FieldValue.serverTimestamp(),
      sender: senderRef,
      chat: chatRef,
      seenBy: [senderRef],
    });
  });

  await firestore().collection('chats').doc(chatRef.id).update({
    updatedAt: FieldValue.serverTimestamp(),
  });
};

const loadMessages = async (
  chatRef: DocumentRefData,
  pageSize: number,
  lastMessage?: DocumentSnapshot,
): Promise<DocumentData> => {
  let query = firestore()
    .collection('messages')
    .where('chat', '==', chatRef)
    .orderBy('timestamp', 'desc');

  if (lastMessage !== undefined) {
    query = query.startAfter(lastMessage);
  }

  return query.limit(pageSize).get();
};

const latestMessageOnChat = async (
  chatRef: DocumentRefData,
): Promise<DocumentData> => firestore()
  .collection('messages')
  .where('chat', '==', chatRef)
  .orderBy('timestamp', 'desc')
  .limitToLast(1)
  .get();

export default {
  chatDocument,
  createChat,
  getChat,
  getOwnChats,
  pushMessages,
  latestMessageOnChat,
  loadMessages,
};
