import React, { useContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface IContext {
    currentUser: FirebaseAuthTypes.User | null
}

const Context = React.createContext<IContext>({
  currentUser: null,
});

export function useAuth(): IContext {
  const context = useContext(Context);

  return context;
}

export default Context;
