// Type imports.
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ImageSourcePropType } from 'react-native';

// Type declarations.
export type ChatListEntry = {
  id : string,
  image : ImageSourcePropType | null,
  messagePreview: string,
  otherUserDisplayName: string,
  updatedAt: FirebaseFirestoreTypes.Timestamp,
  title : string,
  unseenUpdates: boolean,
};
