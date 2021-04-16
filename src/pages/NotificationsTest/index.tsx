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
import userAPI from '../../services/user/api';
import notificationAPI from '../../services/notifications/api';

// Style imports.

// Type declaration.

// Component.
export default function NotificationsTest() : JSX.Element {
  // Variables.
  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fetchedUsers, setFetchedUsers] = useState<any[]>([]);

  // Styled components.

  // Function declaration.
  const fetchUsers = (): void => {
    userAPI.userCollection().get()
      .then((result) => {
        setFetchedUsers(result.docs.map((doc) => ({ id: doc.id, ...(doc.data()) })));
      });
  };

  useEffect(() => fetchUsers(), []);

  // Page effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor('transparent', true);
  }, [navigation]);

  // JSX returned.
  return (
    <HeaderLayout
      headerShown
      title="Teste de notificações"
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
          fetchedUsers.map((user) => (
            <View
              key={uuidv4()}
              style={{
                width: 300, height: 50, flexDirection: 'row', alignItems: 'center',
              }}
            >
              <Text style={{ flex: 1 }}>{user.full_name}</Text>
              <TouchableOpacity onPress={() => notificationAPI.sendToUser(user.id, 'Teste de notificação')}>
                <MaterialIcons
                  name="notifications"
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
