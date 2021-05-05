import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import {
  DocumentData, DocumentRefData, Query, QuerySnapshot,
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

const latestMessageOnChat = async (
  chatRef: DocumentRefData,
): Promise<DocumentData> => new Promise((resolve, reject) => {
  firestore()
    .collection('messages')
    .where('chat', '==', chatRef)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      resolve(querySnapshot.docs[0]);
    })
    .catch((err) => reject(err));
});

const loadMessages = async (
  chatRef: DocumentRefData,
  pageSize: number,
  lastMessageTimestamp?: FirebaseFirestoreTypes.Timestamp,
): Promise<QuerySnapshot> => {
  let query = firestore()
    .collection('messages')
    .where('chat', '==', chatRef)
    .orderBy('timestamp', 'desc');

  if (lastMessageTimestamp !== undefined) {
    query = query.startAfter(lastMessageTimestamp);
  }

  return query.limit(pageSize).get();
};

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

export default {
  chatDocument,
  createChat,
  getChat,
  getOwnChats,
  latestMessageOnChat,
  loadMessages,
  pushMessages,
};
