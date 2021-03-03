// Package imports.
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importing our pages.
import Home from './pages/Home';
import Login from './pages/Login';
import CadastroPessoal from './pages/Cadastro Pessoal/Cadastro';

// Routes.
export default function Routes() : JSX.Element {
  const AppStack = createStackNavigator();

  return (
    <AppStack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }} // By default, hides the header in all screens
    >
      <AppStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerTitle: 'Início',
        }}
      />
      <AppStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: true,
        }}
      />
      <AppStack.Screen
        name="Cadastro Pessoal/Cadastro"
        component={CadastroPessoal}
        options={{
          headerShown: true,
          headerTitle: 'Cadastro Pessoal',
          headerStyle: {
            backgroundColor: '#cfe9e5',
          },
        }}
      />
    </AppStack.Navigator>
  );
}
