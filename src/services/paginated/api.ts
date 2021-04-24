import { Query } from '../../types/firebase';

export interface PaginatedMetaData {
  pageNumber: number;
  pageSize: number;
  lastElementMarker: unknown[];
  marker: string;
}

export const filterPaginated = (query: Query, paginatedMetaData?: PaginatedMetaData): Query => {
  if (!paginatedMetaData) return query;

  const {
    pageNumber, pageSize, lastElementMarker, marker,
  } = paginatedMetaData;

  let markers = lastElementMarker as unknown[];
  markers = markers.filter((m) => m !== null);

  if (pageNumber === 1 || markers.length === 0) {
    return query
      .orderBy(marker)
      .limit(pageSize);
  }
  return query
    .orderBy(marker)
    .limit(pageSize)
    .startAfter(...markers);
};
