/* eslint-disable camelcase */
// Package imports.
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// Component imports.

// Service imports.
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import userAPI from '../../services/user/api';
import animalAPI from '../../services/animal/api';
import { INotificationDoc, INotificationAdoptionInterestData } from '../../services/notifications/api';

// Style imports.

// Type declaration.
interface IAdoptionInterestNotificationProps {
  notification: INotificationDoc,
}

// Component.
export default function AdoptionInterestNotification({ notification }: IAdoptionInterestNotificationProps) : JSX.Element {
  // Variables.
  // const navigation = useNavigation();
  const [requester, setRequester] = useState<FirebaseFirestoreTypes.DocumentData>();
  const [animal, setAnimal] = useState<FirebaseFirestoreTypes.DocumentData>();

  // Styled components.

  // Function declaration.
  const fetchData = (): void => {
    const data = notification.data as unknown as INotificationAdoptionInterestData;
    if (!data) return;

    userAPI.getUser(notification.from).then((result) => setRequester(result.data()));
    animalAPI.getAnimal(data.animalId).then((result) => setAnimal(result.data()));
  };

  // Page effects.

  useEffect(() => {
    fetchData();
  }, []);

  // JSX returned.
  return (
    <View>
      <Text>{requester?.full_name} está interessado no seu pet {animal?.name}</Text>
    </View>
  );
}
