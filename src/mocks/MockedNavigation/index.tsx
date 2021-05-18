// Package imports.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StackScreen } from '../../types/mocks/MockedNavigation';

// Navigation configuration.
const Stack = createStackNavigator();

// Component.
export default function MockedNavigator(
  { component, params = {} } : StackScreen,
) : JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MockedScreen"
          component={component}
          initialParams={params}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Default props.
MockedNavigator.defaultProps = {
  params: {},
};
