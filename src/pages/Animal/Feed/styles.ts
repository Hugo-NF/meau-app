// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../../constants';

// Styled components.
export const styledComponents = {
  CardText: styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    text-transform: uppercase;
  `,

  CardTextContainer: styled.View<ViewProps>`
    flex: 1;
    flex-direction: column;
    justify-content: center;
  `,

  CardTextRow: styled.View<ViewProps>`
    flex: 1;
    flex-direction: row;
    justify-content: space-around;
  `,

  Container: styled.View<ViewProps>`
    align-items: center;
    flex: 1;
    background-color: ${Theme.default.background}
  `,
};

// Styles.
export const styles = {
  adoptionFeedContainerStyles: {
    paddingBottom: 8,
    paddingTop: 8,
  },

  headerLayout: {
    backgroundColor: Theme.elements.headerSecondaryDark,
  },

  cardHeaderBackground: Theme.elements.headerSecondary,
  cardIconColor: Theme.elements.textDark,
  statusBarColor: Theme.elements.statusBarSecondaryDark,
};
