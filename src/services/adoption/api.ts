// User can add animal to adoption interest
// User can remove animal from adoption interest
// User can see animals interested in
// User can see other ones interested on it`s animals
// User can see new ones interested on it`s animals
// User can choose one interested user so that and transfer is complete and other interested are removed
// User can reject some interested users still keeping the others

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import notificationAPI, { NotificationType } from '../notifications/api';

const getInterestedIn = async (
  animalRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
): Promise<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]> => firestore().collection('animalInterests')
  .where('animal', '==', animalRef)
  .get()
  .then((result) => result.docs.map((data) => data.data().user))
  .catch(() => []);

const checkIfInterestedIn = async (
  animalRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  userRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
): Promise<boolean> => firestore().collection('animalInterests')
  .where('animal', '==', animalRef)
  .where('user', '==', userRef)
  .get()
  .then((result) => result.size > 0)
  .catch(() => false);

const toggleInterestToAnimal = async (
  animalRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  userRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
): Promise<boolean> => {
  if (await checkIfInterestedIn(animalRef, userRef)) {
    return firestore().collection('animalInterests')
      .where('animal', '==', animalRef)
      .where('user', '==', userRef)
      .get()
      .then((result) => {
        const batch = firestore().batch();
        result.docs.forEach((doc) => batch.delete(doc.ref));
        batch.commit();
        return true;
      })
      .catch(() => false);
  }

  return firestore().collection('animalInterests').add({
    animal: animalRef,
    user: userRef,
  })
    .then(async () => {
      const result = await animalRef.get();
      const toUser = result.data()?.owner.id;
      notificationAPI.sendToUser(toUser, '', NotificationType.adoptionInterest, { animalId: animalRef.id });
      return true;
    })
    .catch(() => false);
};

export default {
  checkIfInterestedIn,
  toggleInterestToAnimal,
  getInterestedIn,
};
