import React from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Context from './context';

interface IGlobalServiceState {
    currentUser: FirebaseAuthTypes.User | null
}

export default class GlobalState extends React.Component<Record<string, unknown>, IGlobalServiceState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      currentUser: auth().currentUser,
    };

    auth().onAuthStateChanged((user) => { this.setState({ currentUser: user }); });
  }

  render(): JSX.Element {
    const { children } = this.props;
    const { currentUser } = this.state;

    return (
      <Context.Provider
        value={{ currentUser }}
      >
        {children}
      </Context.Provider>
    );
  }
}
