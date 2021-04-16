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

// Type declarations.
type QueryParams = {
  orderBy? : string | undefined,
  startAfter? : FirebaseFirestoreTypes.DocumentFieldType | undefined,
  limit? : number | undefined
}

// Service implementation.
const api = {
  createAuth(
    email : string, password : string,
  ) : Promise<FirebaseAuthTypes.UserCredential> {
    return auth().createUserWithEmailAndPassword(email, password);
  },

  createQuery(
    queryParams : QueryParams = {
      orderBy: 'username',
    },
  ) : FirebaseFirestoreTypes.Query {
    let query : FirebaseFirestoreTypes.Query = this.userCollection();

    if (queryParams.orderBy !== undefined) query = query.orderBy(queryParams.orderBy);

    if (queryParams.startAfter !== undefined) query = query.startAfter(queryParams.startAfter);

    if (queryParams.limit !== undefined) query = query.limit(queryParams.limit);

    return query;
  },

  currentUser() : FirebaseAuthTypes.User | null {
    const { currentUser } = auth();
    return currentUser;
  },

  currentUserDocument() : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> {
    return this.userDocument(this.currentUser()?.uid);
  },

  getPicture(
    pictureUID : string,
  ) : FirebaseStorageTypes.Reference {
    return this.userProfilePictureDir().child(pictureUID);
  },

  getPictureDownloadURL(
    pictureUID : string,
  ) : Promise<string> {
    return this.getPicture(pictureUID).getDownloadURL();
  },

  getReference(
    userRef : FirebaseFirestoreTypes.DocumentReference,
  ) : Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>> {
    return userRef.get();
  },

  getUser(
    userUID : string | undefined,
  ) : Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>> {
    return this.userDocument(userUID).get();
  },

  getUserProfilePicture(
    userUID : string | undefined,
  ) : Promise<FirebaseStorageTypes.Reference | null> {
    return new Promise((resolve, reject) => {
      this.userDocument(userUID).get()
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

  setDocumentData(
    userUID : string, documentData : FirebaseFirestoreTypes.DocumentData,
  ) : Promise<void> {
    return this.userDocument(userUID).set(documentData);
  },

  signIn(
    email : string, password : string,
  ) : Promise<FirebaseAuthTypes.UserCredential> {
    return auth().signInWithEmailAndPassword(email, password);
  },

  signOut() : Promise<void> {
    return auth().signOut();
  },

  uploadProfilePicture(
    profilePictureRemoteURI: string,
    profilePictureLocalURI : string,
  ) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.userProfilePictureDir()
        .child(profilePictureRemoteURI)
        .putFile(profilePictureLocalURI)
        .then(() => {
          resolve(profilePictureRemoteURI);
        })
        .catch((err) => reject(err));
    });
  },

  userCollection() : FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData> {
    return firestore().collection('users');
  },

  userDocument(
    userUID : string | undefined,
  ) : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> {
    return this.userCollection().doc(userUID);
  },

  userProfilePictureDir() : FirebaseStorageTypes.Reference {
    return storage().ref(Values.IMAGE_DIRECTORY);
  },
};

// Export default.
export default api;
