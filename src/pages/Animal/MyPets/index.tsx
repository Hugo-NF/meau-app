import React, { useCallback } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import HeaderLayout from '../../../layouts/HeaderLayout';

import AnimalCard from '../../../components/AnimalCard';
import InfiniteScroll from '../../../components/InfiniteScroll';

import { formatInterested } from '../../../utils/formatTexts';

import { Animal } from '../../../types/animal';

import { styledComponents, styles } from './styles';

// Service imports.
import animalAPI from '../../../services/animal/api';
import userAPI from '../../../services/user/api';
import adoptionAPI from '../../../services/adoption/api';

const MyPets = (): JSX.Element => {
  const user = userAPI.currentUserDocument();
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
            <CardText>{formatInterested(pet?.newPeopleInterestedIn)}</CardText>
          </CardTextRow>
        </CardTextContainer>
      )}
      title={pet?.name}
      headerOptions={pet?.newPeopleInterestedIn > 0 && (
        <MaterialIcons
          name="error"
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
    let query : FirebaseFirestoreTypes.Query;
    const orderBy = 'name';

    if (pageNumber === 1 || lastElement == null) {
      query = animalAPI.createQueryByUserUid(user, '==', {
        limit: pageSize,
        orderBy,
      });
    } else {
      query = animalAPI.createQueryByUserUid(user, '==', {
        limit: pageSize,
        orderBy,
        startAfter: lastElement.name,
      });
    }

    return new Promise((resolve, reject) => {
      query.get()
        .then((response) => {
          const promisesArray : Array<Promise<Animal>> = [];

          response.forEach((childSnapshot) => promisesArray.push(new Promise((resolveItem, rejectItem) => {
            const item = childSnapshot.data();
            item.id = childSnapshot.id;
            adoptionAPI.countNewInterestedIn(childSnapshot.ref)
              .then((newPeopleInterestedIn) => {
                item.newPeopleInterestedIn = newPeopleInterestedIn;
                resolveItem(item as Animal);
              })
              .catch((error) => rejectItem(error));
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
      title="Meus Pets"
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
          contentContainerStyles={styles.myPetsFeedContainerStyles}
          dataFetchQuery={fetchPets}
          formatContent={formatAnimal}
        />
      </Container>
    </HeaderLayout>
  );
};

export default MyPets;
