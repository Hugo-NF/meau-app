import firestore from '@react-native-firebase/firestore';

import animalAPI from '../animal/api';
import notificationAPI from '../notifications/api';

import { NotificationType } from '../../types/services/Notifications';
import { DocumentData, DocumentRefData, DocumentSnapshot } from '../../types/services/Firebase';
import { filterPaginated } from '../paginated/api';

import { PaginatedMetaData } from '../../types/services/Paginated';

const addInterestToAnimal = async (animal: DocumentRefData, user: DocumentRefData): Promise<void> => {
  const animalData = (await animal.get()).data();
  const animalOwner = animalData?.owner;

  await firestore().collection('animalInterested').add({
    animal,
    user,
    owner: animalOwner,
    seen: false,
  });

  notificationAPI.sendToUser(animalOwner, '', NotificationType.adoptionInterest, { animal });
};

const checkIfInterestedIn = async (animal: DocumentRefData, user: DocumentRefData): Promise<boolean> => {
  const result = await firestore().collection('animalInterested')
    .where('animal', '==', animal)
    .where('user', '==', user)
    .get();

  return result.size > 0;
};

const getAnimalsWhoseInterestsConnectTwoUsers = async (
  firstUser : DocumentRefData, secondUser: DocumentRefData,
) : Promise<Array<DocumentSnapshot>> => {
  const connectingInterestsWhereFirstUserIsOwner = await firestore()
    .collection('animalInterested')
    .where('owner', '==', firstUser)
    .where('user', '==', secondUser)
    .get();
  const connectingInterestsWhereSecondUserIsOwner = await firestore()
    .collection('animalInterested')
    .where('owner', '==', secondUser)
    .where('user', '==', firstUser)
    .get();

  const animalsRefsFromConnectingInterests : Array<DocumentRefData> = [];
  connectingInterestsWhereFirstUserIsOwner.forEach((connectingInterest) => {
    animalsRefsFromConnectingInterests.push(connectingInterest.data().animal);
  });
  connectingInterestsWhereSecondUserIsOwner.forEach((connectingInterest) => {
    animalsRefsFromConnectingInterests.push(connectingInterest.data().animal);
  });

  const animalsFromConnectingInterests = await Promise.all(
    animalsRefsFromConnectingInterests.map(
      (animalRef) => animalAPI.getReference(animalRef),
    ),
  );

  return animalsFromConnectingInterests;
};

const getInterestedIn = async (animal: DocumentRefData, paginatedMetaData?: PaginatedMetaData, onlyUnseen = false): Promise<DocumentData> => {
  let query = firestore().collection('animalInterested')
    .where('animal', '==', animal);

  query = filterPaginated(query, paginatedMetaData);

  if (onlyUnseen) {
    query = query.where('seen', '==', false);
  }

  const result = await query.get();

  return Promise.all(result.docs.map(async (doc) => doc.data().user.get()));
};

const removeInterestToAnimal = async (animal: DocumentRefData, user: DocumentRefData, notify = false): Promise<void> => {
  const result = await firestore().collection('animalInterested')
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
  const query = await firestore().collection('animalInterested')
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

const countNewInterestedIn = (animal: DocumentRefData): Promise<number> => getInterestedIn(animal, undefined, true).then((result) => result.length);

const setAllInterestedSeen = async (animal: DocumentRefData): Promise<void> => {
  const result = await firestore().collection('animalInterested')
    .where('animal', '==', animal)
    .where('seen', '==', false)
    .get();

  const batch = firestore().batch();
  result.docs.forEach((doc) => batch.update(doc.ref, { seen: true }));
  batch.commit();
};

export default {
  checkIfInterestedIn,
  toggleInterestToAnimal,
  removeInterestToAnimal,
  transferAnimalTo,
  getInterestedIn,
  countNewInterestedIn,
  setAllInterestedSeen,
  getAnimalsWhoseInterestsConnectTwoUsers,
};
