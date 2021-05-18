import { DocumentData, DocumentRefData } from '../Firebase';

export enum NotificationType {
  standard = 'STD',
  adoptionInterest = 'AIN',
  adoptionRefused = 'ARE',
}

export interface INotificationAdoptionInterestData {
  animal: DocumentRefData,
}

export interface NotificationModel {
  id: string,
  from: DocumentData,
  to: DocumentRefData,
  message: string,
  seen: false,
}

export interface NotificationStandardModel extends NotificationModel {
  type: NotificationType.standard,
}

export interface NotificationAdoptionModel extends NotificationModel {
  type: NotificationType.adoptionInterest,
  animal: DocumentData,
}

export interface NotificationAdoptionRefusedModel extends NotificationModel {
  type: NotificationType.adoptionRefused,
  animal: DocumentData,
}

export type NotificationModels = NotificationStandardModel | NotificationAdoptionModel | NotificationAdoptionRefusedModel;
