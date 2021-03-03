// Package imports.
import { PixelRatio, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Styled components.
export const styledComponents = {
  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
  `,

  InfoText: styled.Text<TextProps>`
    width: 328px;
    background-color: #cfe9e5;
    padding: 8px;
    text-align: center;
    font-size: 14px;
    color: #434343;
    margin-top: 16px;
    margin-bottom: 28px;
  `,

  SessionText: styled.Text<TextProps>`
    width: 100%;
    margin-bottom: 32px;
    margin-left: ${PixelRatio.getPixelSizeForLayoutSize(22)}px;
    color: #434343;
    text-transform: uppercase;
    text-align: left;
  `,

  ButtonText: styled.Text<TextProps>`
    text-transform: uppercase;
  `,
};

// Styles.
export const styles = {
  asyncButton: {
    flex: 1,
    width: '250px',
    height: '50px',
    backgroundColor: '#88c9bf',
    borderRadius: '5px',
    marginTop: '10px',
    marginBottom: '54px',
  },
};
