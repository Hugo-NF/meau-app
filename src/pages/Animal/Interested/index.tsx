import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import {
  Text, FlatList, Image, TouchableOpacity, Alert,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { fromUnixTime, differenceInYears } from 'date-fns';
import InfiniteScroll from '../../../components/InfiniteScroll';
import { Theme } from '../../../constants';
import HeaderLayout from '../../../layouts/HeaderLayout';
import {
  Container,
} from './styles';
import { DocumentData, DocumentRefData } from '../../../types/firebase';
import * as RouteTypes from '../../../types/routes';

// Service imports.
import userAPI from '../../../services/user/api';
import animalAPI from '../../../services/animal/api';
import adoptionAPI from '../../../services/adoption/api';

interface InterestedUser {
  id: string;
  ref: DocumentRefData;
  imageURI: string;
  userName: string;
  birthDate: number;
}

interface UserCircleProps {
  user: InterestedUser;
  callback: (user: InterestedUser) => void;
}

const getAge = (birthDateTimestamp: number): number => differenceInYears(new Date(), fromUnixTime(birthDateTimestamp));

const UserCircle = ({
  user, callback,
} : UserCircleProps): JSX.Element => {
  const age = user.birthDate ? getAge(user.birthDate) : null;
  return (
    <TouchableOpacity
      onPress={() => callback(user)}
      style={{
        alignItems: 'center', marginRight: 36, marginLeft: 36, marginBottom: 24,
      }}
    >
      <Image
        source={{ uri: user.imageURI }}
        style={{
          width: 84, height: 84, borderRadius: 84, marginBottom: 8,
        }}
      />
      <Text style={{ fontSize: 14, color: Theme.elements.cardText }}>{user.userName}</Text>
      {age && (<Text>{age} anos</Text>) }
    </TouchableOpacity>
  );
};

const Interested = (): JSX.Element => {
  const navigation = useNavigation();
  const [interested, setInterested] = useState<InterestedUser[]>([]);
  const animalUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Interested'>>().params?.animalUID;
  const [animal, setAnimal] = useState<DocumentRefData>();

  const fetchAnimal = async (): Promise<DocumentRefData> => (await animalAPI.getAnimal(animalUID)).ref;

  const fetchInterested = async (lastElement : InterestedUser | null, pageNumber : number, pageSize : number): Promise<InterestedUser[]> => {
    if (!animal) {
      return [];
    }

    const fetchedInterested = await adoptionAPI.getInterestedIn(animal, {
      lastElementMarker: lastElement?.ref, pageNumber, pageSize, marker: 'user',
    });

    const userWithImage = await Promise.all<InterestedUser>(fetchedInterested.map(async (user: DocumentData): Promise<InterestedUser> => {
      const image = await userAPI.getPictureDownloadURL(user.data().profile_picture);
      return {
        id: user.id, ref: user.ref, imageURI: image, userName: user.data().full_name, birthDate: user.data().birth_date?.seconds,
      };
    }));

    return userWithImage;
  };

  const removeFromList = (id: string): void => {
    setInterested(interested.filter((user) => user.id !== id));
  };

  useEffect(() => {
    fetchAnimal()
      .then(setAnimal);
  }, []);

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, false);
  }, [navigation]);

  return (
    <HeaderLayout
      headerShown
      title="Interessados"
      headerStyles={{
        backgroundColor: Theme.elements.headerPrimaryDark,
        maxHeight: '56px',
        height: '56px',
      }}
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
          numColumns={2}
          contentBatchSize={10}
          dataFetchQuery={fetchInterested}
          formatContent={(user) => (
            <UserCircle
              user={user}
              callback={(u: InterestedUser): void => {
                Alert.alert(u.userName, 'Selecione a ação', [
                  {
                    text: 'Cancelar',
                    onPress: () => null,
                  },
                  {
                    text: 'Remover',
                    onPress: () => {
                      if (animal) {
                        adoptionAPI.removeInterestToAnimal(animal, u.ref, true);
                        removeFromList(u.id);
                      }
                    },
                  },
                  {
                    text: 'Realizar transferência',
                    onPress: () => {
                      if (animal) {
                        adoptionAPI.transferAnimalTo(animal, u.ref);
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Home' }],
                        });
                        Alert.alert('Transferência realizada com sucesso!');
                      }
                    },
                  },
                ]);
              }}
            />
          )}
        />
      </Container>
    </HeaderLayout>
  );
};

export default Interested;