import { Key } from 'react';

import { ICountry } from '../country/types';
import { IProject } from '../project/types';

export interface ICompany {
  id: number;
  name: string;
  email: string;
  address: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityName: string;
  assignedToProjects: IProject[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface ICompanyReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: string;
  sortBy?: Key;
  deletedCompany?: boolean;
}

export interface ICompanyRes {
  result: ICompany[];
  recordsTotal: number;
}

export interface IAddCompanyReq {
  name: string;
  email: string;
  address: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
}

export interface IAddCompanyRes {}

export interface IEditCompanyReq extends IAddCompanyReq {
  id: number;
}
