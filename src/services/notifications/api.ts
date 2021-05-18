import firestore from '@react-native-firebase/firestore';
import { DocumentData, DocumentRefData } from '../../types/services/Firebase';
import {
  NotificationType,
  INotificationAdoptionInterestData,
  NotificationModels,
} from '../../types/services/Notifications';

import userAPI from '../user/api';

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

  const base = {
    id: notification.id,
    from: await notificationData.from.get(),
    to: notificationData.to,
    message: notificationData.message,
    seen: notificationData.seen,
  };

  switch (notificationData.type) {
    case NotificationType.adoptionInterest:
      return {
        ...base,
        animal: await notificationData.data.animal.get(),
        type: notificationData.type,
      };
    case NotificationType.adoptionRefused:
      return {
        ...base,
        animal: await notificationData.data.animal.get(),
        type: notificationData.type,
      };
    default:
      return {
        ...base,
        type: notificationData.type,
      };
  }
};

const getNotifications = async (): Promise<NotificationModels[]> => {
  const currentUser = userAPI.currentUser();
  if (!currentUser) return Promise.resolve([]);
  const currentUserDocument = userAPI.currentUserDocument();

  const query = await firestore().collection('notifications')
    .where('to', '==', currentUserDocument)
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
