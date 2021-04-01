// Component to implement an infinite scroll for any type of content.

// Package imports.
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

// Style imports.
import { defaultProps, styledComponents } from './styles';

// Type declaration.
type InfiniteScrollState<T> = {
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
  dataFetchQuery: (lastEntry: T, pageNumber: number, pageSize: number) => Promise<Array<T>>,
  formatContent: (queryResponseData : T) => JSX.Element,
  loadingContainerStyles?: Record<string, unknown>,
}

// Styled components.
const { LoadingContainer } = styledComponents;

// Component implementation.
const InfiniteScroll = <T, _>({
  activityIndicatorColor,
  contentBatchSize,
  contentContainerStyles,
  dataFetchQuery,
  formatContent,
  loadingContainerStyles,
}: IInfiniteScroll<T>): JSX.Element => {
  // Variable declaration.
  const [infiniteScrollState, setInfiniteScrollState] = useState<InfiniteScrollState<T>>({
    data: [],
    error: null,
    loadingMore: false,
    page: 1,
  });

  // Functions declaration.
  function fetchData() : void {
    const lastDataElement = infiniteScrollState.data[infiniteScrollState.data.length - 1];
    const { page } = infiniteScrollState;

    dataFetchQuery(lastDataElement, page, contentBatchSize)
      .then((response) => {
        const contentReceived = response;

        if (page === 1) {
          setInfiniteScrollState({
            ...infiniteScrollState,
            data: contentReceived,
          });
        } else {
          setInfiniteScrollState({
            ...infiniteScrollState,
            data: infiniteScrollState.data.concat(contentReceived),
            loadingMore: false,
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

  function fetchMoreData() : void {
    setInfiniteScrollState({
      ...infiniteScrollState,
      page: infiniteScrollState.page + 1,
      loadingMore: true,
    });
    fetchData();
  }

  function renderLoading() : JSX.Element | null {
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

  function componentDidMount() : () => void {
    let mounted = true;

    if (mounted) fetchData();

    return function cleanUp() : void {
      mounted = false;
    };
  }

  // Component effects.
  useEffect(componentDidMount);

  // JSX returned.
  return (
    <FlatList
      contentContainerStyle={{ ...contentContainerStyles }}
      data={infiniteScrollState.data}
      renderItem={({ item }) => formatContent(item)}
      onEndReached={fetchMoreData}
      onEndReachedThreshold={0.9}
      initialNumToRender={contentBatchSize}
      ListEmptyComponent={renderLoading}
      ListFooterComponent={renderLoadingMore}
    />
  );
};

// Default props.
InfiniteScroll.defaultProps = defaultProps;

// Export default.
export default InfiniteScroll;
