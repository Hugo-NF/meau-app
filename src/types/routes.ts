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

export interface IRouteRule {
  name: string,
  component: () => JSX.Element,
  privateComponent?: () => JSX.Element,
  requireSession?: boolean,
}

export interface IRoute {
  name: string,
  component: () => JSX.Element,
}
