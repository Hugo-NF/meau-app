// Package imports.
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InfiniteScrollTest from './pages/InfiniteScrollTest';

// Importing our pages.
import AnimalDetails from './pages/Animal/Details';
import AnimalFeed from './pages/Animal/Feed';
import AnimalRegistration from './pages/Animal/Registration';
import AnimalRegistrationSuccess from './pages/Animal/Success';
import MyPets from './pages/Animal/MyPets';

import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Unauthorized from './pages/Unauthorized';
import Context from './contexts/user/context';
import NotificationsList from './pages/NotificationsList';
import Interested from './pages/Animal/Interested';

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
      name: 'AnimalDetails',
      component: AnimalDetails,
    },
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
      privateComponent: AnimalFeed,
    },
    {
      name: 'Registration',
      component: Registration,
      privateComponent: AnimalFeed,
    },
    {
      name: 'Unauthorized',
      component: Unauthorized,
      privateComponent: AnimalFeed,
    },
    {
      name: 'AnimalFeed',
      component: AnimalFeed,
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
    {
      name: 'NotificationsList',
      component: NotificationsList,
      requireSession: true,
    },
    {
      name: 'Interested',
      component: Interested,
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
