// Component to implement an infinite scroll for any type of content.

// Package imports.
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

// Style imports.
import { defaultProps, styledComponents } from './styles';

// Type declaration.
type InfiniteScrollState<T> = {
  allDataFetched: boolean,
  data: Array<T>,
  error: string | null,
  loadingMore: boolean,
  page: number,
}

// Interface declaration.
interface IInfiniteScroll<T> {
  activityIndicatorColor?: string,
  contentBatchSize: number,
  contentContainerStyles?: Record<string, unknown>,
  dataFetchQuery: (lastEntry: T | null, pageNumber: number, pageSize: number) => Promise<Array<T>>,
  errorContainerStyles?: Record<string, unknown>,
  formatContent: (queryResponseData : T) => JSX.Element,
  loadingContainerStyles?: Record<string, unknown>,
  numColumns: number,
}

// Styled components.
const { ErrorContainer, ErrorMessage, LoadingContainer } = styledComponents;

// Component implementation.
const InfiniteScroll = <T, _>({
  activityIndicatorColor,
  contentBatchSize,
  contentContainerStyles,
  dataFetchQuery,
  errorContainerStyles,
  formatContent,
  loadingContainerStyles,
  numColumns,
}: IInfiniteScroll<T>): JSX.Element => {
  // Variable declaration.
  const [infiniteScrollState, setInfiniteScrollState] = useState<InfiniteScrollState<T>>({
    allDataFetched: false,
    data: [],
    error: null,
    loadingMore: false,
    page: 1,
  });

  // Callbacks declaration.
  const fetchInitialData = useCallback(() : void => {
    dataFetchQuery(null, 1, contentBatchSize)
      .then((response) => {
        const contentReceived = response;

        if (contentReceived.length === 0) {
          setInfiniteScrollState({
            allDataFetched: true,
            data: [],
            error: 'No data found',
            loadingMore: false,
            page: 1,
          });
        } else {
          setInfiniteScrollState({
            allDataFetched: false,
            data: contentReceived,
            error: null,
            loadingMore: false,
            page: 2,
          });
        }
      })
      .catch((err) => {
        setInfiniteScrollState({
          allDataFetched: false,
          data: [],
          error: err,
          loadingMore: false,
          page: 1,
        });
      });
  }, [contentBatchSize, dataFetchQuery]);

  // Function declarations.
  function componentDidMount() : () => void {
    let mounted = true;

    if (mounted) fetchInitialData();

    return function cleanUp() : void {
      mounted = false;
    };
  }

  function fetchMoreData() : void {
    if (!infiniteScrollState.loadingMore && !infiniteScrollState.allDataFetched) {
      setInfiniteScrollState({
        ...infiniteScrollState,
        loadingMore: true,
      });

      const lastDataElement = infiniteScrollState.data[infiniteScrollState.data.length - 1];
      const { page } = infiniteScrollState;

      dataFetchQuery(lastDataElement, page, contentBatchSize)
        .then((response) => {
          const contentReceived = response;

          if (contentReceived.length === 0) {
            setInfiniteScrollState({
              ...infiniteScrollState,
              allDataFetched: true,
              loadingMore: false,
              error: null,
            });
          } else {
            setInfiniteScrollState({
              ...infiniteScrollState,
              data: infiniteScrollState.data.concat(contentReceived),
              error: null,
              loadingMore: false,
              page: infiniteScrollState.page + 1,
            });
          }
        })
        .catch((err) => {
          setInfiniteScrollState({
            ...infiniteScrollState,
            error: err,
          });
        });
    }
  }

  function renderError() : JSX.Element | null {
    if (infiniteScrollState.error != null) {
      return (
        <ErrorContainer style={{ ...errorContainerStyles }}>
          <ErrorMessage>
            Erro ao buscar dados: {infiniteScrollState.error}
          </ErrorMessage>
        </ErrorContainer>
      );
    }

    return null;
  }

  function renderLoading() : JSX.Element {
    return (
      <LoadingContainer style={{ ...loadingContainerStyles }}>
        <ActivityIndicator size="large" color={activityIndicatorColor} />
      </LoadingContainer>
    );
  }

  function renderLoadingMore() : JSX.Element | null {
    if (infiniteScrollState.loadingMore) return renderLoading();

    return null;
  }

  // Component effects.
  useEffect(componentDidMount, [fetchInitialData]);

  // JSX returned.
  return (
    <FlatList
      numColumns={numColumns}
      contentContainerStyle={{ ...contentContainerStyles }}
      data={infiniteScrollState.data}
      initialNumToRender={contentBatchSize}
      ListEmptyComponent={renderLoading}
      ListFooterComponent={renderLoadingMore}
      ListHeaderComponent={renderError}
      nestedScrollEnabled
      onEndReached={fetchMoreData}
      onEndReachedThreshold={0.1}
      renderItem={({ item }) => formatContent(item)}
    />
  );
};

// Default props.
InfiniteScroll.defaultProps = { ...defaultProps, numColumns: 1 };

// Export default.
export default InfiniteScroll;
