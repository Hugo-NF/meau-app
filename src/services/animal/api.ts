// Package imports.
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Type imports.
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';

// User module imports.
import { Values } from '../../constants';

// Type declarations.
type QueryParams = {
  orderBy? : string | undefined,
  startAfter? : FirebaseFirestoreTypes.DocumentFieldType | undefined,
  limit? : number | undefined
}

// Service implementation.
const api = {

  animalCollection() : FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData> {
    return firestore().collection('animals');
  },

  animalDocument(
    animalUID : string | undefined,
  ) : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> {
    return this.animalCollection().doc(animalUID);
  },

  getAnimal(
    animalUID : string | undefined,
  ) : Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>> {
    return this.animalDocument(animalUID).get();
  },

  animalPictureDir() : FirebaseStorageTypes.Reference {
    return storage().ref(Values.IMAGE_DIRECTORY);
  },

  createAnimal(
    documentData : FirebaseFirestoreTypes.DocumentData,
  ) : Promise<FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>> {
    return this.animalCollection().add(documentData);
  },

  createQuery(
    queryParams : QueryParams = {
      orderBy: 'name',
    },
  ) : FirebaseFirestoreTypes.Query {
    let query : FirebaseFirestoreTypes.Query = this.animalCollection();

    if (queryParams.orderBy !== undefined) query = query.orderBy(queryParams.orderBy);

    if (queryParams.startAfter !== undefined) query = query.startAfter(queryParams.startAfter);

    if (queryParams.limit !== undefined) query = query.limit(queryParams.limit);

    return query;
  },

  createQueryByUserUid(
    userUID : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    operator: FirebaseFirestoreTypes.WhereFilterOp,
    queryParams : QueryParams = {
      orderBy: 'name',
    },
  ): FirebaseFirestoreTypes.Query {
    let query : FirebaseFirestoreTypes.Query = this.animalCollection();
    if (userUID !== undefined) query = query.where('owner', operator, userUID);

    if (queryParams.orderBy !== undefined) query = query.orderBy(queryParams.orderBy);

    if (queryParams.startAfter !== undefined) query = query.startAfter(queryParams.startAfter);

    if (queryParams.limit !== undefined) query = query.limit(queryParams.limit);

    return query;
  },

  deleteAnimal(animalUID : string) : Promise<void> {
    return this.animalDocument(animalUID).delete();
  },

  getAll(
    orderBy = 'name',
  ) : Promise<FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>> {
    return this.animalCollection().orderBy(orderBy).get();
  },

  getOwnedByUser(
    userUID : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    orderBy = 'name',
  ) : Promise<FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>> {
    return this.animalCollection()
      .orderBy(orderBy)
      .where('owner', '==', userUID)
      .get();
  },

  getNotOwnedByUser(
    userRef : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    orderBy = 'name',
  ) : Promise<FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>> {
    return this.animalCollection()
      .orderBy('owner')
      .orderBy(orderBy)
      .where('owner', '!=', userRef)
      .get();
  },

  getPictureDownloadURL(
    pictureID : string,
  ) : Promise<string> {
    return this.animalPictureDir().child(pictureID).getDownloadURL();
  },

  getReference(
    animalRef : FirebaseFirestoreTypes.DocumentReference,
  ) : Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>> {
    return animalRef.get();
  },

  uploadAnimalPicture(
    profilePictureRemoteURI: string,
    profilePictureLocalURI : string,
  ) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.animalPictureDir()
        .child(profilePictureRemoteURI)
        .putFile(profilePictureLocalURI)
        .then(() => {
          resolve(profilePictureRemoteURI);
        })
        .catch((err) => reject(err));
    });
  },

};

// Export default.
export default api;
