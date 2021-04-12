// Package imports.
import React, { useLayoutEffect } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Component imports.
import InfiniteScroll from '../../components/InfiniteScroll';

// Service imports.
import userAPI from '../../services/user/api';

// Style imports.
import { styledComponents } from './styles';

// Type declaration.
type User = {
  fullName: string,
  birthDate: Date | null,
  email: string,
  state: string,
  city: string,
  address: string,
  phoneNumber: string,
  username: string,
}

// Component.
export default function InfiniteScrollTest() : JSX.Element {
  // Variables.
  const navigation = useNavigation();

  // Styled components.
  const {
    Container,
  } = styledComponents;

  // Function declaration.
  async function ReturnUsers(
    lastElement : User | null, pageNumber : number, pageSize : number,
  ) : Promise<Array<User>> {
    let query;

    if (pageNumber === 1 || lastElement == null) {
      query = userAPI.createQuery({
        limit: pageSize,
        orderBy: 'username',
      });
    } else {
      query = userAPI.createQuery({
        limit: (pageNumber - 1) * pageSize,
        orderBy: 'username',
        startAfter: lastElement.username,
      });
    }

    return query.get()
      .then((response) => {
        const userArray : Array<User> = [];

        response.forEach((childSnapshot) => {
          const item = childSnapshot.data();
          item.id = childSnapshot.id;
          userArray.push(item as User);
        });

        return userArray;
      });
  }

  function formatUser(user : User) : JSX.Element {
    return (
      <View style={{
        margin: 10, padding: 10, borderWidth: 1, borderColor: '#222',
      }}
      >
        <Text>Nome de usuário: {user.username}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Nome completo: {user.fullName}</Text>
        <Text>Endereço: {user.address}</Text>
      </View>
    );
  }

  // Page effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor('transparent', true);
  }, [navigation]);

  // JSX returned.
  return (
    <Container>
      <InfiniteScroll
        contentBatchSize={10}
        dataFetchQuery={ReturnUsers}
        formatContent={formatUser}
      />
    </Container>
  );
}
