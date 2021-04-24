import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

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

// Companion objects for enums.
export const AgeNames = {
  [Age.Newborn]: 'Filhote',
  [Age.Adult]: 'Adulto',
  [Age.Elder]: 'Idoso',
};

export const SexNames = {
  [Sex.Male]: 'Macho',
  [Sex.Female]: 'Fêmea',
};

export const SizeNames = {
  [Size.Small]: 'Pequeno',
  [Size.Medium]: 'Médio',
  [Size.Big]: 'Grande',
};

export const SpeciesNames = {
  [Species.Cat]: 'Gato',
  [Species.Dog]: 'Cachorro',
};

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

// Companion objects for types.
export const AdoptionRequirementsNames = {
  housePhotos: 'fotos da casa',
  postAdoptionMonitoring: 'acompanhamento pós adoção',
  postAdoptionMonitoringPeriod: 'período de acompanhamento pós adoção',
  previousAnimalVisit: 'visita prévia',
  signedTerm: 'termo de adoção',
};

export const HealthConditionNames = {
  castrated: 'castrado',
  dewormed: 'vermifugado',
  sick: 'doente',
  vaccinated: 'vacinado',
};

export const TemperamentNames = {
  calm: 'calmo',
  lazy: 'preguiçoso',
  loving: 'amoroso',
  playful: 'brincalhão',
  shy: 'tímido',
  vigilant: 'guarda',
};

export interface IRegisterAnimal {
  name: string,
  species: Species | null,
  sex: Sex | null,
  size: Size | null,
  age: Age | null,
  temperament: Temperament,
  healthCondition: HealthCondition,
  adoptionRequirements: AdoptionRequirements,
  diseases: string,
  about: string
}

export interface Animal extends IRegisterAnimal {
  id: string,
  owner: FirebaseFirestoreTypes.DocumentReference,
  pictures: Array<string>,
  ownerDocument: FirebaseFirestoreTypes.DocumentData,
  newPeopleInterestedIn: number,
}
