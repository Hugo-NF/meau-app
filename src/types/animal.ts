// Enum declarations.
export enum Age {
  Newborn,
  Adult,
  Elder,
}

export enum Sex {
  Male,
  Female,
}

export enum Size {
  Small,
  Medium,
  Big,
}

export enum Species {
  Cat,
  Dog,
}

// Type declarations.
export type AdoptionRequirements = {
  housePhotos: boolean,
  postAdoptionMonitoring: boolean,
  postAdoptionMonitoringPeriod: number | null,
  previousAnimalVisit: boolean,
  signedTerm: boolean,
};

export type HealthCondition = {
  castrated: boolean,
  dewormed: boolean,
  sick: boolean,
  vaccinated: boolean,
};

export type Temperament = {
  calm: boolean,
  lazy: boolean,
  loving: boolean,
  playful: boolean,
  shy: boolean,
  vigilant: boolean,
};
