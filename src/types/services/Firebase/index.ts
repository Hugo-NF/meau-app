import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type CollectionRef = FirebaseFirestoreTypes.CollectionReference;
export type DocumentData = FirebaseFirestoreTypes.DocumentData;
export type DocumentRefData = FirebaseFirestoreTypes.DocumentReference<DocumentData>;
export type DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot<DocumentData>;
export type Query = FirebaseFirestoreTypes.Query;
export type QuerySnapshot = FirebaseFirestoreTypes.QuerySnapshot<DocumentData>;
export type QuerySnapshotDocuments = FirebaseFirestoreTypes.QueryDocumentSnapshot<DocumentData>[];
export type Timestamp = FirebaseFirestoreTypes.Timestamp;

export type QueryParams = {
  orderBy? : string | undefined,
  startAfter? : FirebaseFirestoreTypes.DocumentFieldType | undefined,
  limit? : number | undefined
}
