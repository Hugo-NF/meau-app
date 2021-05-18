// Package imports.
import { TextProps, TouchableOpacityProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../../constants';

// Styled components.
export const styledComponents = {

  ChatListEntryContainer: styled.TouchableOpacity<TouchableOpacityProps>`
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: flex-start;

    border-top-width: 0.8px;
    border-color: ${Theme.elements.chatListEntrySeparator};
    height: 80px;
    margin-left: 16px;
    margin-right: 16px;
    padding-bottom: 16px;
    padding-top: 16px;
    width: 328px;
  `,

  ChatListEntryMessagePreviewText: styled.Text<TextProps>`
    color: ${Theme.elements.text};
    font-family: 'Roboto_400Regular';
    font-size: 14px;
  `,

  ChatListEntryMessagePreviewTextFaded: styled.Text<TextProps>`
    color: ${Theme.elements.textFaded};
    font-family: 'Roboto_400Regular';
    font-size: 14px;
  `,

  ChatListEntryTextContainer: styled.View<ViewProps>`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: flex-start;

    margin-bottom: 12px;
    margin-top: 4px;
  `,

  ChatListEntryTimestampText: styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    margin-bottom: 12px;
    margin-top: 4px;
  `,

  ChatListEntryTitleText: styled.Text<TextProps>`
    color: ${Theme.elements.chatListEntryTitle};
    font-family: 'Roboto_500Medium';
    font-size: 12px;
    text-transform: uppercase;
  `,

  ChatListEntryTitleTextFaded: styled.Text<TextProps>`
    color: ${Theme.elements.chatListEntryTitleFaded};
    font-family: 'Roboto_500Medium';
    font-size: 12px;
    text-transform: uppercase;
  `,

  Container: styled.View<ViewProps>`
    align-items: center;
    flex: 1;
    background-color: ${Theme.default.background}
  `,

};

// Styles.
export const styles = {

  chatListEntryImage: {
    size: 48,
    styles: {
      marginRight: 8,
    },
  },

  headerLayout: {
    backgroundColor: Theme.elements.headerPrimaryDark,
  },

  infiniteScroll: {
    contentContainerStyles: {
      paddingTop: 0,
      paddingBottom: 60,
    },

    noDataFoundContainerStyles: {
      paddingTop: 20,
    },
  },

  statusBarColor: Theme.elements.statusBarPrimaryDark,

};
