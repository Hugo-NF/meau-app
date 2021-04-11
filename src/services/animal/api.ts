// Package imports.
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Type imports.
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';

// User module imports.
import { Values } from '../../constants';

// Service implementation.
const api = {
  animalFirestoreCollection() : FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData> {
    return firestore().collection('animals');
  },

  animalFirestoreDocument(
    animalUID : string | undefined,
  ) : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> {
    return this.animalFirestoreCollection().doc(animalUID);
  },

  animalStoragePictureDir() : FirebaseStorageTypes.Reference {
    return storage().ref(Values.IMAGE_DIRECTORY);
  },

  animalStoragePictures(
    animalUID : string | undefined,
  ) : Promise<Array<FirebaseStorageTypes.Reference>> {
    return new Promise((resolve, reject) => {
      this.animalFirestoreDocument(animalUID).get()
        .then(
          (response) => {
            const pictures : Array<string> = response.data()?.pictures;

            if (pictures !== null && pictures.length !== 0) {
              resolve(
                pictures.map(
                  (picture) => storage().ref(Values.IMAGE_DIRECTORY).child(picture),
                ),
              );
            } else {
              resolve([]);
            }
          },
        )
        .catch((err) => reject(err));
    });
  },
};

// Export default.
export default api;
