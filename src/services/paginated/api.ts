import firestore from '@react-native-firebase/firestore';
import { Query } from '../../types/firebase';

export interface PaginatedMetaData {
  pageNumber: number;
  pageSize: number;
  lastElementMarker: any;
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
      .limit((pageNumber - 1) * pageSize)
      .orderBy(marker)
      .startAfter(lastElementMarker);
  }
  return query;
};
