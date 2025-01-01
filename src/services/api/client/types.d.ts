import { Key } from 'react';

import { ICompany } from '../company/types';
import { ICountry } from '../country/types';
import { IEmployee } from '../employee/types';
import { IProject } from '../project/types';

export interface IClient {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  phone: string;
  company: ICompany;
  clientCompanyName: string;
  accountManagerId: number;
  accountManager: IEmployee;
  website: string;
  address: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityName: string;
  gender: string;
  status: string;
  zipCode: string;
  comment: string;
  projects: IProject[];
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IClientReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
  deletedClient?: boolean;
  name?: string;
  email?: string;
  accountManagerId?: number;
  status?: string;
}

export interface IAddClientReq {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  phone: string;
  companyId: number;
  clientCompanyName: string;
  accountManagerId: number;
  webSite: string;
  gender: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  status: string;
  address: string;
  zipCode: string;
  comment: string;
}

export interface IClientRes {
  result: IClient[];
  recordsTotal: number;
}

export interface IAddClientRes {}

export interface IEditClientReq extends IAddClientReq {
  id: number;
}

export interface IClientStatusReq {
  clientId: number;
  status: string;
}
