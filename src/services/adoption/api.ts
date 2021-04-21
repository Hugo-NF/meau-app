import firestore from '@react-native-firebase/firestore';
import notificationAPI, { NotificationType } from '../notifications/api';
import { DocumentData, DocumentRefData, Query } from '../../types/firebase';
import { queryPaginated, PaginatedMetaData } from '../paginated/api';

const getInterestedIn = async (animal: DocumentRefData, paginatedMetaData?: PaginatedMetaData): Promise<DocumentData> => {
  const result = await queryPaginated('animalInterests', paginatedMetaData)
    .where('animal', '==', animal)
    .get();

  return Promise.all(result.docs.map(async (doc) => doc.data().user.get()));
};

const checkIfInterestedIn = async (animal: DocumentRefData, user: DocumentRefData): Promise<boolean> => {
  const result = await firestore().collection('animalInterests')
    .where('animal', '==', animal)
    .where('user', '==', user)
    .get();

  return result.size > 0;
};

const addInterestToAnimal = async (animal: DocumentRefData, user: DocumentRefData): Promise<void> => {
  await firestore().collection('animalInterests').add({ animal, user });

  const animalData = (await animal.get()).data();
  const animalOwner = animalData?.owner;

  notificationAPI.sendToUser(animalOwner, '', NotificationType.adoptionInterest, { animal });
};

const removeInterestToAnimal = async (animal: DocumentRefData, user: DocumentRefData, notify = false): Promise<void> => {
  const result = await firestore().collection('animalInterests')
    .where('animal', '==', animal)
    .where('user', '==', user)
    .get();

  const batch = firestore().batch();
  result.docs.forEach((doc) => batch.delete(doc.ref));
  batch.commit();

  if (notify) {
    notificationAPI.sendToUser(user, '', NotificationType.adoptionRefused, { animal });
  }
};

const toggleInterestToAnimal = async (animal: DocumentRefData, user: DocumentRefData): Promise<void> => {
  if (await checkIfInterestedIn(animal, user)) {
    await removeInterestToAnimal(animal, user);
  } else {
    await addInterestToAnimal(animal, user);
  }
};

const transferAnimalTo = async (animal: DocumentRefData, user: DocumentRefData): Promise<void> => {
  const query = await firestore().collection('animalInterests')
    .where('animal', '==', animal)
    .get();

  // Delete all interested
  const batch = firestore().batch();
  query.docs.forEach((doc) => batch.delete(doc.ref));
  batch.commit();

  // Update owner
  await animal.update({ owner: user });

  // Get animal info
  const animalName = (await animal.get()).data()?.name;

  // Notify new owner
  notificationAPI.sendToUser(user, `O pet ${animalName} agora é seu!`, NotificationType.standard);

  // Notify other interested
  query.docs.filter((doc) => doc.data().user !== user).forEach((doc) => notificationAPI.sendToUser(doc.data().user, `O pet ${animalName} já foi adotado!`, NotificationType.standard));
};

export default {
  checkIfInterestedIn,
  toggleInterestToAnimal,
  removeInterestToAnimal,
  transferAnimalTo,
  getInterestedIn,
};
