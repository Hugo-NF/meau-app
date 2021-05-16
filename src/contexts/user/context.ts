import React, { useContext } from 'react';
import { IContext } from '../../types/contexts/user';

const Context = React.createContext<IContext>({
  currentUser: null,
});

export function useAuth(): IContext {
  const context = useContext(Context);

  return context;
}

export default Context;
