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

  animalPictureDir() : FirebaseStorageTypes.Reference {
    return storage().ref(Values.IMAGE_DIRECTORY);
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

  getPictureDownloadURL(
    pictureID : string,
  ) : Promise<string> {
    return this.animalPictureDir().child(pictureID).getDownloadURL();
  },

};

// Export default.
export default api;
