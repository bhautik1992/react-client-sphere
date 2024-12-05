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
  assignFromCompanyId: number;
  assignFromCompany: ICompany;
  clientId: number;
  client: IClient;
  company: ICompany;
  assignToCompanyId: number;
  assignToCompany: ICompany;
  projectManager: string;
  teamLeader: string;
  isInternalProject: boolean;
  billingType: string;
  hourlyMonthlyRate: number;
  projectHours: number;
  projectCost: number;
  currency: string;
  paymentTermDays: number;
  invoicePaymentCycle: string;
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
  assignFromCompanyId: number;
  clientId: number;
  assignToCompanyId: number;
  projectManager: string;
  teamLeader: string;
  isInternalProject: boolean;
  billingType: string;
  hourlyMonthlyRate: number;
  projectHours: number;
  projectCost: number;
  currency: string;
  paymentTermDays: number;
  invoicePaymentCycle: string;
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
