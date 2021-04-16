// Package imports.
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Theme } from '../../constants';
import HeaderLayout from '../../layouts/HeaderLayout';
import { Container } from './styles';

// Component imports.

// Service imports.
import notificationAPI, { INotificationDoc, NotificationType } from '../../services/notifications/api';
import AdoptionInterestNotification from '../../components/AdoptionInterestNotification';

// Style imports.

// Type declaration.

// Component.
export default function NotificationsList() : JSX.Element {
  // Variables.
  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fetchedNotifications, setFetchedNotifications] = useState<any[]>([]);

  // Styled components.

  // Function declaration.
  const fetchNotifications = (): void => {
    notificationAPI.getNotifications().then((result) => {
      setFetchedNotifications(result.map((doc) => ({ id: doc.id, ...(doc.data()) })));
    });
  };

  useEffect(() => fetchNotifications(), []);

  // Page effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor('transparent', true);
  }, [navigation]);

  const notificationRenderer = (notification: INotificationDoc): JSX.Element => {
    switch (notification.type) {
      case NotificationType.adoptionInterest:
      {
        return (
          <AdoptionInterestNotification notification={notification} />
        );
      }
      default:
        return (<Text>{notification.message}</Text>);
    }
  };

  const removeNotification = (index): void => {
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
        {
          fetchedNotifications.map((notification, index) => (
            <View
              key={uuidv4()}
              style={{
                width: 300, height: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', marginTop: 20, padding: 10,
              }}
            >
              <View style={{ flex: 1 }}>{notificationRenderer(notification)}</View>
              <TouchableOpacity onPress={() => { notificationAPI.setSeen(notification.id); removeNotification(index); }}>
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
