// Package imports.
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importing our pages.
import AnimalRegistration from './pages/AnimalRegistration';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Unauthorized from './pages/Unauthorized';
import Authorized from './pages/Authorized';

// Routes.
export default function Routes() : JSX.Element {
  const AppStack = createStackNavigator();

  return (
    <AppStack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }} // By default, hides the header in all screens
    >
      <AppStack.Screen
        name="AnimalRegistration"
        component={AnimalRegistration}
      />
      <AppStack.Screen
        name="Home"
        component={Home}
      />
      <AppStack.Screen
        name="Login"
        component={Login}
      />
      <AppStack.Screen
        name="Registration"
        component={Registration}
      />
      <AppStack.Screen
        name="Unauthorized"
        component={Unauthorized}
      />
      <AppStack.Screen
        name="Authorized"
        component={Authorized}
      />
    </AppStack.Navigator>
  );
}
