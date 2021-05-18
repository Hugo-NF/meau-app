import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import animalAPI from '../../services/animal/api';

import { Images, Theme } from '../../constants';

import { IAnimalCardProps } from '../../types/components/AnimalCard';
import {
  CardBody, CardBox, CardHeader, CardImage, CardImageLoading, CardOptions, CardTitle,
} from './styles';

const AnimalCard = ({
  title, body, headerOptions, imageUrl, headerBackground, onPress,
} : IAnimalCardProps) : JSX.Element => {
  const [petImage, setPetImage] = useState<string | null>(null);
  const [fetchingImage, setFetchingImage] = useState<boolean>(true);

  if (imageUrl !== null) {
    animalAPI.getPictureDownloadURL(imageUrl)
      .then((image) => {
        setPetImage(image);
        setFetchingImage(false);
      });
  } else {
    setFetchingImage(false);
  }

  const renderImageCard = (uri: string | null): JSX.Element => {
    if (uri == null) {
      return <CardImage source={Images.AnimalPicturePlaceholder} />;
    }
    return <CardImage source={{ uri }} />;
  };

  if (fetchingImage) {
    return (
      <TouchableWithoutFeedback>
        <CardBox>
          <CardHeader backgroundColor={headerBackground}>
            <CardTitle>
              {title}
            </CardTitle>
          </CardHeader>
          <CardImageLoading>
            <ActivityIndicator color={Theme.elements.headerSecondaryDark} animating />
          </CardImageLoading>
          <CardBody>{body}</CardBody>
        </CardBox>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => (onPress ? onPress() : () => null)}>
      <CardBox>
        <CardHeader backgroundColor={headerBackground}>
          <CardTitle>
            {title}
          </CardTitle>
          <CardOptions>
            {headerOptions}
          </CardOptions>
        </CardHeader>
        {renderImageCard(petImage)}
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
