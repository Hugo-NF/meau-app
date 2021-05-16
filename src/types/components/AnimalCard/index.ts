import { ReactNode } from 'react';

export interface IAnimalCardProps {
  title: string;
  imageUrl: string | null;
  headerOptions?: ReactNode;
  body?: ReactNode;
  headerBackground: string;
  onPress?: () => void;
}
