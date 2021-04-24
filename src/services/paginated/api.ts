import firestore from '@react-native-firebase/firestore';
import { Query } from '../../types/firebase';

export interface PaginatedMetaData {
  pageNumber: number;
  pageSize: number;
  lastElementMarker: unknown;
  marker: string;
}

export const queryPaginated = (collection: string, paginatedMetaData?: PaginatedMetaData): Query => {
  if (!paginatedMetaData) return firestore().collection(collection);

  const {
    pageNumber, pageSize, lastElementMarker, marker,
  } = paginatedMetaData;
  let query;

  if (pageNumber === 1 || lastElementMarker == null) {
    query = firestore().collection(collection)
      .limit(pageSize)
      .orderBy(marker);
  } else {
    query = firestore().collection(collection)
      .limit(pageSize)
      .orderBy(marker)
      .startAfter(lastElementMarker);
  }
  return query;
};
