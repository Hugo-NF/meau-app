import { Query, CollectionRef } from '../../types/firebase';

export interface PaginatedMetaData {
  pageNumber: number;
  pageSize: number;
  lastElementMarker: unknown[];
  marker: string;
}

export const filterPaginated = (source: Query | CollectionRef, paginatedMetaData?: PaginatedMetaData): Query => {
  if (!paginatedMetaData) return source;

  const {
    pageNumber, pageSize, lastElementMarker, marker,
  } = paginatedMetaData;

  const markers = lastElementMarker.filter((m) => m !== null);

  if (pageNumber === 1 || markers.length === 0) {
    return source
      .orderBy(marker)
      .limit(pageSize);
  }
  return source
    .orderBy(marker)
    .limit(pageSize)
    .startAfter(...markers);
};
