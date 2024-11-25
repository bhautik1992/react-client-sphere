import { Key } from 'react';

export interface ITraining {
  _id: string;
  title: string;
  description: string;
  additionalNotes: string;
  links: string;
  departments: string[];
  startDate: string;
  endDate: string;
  status: boolean;
}

export interface ITrainingReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: string;
  sortBy?: Key;
}

export interface ITrainingRes {
  result: ITraining[];
  recordsTotal: number;
  recordsFiltered: number;
}

export interface ITrainingFormValue {
  title: string;
  description: string;
  links: string;
  additionalNote: string;
  trainingFor: string[];
  trainingSchedule: any[];
}

export interface IAddTrainingReq {
  title: string;
  description: string;
  links: string;
  additionalNotes: string;
  departments: string[];
  startDate: string;
  endDate: string;
}

export interface IAddTrainingRes {}

export interface IEditTrainingReq extends IAddTrainingReq {
  _id: string;
}

export interface IEditTrainingRes {}
