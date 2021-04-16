import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import userAPI from '../user/api';

export enum NotificationType {
  standard = 'STD',
  adoptionInterest = 'AIN',
}

export interface INotificationDoc {
  from: string,
  to: string,
  message: string,
  seen: boolean,
  type: NotificationType,
  data: Record<string, unknown>,
}

export interface INotificationAdoptionInterestData {
  animalId: string,
}

const sendToUser = (toUserUID: string, message: string, type: NotificationType = NotificationType.standard, data: Record<string, unknown> = {}): void => {
  const currentUser = userAPI.currentUser();
  if (!currentUser) return;

  firestore().collection('notifications').add({
    from: currentUser.uid,
    to: toUserUID,
    message,
    seen: false,
    type,
    data,
  })
    .then(() => null)
    .catch(() => null);
};

const setSeen = (notificationUID: string): void => {
  firestore().collection('notifications').doc(notificationUID).update({ seen: true });
};

const getNotifications = (): Promise<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]> => {
  const currentUser = userAPI.currentUser();
  if (!currentUser) return Promise.resolve([]);

  return firestore().collection('notifications')
    .where('to', '==', currentUser.uid)
    .where('seen', '==', false)
    .get()
    .then((result) => result.docs)
    .catch(() => []);
};

const countNotifications = (): Promise<number> => getNotifications().then((result) => result.length);

export default {
  sendToUser,
  setSeen,
  getNotifications,
  countNotifications,
};
