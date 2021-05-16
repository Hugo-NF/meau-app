import firestore from '@react-native-firebase/firestore';
import {
  DocumentData, DocumentRefData, Query, QuerySnapshot,
} from '../../types/firebase';

const chatDocument = (chatUID: string): DocumentRefData => firestore().collection('chats').doc(chatUID);

const createChat = async (users: Array<DocumentRefData>)
  : Promise<DocumentData> => {
  const { FieldValue } = firestore;
  const newChat = await firestore().collection('chats').add({
    users,
    updatedAt: FieldValue.serverTimestamp(),
  });

  await newChat.collection('updatedAt').add({ updatedAt: FieldValue.serverTimestamp() });

  return newChat;
};

const getChat = async (chatUID: string): Promise<DocumentData> => firestore().collection('chats').doc(chatUID).get();

const getOwnChats = (userRef: DocumentRefData)
  : Query => firestore()
  .collection('chats')
  .where('users', 'array-contains', userRef);

const getChatByTarget = async (currentUser: DocumentRefData, targetUser: DocumentRefData): Promise<DocumentData | undefined> => {
  const query = await firestore()
    .collection('chats')
    .where('users', 'in', [[currentUser, targetUser], [targetUser, currentUser]])
    .get();

  return query.docs.length > 0 ? query.docs[0] : undefined;
};

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
  lastMessageTimestamp?: Date,
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

const loadNewMessages = async (
  chatRef: DocumentRefData,
  currentNewestMessageTimestamp: Date,
): Promise<QuerySnapshot> => {
  const query = firestore()
    .collection('messages')
    .where('chat', '==', chatRef)
    .orderBy('timestamp', 'asc')
    .startAfter(currentNewestMessageTimestamp);

  return query.get();
};

const markChatMessagesAsSeemByUser = async (
  chatUID: string,
  userRef: DocumentRefData,
) : Promise<void> => {
  const chatRef = chatDocument(chatUID);

  const messagesSentByOtherUserInChat = await firestore()
    .collection('messages')
    .where('chat', '==', chatRef)
    .where('sender', '!=', userRef)
    .get();

  const messagesUnseenByUser = messagesSentByOtherUserInChat.docs.filter(
    (messageDoc) => {
      const idsForUsersWhoSawMessage = messageDoc.data().seenBy.map(
        (userRefInSeenByArray: DocumentRefData) => userRefInSeenByArray.id,
      );
      return !idsForUsersWhoSawMessage.includes(userRef.id);
    },
  );

  messagesUnseenByUser.forEach(
    (messageDoc) => messageDoc.ref.set({
      seenBy: [...messageDoc.data().seenBy, userRef],
    }, { merge: true }),
  );
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

  const updatedAtDoc = (await firestore().collection('chats').doc(chatRef.id).collection('updatedAt')
    .get()).docs;

  await updatedAtDoc[0].ref.update({
    updatedAt: FieldValue.serverTimestamp(),
  });
};

const setIsTyping = async (
  chatRef: DocumentRefData,
  userRef: DocumentRefData,
  isTyping: boolean,
): Promise<void> => {
  const currentlyTyping = (await chatRef.collection('currentlyTyping').where('userRef', '==', userRef).get()).docs;
  const storedThatIsTyping = currentlyTyping.length > 0;

  if (isTyping && !storedThatIsTyping) {
    await chatRef.collection('currentlyTyping').add({ userRef });
  }
  if (!isTyping && storedThatIsTyping) {
    const batch = firestore().batch();
    currentlyTyping.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
};

const removeChat = async (
  chatRef: DocumentRefData,
): Promise<void> => {
  const batch = firestore().batch();
  const chatMessages = await firestore().collection('messages').where('chat', '==', chatRef).get();

  // Remove all messages
  chatMessages.forEach((message) => batch.delete(message.ref));

  // Remove chat
  batch.delete(chatRef);

  // Finish
  batch.commit();
};

export default {
  chatDocument,
  createChat,
  getChat,
  getChatByTarget,
  getOwnChats,
  latestMessageOnChat,
  loadMessages,
  loadNewMessages,
  markChatMessagesAsSeemByUser,
  pushMessages,
  setIsTyping,
  removeChat,
};
