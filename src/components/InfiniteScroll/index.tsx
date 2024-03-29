// Component to implement an infinite scroll for any type of content.

// Package imports.
import React, { useCallback, useState } from 'react';
import useIsMounted from 'ismounted';
import { ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Style imports.
import { defaultProps, styledComponents } from './styles';

// Typings imports
import { InfiniteScrollState, IInfiniteScroll } from '../../types/components/InfiniteScroll';

// Styled components.
const {
  ErrorMessage,
  LoadingContainer,
  NoDataFoundMessage,
  TextContainer,
} = styledComponents;

// Component implementation.
const InfiniteScroll = <T, _>({
  activityIndicatorColor,
  contentBatchSize,
  contentContainerStyles,
  dataFetchQuery,
  errorContainerStyles,
  formatContent,
  keyExtractorFunction,
  loadingContainerStyles,
  noDataFoundContainerStyles,
  numColumns,
}: IInfiniteScroll<T>): JSX.Element => {
  // Variable declaration.
  const isMounted = useIsMounted();
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

        if (isMounted.current) {
          if (contentReceived.length === 0) {
            setInfiniteScrollState({
              allDataFetched: true,
              data: [],
              error: null,
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
        }
      })
      .catch((err) => {
        if (isMounted.current) {
          setInfiniteScrollState({
            allDataFetched: true,
            data: [],
            error: err,
            loadingMore: false,
            page: 1,
          });
        }
      });
  }, [contentBatchSize, dataFetchQuery, isMounted]);

  // Function declarations.
  const onComponentFocus = useCallback(() : void => {
    fetchInitialData();
  }, [fetchInitialData]);

  function fetchMoreData() : void {
    if (
      !infiniteScrollState.loadingMore
      && !infiniteScrollState.allDataFetched
      && isMounted.current
    ) {
      setInfiniteScrollState({
        ...infiniteScrollState,
        loadingMore: true,
      });

      const lastDataElement = infiniteScrollState.data[infiniteScrollState.data.length - 1];
      const { page } = infiniteScrollState;

      dataFetchQuery(lastDataElement, page, contentBatchSize)
        .then((response) => {
          const contentReceived = response;

          if (isMounted.current) {
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
          }
        })
        .catch((err) => {
          if (isMounted.current) {
            setInfiniteScrollState({
              ...infiniteScrollState,
              allDataFetched: true,
              error: err,
              loadingMore: false,
            });
          }
        });
    }
  }

  function renderError() : JSX.Element | null {
    if (infiniteScrollState.error != null) {
      return (
        <TextContainer style={{ ...errorContainerStyles }}>
          <ErrorMessage>
            Erro ao buscar dados: {infiniteScrollState.error}
          </ErrorMessage>
        </TextContainer>
      );
    }

    return null;
  }

  function renderLoading() : JSX.Element {
    if (infiniteScrollState.allDataFetched) {
      return (
        <TextContainer style={{ ...noDataFoundContainerStyles }}>
          <NoDataFoundMessage>Não há dados para exibir!</NoDataFoundMessage>
        </TextContainer>
      );
    }

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
  useFocusEffect(onComponentFocus);

  // JSX returned.
  return (
    <FlatList
      contentContainerStyle={{ ...contentContainerStyles }}
      data={infiniteScrollState.data}
      initialNumToRender={contentBatchSize}
      keyExtractor={(item) => keyExtractorFunction(item)}
      ListEmptyComponent={renderLoading}
      ListFooterComponent={renderLoadingMore}
      ListHeaderComponent={renderError}
      nestedScrollEnabled
      numColumns={numColumns}
      onEndReached={fetchMoreData}
      onEndReachedThreshold={0.1}
      renderItem={({ item }) => formatContent(item)}
    />
  );
};

// Default props.
InfiniteScroll.defaultProps = defaultProps;

// Export default.
export default InfiniteScroll;
