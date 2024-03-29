import { ImageProps, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../../constants';
import { CardHeaderProps } from '../../types/components/AnimalCard';

export const CardBox = styled.View<ViewProps>`
    width: 344px;
    background: ${Theme.default.background};
    elevation: 3;
    border-radius: 6px;
    margin-bottom: 8px;
`;

export const CardHeader = styled.View<CardHeaderProps>`
    height: 32px;
    background: ${(props) => props.backgroundColor};
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    flex-direction: row;
    padding-left: 16px;
    padding-right: 16px;
`;

export const CardTitle = styled.Text<TextProps>`
    flex: 1;
    text-align-vertical: center;
    font-family: Roboto_500Medium;
    font-size: 16px;
    color: ${Theme.elements.textDark};
`;

export const CardOptions = styled.View<ViewProps>`
    justify-content: center;
`;

export const CardImage = styled.Image<ImageProps>`
    height: 183px;
    width: 344px;
`;

export const CardImageLoading = styled.View<ViewProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 183px;
  width: 344px;
`;

export const CardBody = styled.View<ViewProps>`
  height: 49px;
  padding: 5px;
`;
