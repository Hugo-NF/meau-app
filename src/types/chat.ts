// Type imports.
import { ImageSourcePropType } from 'react-native';

// Type declarations.
export type ChatListEntry = {
  id : string,
  image : ImageSourcePropType | null,
  messagePreview: string,
  otherUserDisplayName: string,
  timestamp: string,
  title : string,
  unseenUpdates: boolean,
};
