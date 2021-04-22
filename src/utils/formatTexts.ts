import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const formatLocation = (ownerData: FirebaseFirestoreTypes.DocumentData | undefined) : string => {
  if (ownerData?.city === '' && ownerData?.state === '') return ('Não informada');
  if (ownerData?.city === '') return (ownerData?.state);
  if (ownerData?.state === '') return (ownerData?.city);
  return (`${ownerData?.city} - ${ownerData?.state}`);
};

export const formatInterested = (interestedInCount: number) : string => {
  if (interestedInCount === 0) return 'Sem novos interessados';
  if (interestedInCount === 1) return '1 novo interessado';
  return `${interestedInCount} novos interessados`;
};
