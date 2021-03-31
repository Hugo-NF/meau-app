import { ImageProps, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../../constants';

interface CardHeaderProps extends ViewProps {
    backgroundColor: string;
}

export const CardBox = styled.View<ViewProps>`
    width: 344px;
    background: ${Theme.default.background};
    elevation: 3;
    border-radius: 10px;
    margin-bottom: 8px;
`;

export const CardHeader = styled.View<CardHeaderProps>`
    height: 32px;
    background: ${(props) => props.backgroundColor};
    flex-direction: row;
    padding-left: 16px;
    padding-right: 16px;
`;

export const CardTitle = styled.Text<TextProps>`
    flex: 1;
    text-align-vertical: center;
    font-family: Roboto_500Medium;
    font-size: 16px;
    color: ${Theme.elements.headerText};
`;

export const CardOptions = styled.View<ViewProps>`
    justify-content: center;
`;

export const CardImage = styled.Image<ImageProps>`
    height: 183px;
`;

export const CardBody = styled.View<ViewProps>`
    padding: 5px;
`;
