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
  loading: boolean,
  loadingMore: boolean,
  page: number,
}

// Interface declaration.
interface IInfiniteScroll<T> {
  containerStyles?: Record<string, unknown>,
  contentBatchSize: number,
  dataFetchQuery: (pageNumber: number, pageSize: number) => Promise<Array<T>>,
  formatContent: (queryResponseData : T) => JSX.Element,
}

// Styled components.
const {
  LoadingMoreContainer,
} = styledComponents;

// Component implementation.
const InfiniteScroll = <T, _>({
  containerStyles, contentBatchSize, dataFetchQuery, formatContent,
}: IInfiniteScroll<T>): JSX.Element => {
  // Variable declaration.
  const [infiniteScrollState, setInfiniteScrollState] = useState<InfiniteScrollState<T>>({
    data: [],
    error: null,
    loading: true,
    loadingMore: false,
    page: 1,
  });

  // Functions declaration.
  function fetchData() : void {
    const { page } = infiniteScrollState;

    dataFetchQuery(page, contentBatchSize)
      .then((response) => {
        const contentReceived = response;

        if (page === 1) {
          setInfiniteScrollState({
            ...infiniteScrollState,
            data: contentReceived,
            loading: false,
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

  function renderFooter() : JSX.Element | null {
    if (infiniteScrollState.loadingMore) {
      return (
        <LoadingMoreContainer>
          <ActivityIndicator />
        </LoadingMoreContainer>
      );
    }

    return null;
  }

  function componentDidMount() : void {
    fetchData();
  }

  // Component effects.
  useEffect(componentDidMount);

  // JSX returned.
  return (
    <FlatList
      contentContainerStyle={{ ...containerStyles }}
      data={infiniteScrollState.data}
      renderItem={({ item }) => formatContent(item)}
      onEndReached={fetchMoreData}
      onEndReachedThreshold={0.4}
      initialNumToRender={contentBatchSize}
      ListFooterComponent={renderFooter}
    />
  );
};

// Default props.
InfiniteScroll.defaultProps = defaultProps;

// Export default.
export default InfiniteScroll;
