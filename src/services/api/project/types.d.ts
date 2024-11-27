import { Key } from 'react';

import { IClient } from '../client/types';
import { ICompany } from '../company/types';

interface IProject {
  id: number;
  name: string;
  description: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  client: IClient;
  company: ICompany;
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
  amount: number;
  startDate: string;
  endDate: string;
  clientId: number;
  companyId: number;
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
