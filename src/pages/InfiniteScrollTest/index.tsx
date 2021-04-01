// Package imports.
import React, { useLayoutEffect } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

// Component imports.
import InfiniteScroll from '../../components/InfiniteScroll';
import HeaderLayout from '../../layouts/HeaderLayout';

// Style imports.
import { Theme } from '../../constants';
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
    lastElement : User, pageNumber : number, pageSize : number,
  ) : Promise<Array<User>> {
    let firestoreQuery;

    if (pageNumber === 1) {
      firestoreQuery = firestore()
        .collection('users')
        .orderBy('username')
        .limit(pageSize);
    } else {
      firestoreQuery = firestore()
        .collection('users')
        .orderBy('username')
        .startAfter(lastElement.username)
        .limit((pageNumber - 1) * pageSize);
    }

    return firestoreQuery.get()
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
    <HeaderLayout
      headerShown
      title=""
      headerStyles={{
        backgroundColor: Theme.default.background,
        height: '56px',
        maxHeight: '56px',
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
        <InfiniteScroll
          contentContainerStyles={{
            marginTop: 80,
          }}
          contentBatchSize={5}
          dataFetchQuery={ReturnUsers}
          formatContent={formatUser}
        />
      </Container>
    </HeaderLayout>
  );
}
