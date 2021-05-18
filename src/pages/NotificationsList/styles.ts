// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Styled components.
export const styledComponents = {

  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    background-color: ${Theme.default.background};
    padding-bottom: 20px;
  `,

  LoadingContainer: styled.View<ViewProps>`
    position: relative;
    margin-bottom: 20px;
    margin-top: 20px;
  `,

  NoDataReturnedText: styled.Text<TextProps>`
    margin-top: 20px;
  `,

  NotificationContainer: styled.View<ViewProps>`
    flex-direction: row;
    align-items: center;
    background-color: #eee;
    height: 50px;
    margin-top: 20px;
    padding: 10px;
    width: 300px;
  `,

  NotificationTextView: styled.View<ViewProps>`
    flex: 1;
    padding-right: 10px;
  `,

};

// Styles.
export const styles = {
  headerLayout: {
    backgroundColor: Theme.elements.headerPrimaryDark,
  },

  activityIndicatorColor: Theme.default.primary,
  statusBarColor: Theme.elements.statusBarPrimaryDark,
};
