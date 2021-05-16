import React, { useCallback } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import HeaderLayout from '../../../layouts/HeaderLayout';

import AnimalCard from '../../../components/AnimalCard';
import InfiniteScroll from '../../../components/InfiniteScroll';

import {
  Age,
  AgeNames,
  Animal,
  Sex,
  SexNames,
  Size,
  SizeNames,
} from '../../../types/animal';

import { formatLocation } from '../../../utils/formatTexts';

import { styledComponents, styles } from './styles';

// Service imports.
import userAPI from '../../../services/user/api';
import animalAPI from '../../../services/animal/api';
import { filterPaginated } from '../../../services/paginated/api';

const FeedPets = (): JSX.Element => {
  const navigation = useNavigation();

  const {
    CardText,
    CardTextContainer,
    CardTextRow,
    Container,
  } = styledComponents;

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(styles.statusBarColor, true);
    }, []),
  );

  const animalKey = (animalItem: Animal): string => animalItem.id;

  const formatAnimal = (pet: Animal): JSX.Element => (
    <AnimalCard
      key={pet?.id}
      imageUrl={pet?.pictures.length > 0 ? pet?.pictures[0] : null}
      body={(
        <CardTextContainer>
          <CardTextRow>
            <CardText>{SexNames[pet?.sex as Sex]}</CardText>
            <CardText>{SizeNames[pet?.size as Size]}</CardText>
            <CardText>{AgeNames[pet?.age as Age]}</CardText>
          </CardTextRow>
          <CardTextRow>
            <CardText>
              {formatLocation(pet?.ownerDocument)}
            </CardText>
          </CardTextRow>
        </CardTextContainer>
      )}
      title={pet?.name}
      headerOptions={(
        <MaterialCommunityIcons
          name="heart-outline"
          size={24}
          color={styles.cardIconColor}
        />
      )}
      headerBackground={styles.cardHeaderBackground}
      onPress={() => navigation.navigate('AnimalDetails', { animalUID: pet?.id })}
    />
  );

  // Fetch pets function declaration
  const fetchPets = (
    lastElement: Animal | null, pageNumber: number, pageSize: number,
  ): Promise<Array<Animal>> => {
    let query = animalAPI.animalCollection().orderBy('owner')
      .where('owner', '!=', userAPI.currentUserDocument());

    query = filterPaginated(query, {
      pageNumber, pageSize, lastElementMarker: [lastElement?.owner, lastElement?.name], marker: 'name',
    });

    return new Promise((resolve, reject) => {
      query.get()
        .then((response) => {
          const promisesArray : Array<Promise<Animal>> = [];

          response.forEach((childSnapshot) => promisesArray.push(new Promise((resolveItem, rejectItem) => {
            const item = childSnapshot.data();
            item.id = childSnapshot.id;
            if (item?.owner !== undefined) {
              userAPI.getReference(item?.owner)
                .then((userDocument) => {
                  item.ownerDocument = userDocument.data();
                  resolveItem(item as Animal);
                })
                .catch((error) => rejectItem(error));
            } else {
              resolveItem(item as Animal);
            }
          })));

          Promise.all(promisesArray).then((animalArray) => resolve(animalArray)).catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  };

  return (
    <HeaderLayout
      disableScrollView
      headerShown
      title="Adotar"
      headerStyles={styles.headerLayout}
      leftAction={{
        hidden: false,
        actionType: 'drawer',
      }}
      rightAction={{
        hidden: false,
        actionType: 'search',
      }}
    >
      <Container>
        <InfiniteScroll
          keyExtractorFunction={animalKey}
          contentBatchSize={10}
          contentContainerStyles={styles.adoptionFeedContainerStyles}
          dataFetchQuery={fetchPets}
          formatContent={formatAnimal}
        />
      </Container>
    </HeaderLayout>
  );
};

export default FeedPets;
