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
    margin-bottom: 32;
    color: #434343;
    text-transform: uppercase;
    text-align: center;
  `,
};

// Styles.
