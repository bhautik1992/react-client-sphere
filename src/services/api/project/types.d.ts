import { Key } from 'react';

import { IClient } from '../client/types';
import { ICompany } from '../company/types';
import { ICr } from '../cr/types';
import { IEmployee } from '../employee/types';
import { IAddMileStoneReq, IMileStone } from '../mileStone/types';

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
  projectManagerId: number;
  projectManager: IEmployee;
  teamLeaderId: number;
  teamLeader: IEmployee;
  isInternalProject: boolean;
  billingType: string;
  hourlyMonthlyRate: number;
  projectHours: number;
  projectCost: number;
  currency: string;
  paymentTermDays: number;
  invoicePaymentCycle: string;
  invoiceDay: string;
  developers: IEmployee[];
  technologies: string[];
  milestones: IMileStone[];
  crs: ICr[];
  invoicedAmount: number;
  isInvoiced: boolean;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
  isInternalProject?: boolean;
  deletedProject?: boolean;
  projectManagerId?: number;
  clientId?: number;
  status?: string;
  name?: string;
  startDate?: string;
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
  projectManagerId: number;
  teamLeaderId: number;
  developerId: number[];
  technologies: string[];
  isInternalProject: boolean;
  billingType: string;
  hourlyMonthlyRate: number;
  projectHours: number;
  projectCost: number;
  currency: string;
  paymentTermDays: number;
  invoicePaymentCycle: string;
  invoiceDay: string;
  milestones: IAddMileStoneReq[];
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
