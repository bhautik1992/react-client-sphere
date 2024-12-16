import { Key } from 'react';

import { IClient } from '../client/types';
import { ICompany } from '../company/types';
import { IEmployee } from '../employee/types';
import { IProject } from '../project/types';

interface ICr {
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
  projectId: number;
  project: IProject;
  isInternalCr: boolean;
  billingType: string;
  hourlyMonthlyRate: number;
  crHours: number;
  crCost: number;
  currency: string;
  paymentTermDays: number;
  invoicePaymentCycle: string;
  invoiceDay: string;
  invoiceDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICrReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
  isInternalCr?: boolean;
}

export interface IAddCrReq {
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  assignFromCompanyId: number;
  clientId: number;
  projectId: number;
  isInternalCr: boolean;
  billingType: string;
  hourlyMonthlyRate: number;
  crHours: number;
  crCost: number;
  currency: string;
  paymentTermDays: number;
  invoicePaymentCycle: string;
  invoiceDay: string;
  invoiceDate: string;
}

export interface ICrRes {
  result: ICr[];
  recordsTotal: number;
}

export interface IAddCrRes {}

export interface IEditCrReq extends IAddCrReq {
  id: number;
}

export interface ICrStatusReq {
  crId: number;
  status: string;
}
