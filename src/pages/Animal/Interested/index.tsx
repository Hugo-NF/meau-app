import React, { useCallback, useEffect, useState } from 'react';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import {
  ActivityIndicator, Text, Image, TouchableOpacity, Alert,
} from 'react-native';
import { fromUnixTime, differenceInYears } from 'date-fns';
import InfiniteScroll from '../../../components/InfiniteScroll';
import { Theme } from '../../../constants';
import HeaderLayout from '../../../layouts/HeaderLayout';
import {
  Container, LoadingContainer, LoadingText,
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
      <Text style={{ fontSize: 14, color: Theme.elements.textDark }}>{user.userName}</Text>
      {age && (<Text>{age} anos</Text>) }
    </TouchableOpacity>
  );
};

const Interested = (): JSX.Element => {
  const navigation = useNavigation();
  const [interested, setInterested] = useState<InterestedUser[]>([]);
  const animalUID = useRoute<RouteProp<RouteTypes.RouteParams, 'Interested'>>().params?.animalUID;
  const [animal, setAnimal] = useState<DocumentRefData>();
  const [loading, setLoading] = useState(true);

  const fetchAnimal = useCallback(
    async (): Promise<DocumentRefData> => (await animalAPI.getAnimal(animalUID)).ref,
    [animalUID],
  );

  const fetchInterested = async (lastElement : InterestedUser | null, pageNumber : number, pageSize : number): Promise<InterestedUser[]> => {
    if (!animal) {
      return [];
    }

    const fetchedInterested = await adoptionAPI.getInterestedIn(animal, {
      lastElementMarker: [lastElement?.ref], pageNumber, pageSize, marker: 'user',
    });

    const usersWithImage = await Promise.all<InterestedUser>(fetchedInterested.map(async (user: DocumentData): Promise<InterestedUser> => {
      const image = await userAPI.getPictureDownloadURL(user.data().profile_picture);
      return {
        id: user.id, ref: user.ref, imageURI: image, userName: user.data().full_name, birthDate: user.data().birth_date?.seconds,
      };
    }));

    return usersWithImage;
  };

  const userKeyExtractor = (user : InterestedUser) : string => user.id;

  const removeFromList = (id: string): void => {
    setInterested(interested.filter((user) => user.id !== id));
  };

  useEffect(() => {
    fetchAnimal()
      .then((animalRef) => {
        setAnimal(animalRef);
        adoptionAPI.setAllInterestedSeen(animalRef);
        setLoading(false);
      });
  }, [fetchAnimal]);

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
    }, []),
  );

  return (
    loading
      ? (
        <LoadingContainer>
          <LoadingText>Carregando...</LoadingText>
          <ActivityIndicator
            size="large"
            color={Theme.default.primary}
          />
        </LoadingContainer>
      )
      : (
        <HeaderLayout
          disableScrollView
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
              keyExtractorFunction={userKeyExtractor}
              contentBatchSize={10}
              dataFetchQuery={fetchInterested}
              formatContent={(user) => (
                <UserCircle
                  user={user}
                  callback={(interestedUser: InterestedUser): void => {
                    Alert.alert(interestedUser.userName, 'Selecione a ação', [
                      {
                        text: 'Chat',
                        onPress: () => navigation.navigate('Chat', {
                          title: user.userName,
                          targetUserUID: interestedUser.id,
                        }),
                      },
                      {
                        text: 'Remover',
                        onPress: () => {
                          if (animal) {
                            adoptionAPI.removeInterestToAnimal(animal, interestedUser.ref, true);
                            removeFromList(interestedUser.id);
                          }
                        },
                      },
                      {
                        text: 'Realizar transferência',
                        onPress: () => {
                          if (animal) {
                            adoptionAPI.transferAnimalTo(animal, interestedUser.ref);
                            navigation.reset({
                              index: 1,
                              routes: [
                                { name: 'Home' },
                                { name: 'MyPets' },
                              ],
                            });
                            Alert.alert('Transferência realizada com sucesso!');
                          }
                        },
                      },
                    ], { cancelable: true });
                  }}
                />
              )}
            />
          </Container>
        </HeaderLayout>
      )
  );
};

export default Interested;
