// Package imports.
import { FlexAlignType, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../../constants';

// Styled components.
export const styledComponents = {
  Container: styled.View<ViewProps>`
    align-items: center;
    flex: 1;
    background-color: ${Theme.default.background}
    padding-top: 12px;
  `,

  InterestedUserText: styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-size: 14px;
  `,

  LoadingContainer: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    background-color: ${Theme.default.background};
    justify-content: center;
  `,

  LoadingText: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 16px;
    margin-bottom: 10px;
  `,
};

// Styles.
export const styles = {

  interestedUserFeedStyles: {
    paddingBottom: 0,
    paddingTop: 0,
  },

  interestedUserProfilePicture: {
    borderRadius: 84,
    height: 84,
    marginBottom: 8,
    width: 84,
  },

  interestedUserTouchableOpacity: {
    alignItems: 'center' as FlexAlignType,
    marginBottom: 24,
    marginLeft: 36,
    marginRight: 36,
  },

  loadingIconColor: Theme.default.primary,
  statusBarColor: Theme.elements.statusBarPrimary,
};
