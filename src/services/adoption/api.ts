import firestore from '@react-native-firebase/firestore';
import notificationAPI, { NotificationType } from '../notifications/api';
import { DocumentData, DocumentRefData } from '../../types/firebase';

const getInterestedIn = async (animal: DocumentRefData): Promise<DocumentData> => {
  const result = await firestore().collection('animalInterests')
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
  const animalOwnerId = animalData?.owner.id;

  notificationAPI.sendToUser(animalOwnerId, '', NotificationType.adoptionInterest, { animal });
};

const removeInterestToAnimal = async (animal: DocumentRefData, user: DocumentRefData): Promise<void> => {
  const result = await firestore().collection('animalInterests')
    .where('animal', '==', animal)
    .where('user', '==', user)
    .get();

  const batch = firestore().batch();
  result.docs.forEach((doc) => batch.delete(doc.ref));
  batch.commit();
};

const toggleInterestToAnimal = async (animal: DocumentRefData, user: DocumentRefData): Promise<void> => {
  if (await checkIfInterestedIn(animal, user)) {
    await removeInterestToAnimal(animal, user);
  } else {
    await addInterestToAnimal(animal, user);
  }
};

export default {
  checkIfInterestedIn,
  toggleInterestToAnimal,
  getInterestedIn,
};
