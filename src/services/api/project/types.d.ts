import { Key } from 'react';

import { IClient } from '../client/types';
import { ICompany } from '../company/types';

interface IProject {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  billingType: string;
  hourlyMonthlyRate: number;
  projectHours: number;
  currency: string;
  amount: number;
  client: IClient;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
}

export interface IAddProjectReq {
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  billingType: string;
  hourlyMonthlyRate: number;
  projectHours: number;
  currency: string;
  amount: number;
  clientId: number;
}

export interface IProjectRes {
  result: IProject[];
  recordsTotal: number;
}

export interface IAddProjectRes {}

export interface IEditProjectReq extends IAddProjectReq {
  id: number;
}

export interface IProjectStatusReq {
  projectId: number;
  status: string;
}
