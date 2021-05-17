import { Query, CollectionRef } from '../../types/services/firebase';

export interface PaginatedMetaData {
  pageNumber: number;
  pageSize: number;
  lastElementMarker: unknown[];
  marker: string;
  orderByDirection?: 'asc' | 'desc';
}

export const filterPaginated = (source: Query | CollectionRef, paginatedMetaData?: PaginatedMetaData): Query => {
  if (!paginatedMetaData) return source;

  const {
    pageNumber, pageSize, lastElementMarker, marker, orderByDirection,
  } = paginatedMetaData;

  const markers = lastElementMarker.filter((m) => m !== null);

  if (pageNumber === 1 || markers.length === 0) {
    return source
      .orderBy(marker, orderByDirection)
      .limit(pageSize);
  }
  return source
    .orderBy(marker, orderByDirection)
    .limit(pageSize)
    .startAfter(...markers);
};
