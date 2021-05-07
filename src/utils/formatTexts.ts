// Package imports.
import {
  differenceInCalendarDays,
  differenceInCalendarYears,
  format,
} from 'date-fns';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Exported functions.
export const formatChatDate = (chatDate: Date) : string => {
  const today = new Date();

  if (differenceInCalendarDays(today, chatDate) === 0) {
    return format(chatDate, 'HH:mm');
  }

  if (differenceInCalendarDays(today, chatDate) <= 6) {
    return format(chatDate, 'iii');
  }

  if (differenceInCalendarYears(today, chatDate) === 0) {
    return format(chatDate, 'dd/MM');
  }

  return format(chatDate, 'yyyy');
};

export const formatInterested = (interestedInCount: number) : string => {
  if (interestedInCount === 0) return 'Sem novos interessados';
  if (interestedInCount === 1) return '1 novo interessado';
  return `${interestedInCount} novos interessados`;
};

export const formatLocation = (ownerData: FirebaseFirestoreTypes.DocumentData | undefined) : string => {
  if (ownerData?.city === '' && ownerData?.state === '') return ('Não informada');
  if (ownerData?.city === '') return (ownerData?.state);
  if (ownerData?.state === '') return (ownerData?.city);
  return (`${ownerData?.city} - ${ownerData?.state}`);
};
