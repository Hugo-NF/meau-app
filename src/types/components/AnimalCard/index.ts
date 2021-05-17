import { ReactNode } from 'react';
import { ViewProps } from 'react-native';

export interface IAnimalCardProps {
  title: string;
  imageUrl: string | null;
  headerOptions?: ReactNode;
  body?: ReactNode;
  headerBackground: string;
  onPress?: () => void;
}

export interface CardHeaderProps extends ViewProps {
  backgroundColor: string;
}
