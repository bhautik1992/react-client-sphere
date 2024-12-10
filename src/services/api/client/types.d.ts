import { Key } from 'react';

import { EmployeeStatus } from 'utils/constants/enum';

import { ICompany } from '../company/types';
import { ICountry } from '../country/types';
import { IProject } from '../project/types';

export interface IClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: ICompany;
  clientCompanyName: string;
  accountManager: string;
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
  skypeId: string;
  projects: IProject[];
}

export interface IClientReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
}

export interface IAddClientReq {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: number;
  clientCompanyName: string;
  accountManager: string;
  webSite: string;
  gender: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  status: string;
  address: string;
  zipCode: string;
  skypeId: string;
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
