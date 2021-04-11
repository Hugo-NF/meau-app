// Package imports.
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Type imports.
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';

// User module imports.
import { Values } from '../../constants';

// Service implementation.
const api = {
  createUserWithEmailAndPassword(
    email : string, password : string,
  ) : Promise<FirebaseAuthTypes.UserCredential> {
    return auth().createUserWithEmailAndPassword(email, password);
  },

  currentUser() : FirebaseAuthTypes.User | null {
    return auth().currentUser;
  },

  signInWithEmailAndPassword(
    email : string, password : string,
  ) : Promise<FirebaseAuthTypes.UserCredential> {
    return auth().signInWithEmailAndPassword(email, password);
  },

  userFirestoreCollection() : FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData> {
    return firestore().collection('users');
  },

  userFirestoreDocument(
    userUID : string | undefined,
  ) : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> {
    return this.userFirestoreCollection().doc(userUID);
  },

  userStorageProfilePicture(
    userUID : string | undefined,
  ) : Promise<FirebaseStorageTypes.Reference | null> {
    return new Promise((resolve, reject) => {
      this.userFirestoreDocument(userUID).get()
        .then(
          (response) => {
            const profilePicture = response.data()?.profilePicture;

            if (profilePicture !== null && profilePicture !== '') {
              resolve(
                storage().ref(Values.IMAGE_DIRECTORY).child(profilePicture),
              );
            } else {
              resolve(null);
            }
          },
        )
        .catch((err) => {
          reject(err);
        });
    });
  },

  userStorageProfilePictureDir() : FirebaseStorageTypes.Reference {
    return storage().ref(Values.IMAGE_DIRECTORY);
  },
};

// Export default.
export default api;
