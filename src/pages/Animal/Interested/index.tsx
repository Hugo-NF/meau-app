import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import {
  View, Text, FlatList, Image, TouchableOpacity, Alert,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { AnimalCard } from '../../../components/AnimalCard';
import { Theme } from '../../../constants';
import HeaderLayout from '../../../layouts/HeaderLayout';
import {
  CardText, CardTextContainer, CardTextRow, Container,
} from './styles';
import { DocumentData, DocumentRefData } from '../../../types/firebase';
import * as RouteTypes from '../../../types/routes';

// Service imports.
import userAPI from '../../../services/user/api';
import animalAPI from '../../../services/animal/api';
import adoptionAPI from '../../../services/adoption/api';

interface InterestedUser {
  id: string;
  imageURI: string;
  userName: string;
  birthDate: string;
}

interface UserCircleProps {
  user: InterestedUser;
  callback: (user: InterestedUser) => void;
}

const getAge = (birthDateTimestamp: number): number => {
  const birthDate = new Date(birthDateTimestamp * 1000);
  const now = new Date();
  return Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 365));
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

  const fetchInterested = async (): Promise<void> => {
    const animal = (await animalAPI.getAnimal(animalUID)).ref;
    const fetchedInterested = await adoptionAPI.getInterestedIn(animal);

    const userWithImage = await Promise.all<InterestedUser>(fetchedInterested.map(async (user: DocumentData): Promise<InterestedUser> => {
      const image = await userAPI.getPictureDownloadURL(user.data().profile_picture);
      return {
        id: user.id, imageURI: image, userName: user.data().full_name, birthDate: user.data().birth_date?.seconds,
      };
    }));

    setInterested(userWithImage);
  };

  useEffect(() => {
    fetchInterested();
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
        <FlatList
          numColumns={2}
          data={interested}
          renderItem={(e) => (
            <UserCircle
              user={e.item}
              callback={(user: InterestedUser): void => {
                Alert.alert(user.userName, 'Selecione a ação', [
                  {
                    text: 'Realizar transferência',
                    onPress: () => console.log('transferência'),
                  },
                  {
                    text: 'Remover',
                    onPress: () => console.log('remover'),
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
