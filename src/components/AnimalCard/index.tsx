import React, { ReactNode, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
  CardBody, CardBox, CardHeader, CardImage, CardOptions, CardTitle,
} from './styles';

interface IAnimalCardPet {
  id: string
}

interface IAnimalCardProps {
    title: string;
    imageUrlPromise: Promise<string>;
    headerOptions?: ReactNode;
    body?: ReactNode;
    headerBackground: string;
    pet: IAnimalCardPet;
    onPress?: (pet: IAnimalCardPet) => void;
}

const AnimalCard = ({
  title, body, headerOptions, imageUrlPromise, headerBackground, pet, onPress,
} : IAnimalCardProps) : JSX.Element => {
  const [petImage, setPetImage] = useState('');

  imageUrlPromise.then((image) => {
    setPetImage(image);
  }).catch((() => null));

  return (
    <TouchableWithoutFeedback onPress={() => (onPress ? onPress(pet) : () => null)}>
      <CardBox>
        <CardHeader backgroundColor={headerBackground}>
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
    </TouchableWithoutFeedback>
  );
};

export default AnimalCard;

AnimalCard.defaultProps = {
  headerOptions: undefined,
  body: undefined,
  onPress: () => null,
};
