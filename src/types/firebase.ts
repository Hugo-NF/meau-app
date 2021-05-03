import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type DocumentData = FirebaseFirestoreTypes.DocumentData;
export type DocumentRefData = FirebaseFirestoreTypes.DocumentReference<DocumentData>;
export type Query = FirebaseFirestoreTypes.Query;
export type CollectionRef = FirebaseFirestoreTypes.CollectionReference;
export type DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot<DocumentData>;
