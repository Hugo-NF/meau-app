// Package imports.
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importing our pages.
import AnimalRegistration from './pages/AnimalRegistration';
import Home from './pages/Home';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

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
        // Overrides the header just for this screen
      />
      <AppStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: true,
        }}
      />
      <AppStack.Screen
        name="AnimalRegistration"
        component={AnimalRegistration}
        options={{
          headerShown: true,
        }}
      />
      <AppStack.Screen
        name="Unauthorized"
        component={Unauthorized}
      />

    </AppStack.Navigator>
  );
}
