import { Key } from 'react';

import { ICountry } from '../country/types';
import { IProject } from '../project/types';

export interface IClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  companyName: string;
  clientCompanyName: string;
  accountManager: string;
  webSite: string;
  address: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityName: string;
  gender: string;
  status: string;
  zipCode: string;
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
  designation: string;
  companyName: string;
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
