import { DocumentRefData } from '../../services/Firebase';

export interface InterestedUser {
  id: string;
  ref: DocumentRefData;
  imageURI: string;
  userName: string;
  birthDate: number;
}

export interface UserCircleProps {
  user: InterestedUser;
  callback: (user: InterestedUser) => void;
}

// Interface declarations.
export interface IUploadedPicture {
  id: string,
  remoteName: string,
  localUri: string,
}
