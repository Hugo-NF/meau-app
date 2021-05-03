import firestore from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

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

const createChat = async (users: Array<FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>>): Promise<void> => {
  const { FieldValue } = firestore;
  await firestore().collection('chats').add({ users, updatedAt: FieldValue.serverTimestamp() });
};

const getOwnChats = async (userRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>): Promise<FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>> => firestore().collection('chats').where('users', 'array-contains', userRef).get();

const pushMessages = async (
  chatRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  senderRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  messages: Array<string>,
): Promise<void> => {
  const { FieldValue } = firestore;

  messages.forEach(async (message) => {
    await firestore().collection('messages').add({
      text: message,
      timestamp: FieldValue.serverTimestamp(),
      sender: senderRef,
      chat: chatRef,
      visualized: [senderRef],
    });
  });

  await firestore().collection('chats').doc(chatRef.id).update({
    updatedAt: FieldValue.serverTimestamp(),
  });
};

export default {
  createChat,
  getOwnChats,
  pushMessages,
};
