import firestore from '@react-native-firebase/firestore';
import { DocumentData, DocumentRefData } from '../../types/firebase';

import userAPI from '../user/api';

export enum NotificationType {
  standard = 'STD',
  adoptionInterest = 'AIN',
}

export interface INotificationAdoptionInterestData {
  animal: DocumentRefData,
}

export interface NotificationModel {
  id: string,
  from: DocumentData,
  to: DocumentRefData,
  message: string,
  seen: false,
}

export interface NotificationStandardModel extends NotificationModel {
  type: NotificationType.standard,
}

export interface NotificationAdoptionModel extends NotificationModel {
  type: NotificationType.adoptionInterest,
  animal: DocumentData,
}

export type NotificationModels = NotificationStandardModel | NotificationAdoptionModel;

const sendToUser = (
  user: DocumentRefData,
  message: string,
  type: NotificationType = NotificationType.standard,
  data: (INotificationAdoptionInterestData | null) = null,
): void => {
  const currentUser = userAPI.currentUserDocument();
  if (!currentUser) return;

  firestore().collection('notifications').add({
    from: currentUser,
    to: user,
    message,
    seen: false,
    type,
    data,
  });
};

const setSeenById = (notificationId: string): void => {
  firestore().collection('notifications').doc(notificationId).update({ seen: true });
};

const toModel = async (notification: DocumentData): Promise<NotificationModels> => {
  const notificationData = notification.data();
  switch (notificationData.type) {
    case NotificationType.adoptionInterest:
      return {
        id: notification.id,
        from: await notificationData.from.get(),
        to: notificationData.to,
        message: notificationData.message,
        seen: notificationData.seen,
        animal: await notificationData.data.animal.get(),
        type: notificationData.type,
      };
    default:
      return {
        id: notification.id,
        from: notificationData.from.get(),
        to: notificationData.to,
        message: notificationData.message,
        seen: notificationData.seen,
        type: notificationData.type,
      };
  }
};

const getNotifications = async (): Promise<(NotificationModel | NotificationAdoptionModel)[]> => {
  const currentUser = userAPI.currentUser();
  if (!currentUser) return Promise.resolve([]);

  const query = await firestore().collection('notifications')
    .where('to', '==', currentUser.uid)
    .where('seen', '==', false)
    .get();

  return Promise.all(query.docs.map(toModel));
};

const countNotifications = async (): Promise<number> => (await getNotifications()).length;

export default {
  sendToUser,
  setSeenById,
  getNotifications,
  countNotifications,
};