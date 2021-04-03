// Package imports.
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MyPets } from './pages/Animal/MyPets';
import InfiniteScrollTest from './pages/InfiniteScrollTest';

// Importing our pages.
import AnimalRegistration from './pages/Animal/Registration';
import AnimalRegistrationSuccess from './pages/Animal/Success';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Unauthorized from './pages/Unauthorized';
import Authorized from './pages/Authorized';
import Context from './services/context';

interface IRouteRule {
  name: string,
  component: () => JSX.Element,
  privateComponent?: () => JSX.Element,
  requireSession?: boolean,
}

interface IRoute {
  name: string,
  component: () => JSX.Element,
}

// Routes.
export default class Routes extends React.Component {
  AppStack = createStackNavigator();

  routes: IRouteRule[] = [
    {
      name: 'AnimalRegistration',
      component: AnimalRegistration,
      requireSession: true,
    },
    {
      name: 'AnimalRegistrationSuccess',
      component: AnimalRegistrationSuccess,
      requireSession: true,
    },
    {
      name: 'Home',
      component: Home,
    },
    {
      name: 'Login',
      component: Login,
      privateComponent: Authorized,
    },
    {
      name: 'Registration',
      component: Registration,
      privateComponent: Authorized,
    },
    {
      name: 'Unauthorized',
      component: Unauthorized,
      privateComponent: Authorized,
    },
    {
      name: 'Authorized',
      component: Authorized,
      requireSession: true,
    },
    {
      name: 'MyPets',
      component: MyPets,
      requireSession: true,
    },
    {
      name: 'InfiniteScrollTest',
      component: InfiniteScrollTest,
      requireSession: true,
    },
  ];

  routesProvider: () => IRoute[] = () => {
    const { currentUser } = this.context;

    return this.routes
      .map((route) => {
        let component: () => JSX.Element;
        if (route.requireSession && currentUser == null) {
          component = Unauthorized;
        } else if (route.privateComponent && currentUser != null) {
          component = route.privateComponent;
        } else {
          component = route.component;
        }

        return {
          name: route.name,
          component,
        };
      });
  }

  render(): JSX.Element {
    return (
      <this.AppStack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }} // By default, hides the header in all screens
      >
        {
          this.routesProvider().map((route) => ((
            <this.AppStack.Screen
              key={route.name}
              name={route.name}
              component={route.component}
            />
          )))
        }
      </this.AppStack.Navigator>
    );
  }
}

Routes.contextType = Context;
