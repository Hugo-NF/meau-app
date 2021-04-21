import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import {
  Text, FlatList, Image, TouchableOpacity, Alert,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import moment from 'moment';
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

const getAge = (birthDateTimestamp: number): number => {
  const birthDate = moment.unix(birthDateTimestamp);
  const now = moment();
  return Math.floor(moment.duration(now.diff(birthDate)).asYears());
};

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

  const fetchInterested = async (): Promise<InterestedUser[]> => {
    if (!animal) {
      return [];
    }

    const fetchedInterested = await adoptionAPI.getInterestedIn(animal);

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

  useEffect(() => {
    fetchInterested().then(setInterested);
  }, [animal]);

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
        <FlatList
          numColumns={2}
          data={interested}
          renderItem={(e) => (
            <UserCircle
              user={e.item}
              callback={(user: InterestedUser): void => {
                Alert.alert(user.userName, 'Selecione a ação', [
                  {
                    text: 'Cancelar',
                    onPress: () => null,
                  },
                  {
                    text: 'Remover',
                    onPress: () => {
                      if (animal) {
                        adoptionAPI.removeInterestToAnimal(animal, user.ref, true);
                        removeFromList(user.id);
                      }
                    },
                  },
                  {
                    text: 'Realizar transferência',
                    onPress: () => {
                      if (animal) {
                        adoptionAPI.transferAnimalTo(animal, user.ref);
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
          keyExtractor={(item) => item.id}
        />
      </Container>
    </HeaderLayout>
  );
};

export default Interested;
