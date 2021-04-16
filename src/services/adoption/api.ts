// User can add animal to adoption interest
// User can remove animal from adoption interest
// User can see animals interested in
// User can see other ones interested on it`s animals
// User can see new ones interested on it`s animals
// User can choose one interested user so that and transfer is complete and other interested are removed
// User can reject some interested users still keeping the others

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

  const animalData = await (await animal.get()).data();
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
