import { DocumentRefData } from './firebase';

// Type declarations.
export type RouteParams = {
  AnimalDetails: {
    animalUID: string
  },
  Interested: {
    animalUID: string
  },
  Chat: {
    title: string,
    targetUser: DocumentRefData,
    animal: DocumentRefData,
  }
};
