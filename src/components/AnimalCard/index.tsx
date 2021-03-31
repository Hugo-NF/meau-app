import React, { ReactNode, useState } from 'react';
import {
  CardBody, CardBox, CardHeader, CardImage, CardOptions, CardTitle,
} from './styles';

interface IAnimalCardProps {
    title: string;
    imageUrlPromise: Promise<string>;
    headerOptions?: ReactNode;
    body?: ReactNode;
}

export const AnimalCard = ({
  title, body, headerOptions, imageUrlPromise,
} : IAnimalCardProps) : JSX.Element => {
  const [petImage, setPetImage] = useState('');

  imageUrlPromise.then((image) => {
    setPetImage(image);
  });

  return (
    <CardBox>
      <CardHeader backgroundColor="#cfe9e5">
        <CardTitle>
          {title}
        </CardTitle>
        <CardOptions>
          {headerOptions}
        </CardOptions>
      </CardHeader>
      <CardImage source={petImage !== '' ? { uri: petImage } : {}} />
      <CardBody>{body}</CardBody>
    </CardBox>
  );
};

AnimalCard.defaultProps = {
  headerOptions: undefined,
  body: undefined,
};
