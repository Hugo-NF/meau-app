// Type declaration.
export type InfiniteScrollState<T> = {
  allDataFetched: boolean,
  data: Array<T>,
  error: string | null,
  loadingMore: boolean,
  page: number,
}

// Interface declaration.
export interface IInfiniteScroll<T> {
  activityIndicatorColor?: string,
  contentBatchSize: number,
  contentContainerStyles?: Record<string, unknown>,
  dataFetchQuery: (lastEntry: T | null, pageNumber: number, pageSize: number) => Promise<Array<T>>,
  errorContainerStyles?: Record<string, unknown>,
  formatContent: (queryResponseData : T) => JSX.Element,
  keyExtractorFunction: (item: T) => string,
  loadingContainerStyles?: Record<string, unknown>,
  noDataFoundContainerStyles?: Record<string, unknown>,
  numColumns: number,
}
