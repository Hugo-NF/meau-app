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
    targetUserUID: string,
    chatUID: string,
  }
};
