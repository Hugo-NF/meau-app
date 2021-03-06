// Package imports.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Navigation configuration.
const Stack = createStackNavigator();

// Interfaces.
interface StackScreen {
  component: React.FC,
  params?: Record<string, unknown>
}

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
