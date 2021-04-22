import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const formatLocation = (ownerData: FirebaseFirestoreTypes.DocumentData | undefined) : string => {
  if (ownerData?.city === '' && ownerData?.state === '') return ('Não informada');
  if (ownerData?.city === '') return (ownerData?.state);
  if (ownerData?.state === '') return (ownerData?.city);
  return (`${ownerData?.city} - ${ownerData?.state}`);
};

export const formatInterested = (interestsCount: number) : string => {
  if (interestsCount === 0) return 'Sem novos interessados';
  if (interestsCount === 1) return `${interestsCount} novo interessado`;
  return `${interestsCount} novos interessados`;
};
