// Package imports.
import React, { useCallback, useEffect, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Theme } from '../../constants';
import HeaderLayout from '../../layouts/HeaderLayout';
import { Container } from './styles';

// Component imports.

// Service imports.
import notificationAPI from '../../services/notifications/api';
// Style imports.

// Type declaration.
import { NotificationType, NotificationModels } from '../../types/services/Notifications';

// Component.
export default function NotificationsList() : JSX.Element {
  // Variables.
  const navigation = useNavigation();
  const [fetchedNotifications, setFetchedNotifications] = useState<NotificationModels[]>([]);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  // Styled components.

  // Function declaration.
  const fetchNotifications = (): void => {
    notificationAPI.getNotifications().then((result) => {
      setFetchedNotifications(result);
      setFetchedOnce(true);
    });
  };

  // Page effects.
  useEffect(() => fetchNotifications(), []);

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
    }, []),
  );

  const notificationRenderer = (notification: (NotificationModels)): JSX.Element => {
    // eslint-disable-next-line camelcase
    const fromName = notification.from.data()?.full_name || 'Usuário deletado';
    switch (notification.type) {
      case NotificationType.adoptionInterest:
      {
        const animalName = notification.animal.data()?.name || 'Animal deletado';
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AnimalDetails', { animalUID: notification.animal.id });
            }}
          >
            <Text>{fromName} está interessado no seu pet {animalName}</Text>
          </TouchableOpacity>
        );
      }
      case NotificationType.adoptionRefused:
      {
        const animalName = notification.animal.data()?.name || 'Animal deletado';
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AnimalDetails', { animalUID: notification.animal.id });
            }}
          >
            <Text>{fromName} recusou sua solicitação ao pet {animalName}</Text>
          </TouchableOpacity>
        );
      }
      default:
        return (<Text>{notification.message}</Text>);
    }
  };

  const removeNotification = (index: number): void => {
    const fetchedCopy = fetchedNotifications.slice();
    fetchedCopy.splice(index, 1);
    setFetchedNotifications(fetchedCopy);
  };

  // JSX returned.
  return (
    <HeaderLayout
      headerShown
      title="Notificações"
      headerStyles={{
        backgroundColor: Theme.elements.headerPrimary,
        maxHeight: '56px',
        height: '56px',
      }}
      leftAction={{
        hidden: false,
        actionType: 'drawer',
      }}
      rightAction={{
        hidden: true,
      }}
    >
      <Container>
        { fetchedOnce && fetchedNotifications.length === 0 && (<Text style={{ marginTop: 20 }}>Nenhuma notificação</Text>)}
        {
          fetchedNotifications.map((notification, index) => (
            <View
              key={notification.id}
              style={{
                width: 300, height: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', marginTop: 20, padding: 10,
              }}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>{notificationRenderer(notification)}</View>
              <TouchableOpacity onPress={() => { notificationAPI.setSeenById(notification.id); removeNotification(index); }}>
                <MaterialIcons
                  name="cancel"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          ))
        }
      </Container>
    </HeaderLayout>
  );
}
