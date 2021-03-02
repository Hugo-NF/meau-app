import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

// Importing our pages
import Home from './pages/Home';
import Login from './pages/Login';
import Ops from './pages/Cadastro Pessoal/Ops';

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
      <AppStack.Screen name="Login" component={Login} />
      <AppStack.Screen
        name="CadastroPessoal/Ops"
        component={Ops}
        options={{
          headerShown: true,
          headerTitle: 'Cadastro pessoal',
        }}
      />
    </AppStack.Navigator>
  );
}
