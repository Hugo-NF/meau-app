// Package type imports.
import { ImageSourcePropType } from 'react-native';

// User type imports.
import * as FirebaseTypes from './firebase';

// Type declarations.
export type ChatListEntry = {
  id : string,
  image : ImageSourcePropType | null,
  messagePreview: string,
  otherUserDisplayName: string,
  title : string,
  unseenUpdates: boolean,
  updatedAt: FirebaseTypes.Timestamp,
};
