// Package imports.
import {
  ImageProps, TextProps, TouchableOpacityProps, ViewProps,
} from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../../constants';

// Styled components.
export const styledComponents = {

  AdoptionButtonWrapper: styled.View<ViewProps>`
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 40px;
    justify-content: center;
    margin: 28px 0;
    width: 232px;
  `,

  AnimalImage: styled.Image<ImageProps>`
    height: 183px;
  `,

  ButtonText: styled.Text<TextProps>`
    color: ${Theme.elements.text};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    text-transform: uppercase;
  `,

  ButtonTextStrong: styled.Text<TextProps>`
    color: ${Theme.elements.buttonText};
    font-family: 'Roboto_500Medium';
    font-size: 12px;
    text-transform: uppercase;
  `,

  CarouselWrapper: styled.View<ViewProps>`
    align-items: center;
    height: 184px;
    justify-content: flex-end;
    width: 360px;
  `,

  CentralizedContainer: styled.View<ViewProps>`
    width: 312px;
  `,

  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    background-color: ${Theme.default.background};
  `,

  FloatingButton: styled.TouchableOpacity<TouchableOpacityProps>`
    align-items: center;
    background-color: ${Theme.elements.floatingButton};
    border-radius: 28px;
    elevation: 1;
    height: 56px;
    justify-content: center;
    width: 56px;
  `,

  FloatingButtonWrapper: styled.View<ViewProps>`
    align-items: flex-end;
    margin-top: 156px;
    position: absolute;
    justify-content: flex-end;
    width: 328px;
  `,

  Label: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    margin-bottom: 8px;
    margin-top: 16px;
    text-transform: uppercase;
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

  OptionButtonsWrapper: styled.View<ViewProps>`
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 40px;
    justify-content: center;
    margin: 28px 16px;
  `,

  RegularText: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 14px;
  `,

  SectionItem: styled.View<ViewProps>`
    flex: 1;
    flex-direction: column;
  `,

  SectionRow: styled.View<ViewProps>`
    flex-direction: row;
    justify-content: flex-start;
  `,

  SectionEnd: styled.View<ViewProps>`
    border-bottom-width: 1px;
    border-color: ${Theme.elements.sectionBreak};
    height: 16px;
    width: 328px;
  `,

  SectionEndContainer: styled.View<ViewProps>`
    width: 328px;
  `,

  TitleText: styled.Text<TextProps>`
    color: ${Theme.elements.titleText}
    font-family: 'Roboto_500Medium';
    font-size: 16px;
    margin-top: 16px;
  `,

};

// Styles.
export const styles = {
  adoptionButton: {
    alignItems: 'center',
    backgroundColor: Theme.elements.adoptionButton,
    borderRadius: '2px',
    height: '40px',
    width: '232px',
  },

  floatingButtonIcon: {
    color: Theme.elements.buttonText,
  },

  headerLayoutHeaderPrimaryStyles: {
    backgroundColor: Theme.elements.headerPrimary,
    height: '56px',
    maxHeight: '56px',
  },

  headerLayoutHeaderSecondaryStyles: {
    backgroundColor: Theme.elements.headerSecondary,
    height: '56px',
    maxHeight: '56px',
  },

  ownerOptionButton: {
    backgroundColor: Theme.default.primary,
    borderRadius: '2px',
    height: '40px',
    marginLeft: '8px',
    marginRight: '8px',
    width: '148px',
  },

  paginationStyles: {
    container: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      position: 'absolute',
    },

    dot: {
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      borderRadius: 5,
      height: 10,
      marginHorizontal: 8,
      width: 10,
    },

    inactiveDot: {

    },

    inactiveDotOpacity: 0.4,
    inactiveDotScale: 0.6,
  },

  primaryLabel: {
    color: Theme.elements.labelPrimary,
  },

  secondaryLabel: {
    color: Theme.elements.labelSecondary,
  },

  activityIndicatorColor: Theme.default.primary,
  animalOwnerStatusBarColor: Theme.elements.statusBarPrimary,
  regularUserStatusBarColor: Theme.elements.statusBarSecondaryDark,
};
