import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface IContext {
    currentUser: FirebaseAuthTypes.User | null
}

export default React.createContext<IContext>({
  currentUser: null,
});
