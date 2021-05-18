export interface PaginatedMetaData {
  pageNumber: number;
  pageSize: number;
  lastElementMarker: unknown[];
  marker: string;
  orderByDirection?: 'asc' | 'desc';
}
