// Package imports.
import React, { useCallback, useEffect, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ActivityIndicator, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Layout imports.
import HeaderLayout from '../../layouts/HeaderLayout';

// Service imports.
import notificationAPI from '../../services/notifications/api';

// Type declaration.
import { NotificationType, NotificationModels } from '../../types/services/Notifications';

// Style imports.
import { styledComponents, styles } from './styles';

// Component.
export default function NotificationsList() : JSX.Element {
  // Variables.
  const navigation = useNavigation();
  const [fetchedNotifications, setFetchedNotifications] = useState<NotificationModels[]>([]);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  // Styled components.
  const {
    Container,
    LoadingContainer,
    NoDataReturnedText,
    NotificationContainer,
    NotificationTextView,
  } = styledComponents;

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
      setStatusBarBackgroundColor(styles.statusBarColor, true);
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
            <Text>{fromName} está interessado no seu pet {animalName}.</Text>
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
      headerStyles={styles.headerLayout}
      leftAction={{
        hidden: false,
        actionType: 'drawer',
      }}
      rightAction={{
        hidden: true,
      }}
    >
      <Container>
        { !fetchedOnce && (
          <LoadingContainer>
            <ActivityIndicator
              size="large"
              color={styles.activityIndicatorColor}
            />
          </LoadingContainer>
        )}
        { fetchedOnce && fetchedNotifications.length === 0 && (
          <NoDataReturnedText>Nenhuma notificação.</NoDataReturnedText>
        )}
        { fetchedOnce
          && fetchedNotifications.map((notification, index) => (
            <NotificationContainer
              key={notification.id}
            >
              <NotificationTextView>
                {notificationRenderer(notification)}
              </NotificationTextView>
              <TouchableOpacity onPress={() => { notificationAPI.setSeenById(notification.id); removeNotification(index); }}>
                <MaterialIcons
                  name="cancel"
                  size={24}
                />
              </TouchableOpacity>
            </NotificationContainer>
          ))}
      </Container>
    </HeaderLayout>
  );
}
