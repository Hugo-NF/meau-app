import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface IContext {
    currentUser: FirebaseAuthTypes.User | null
}

export interface IGlobalServiceState {
  currentUser: FirebaseAuthTypes.User | null
}
