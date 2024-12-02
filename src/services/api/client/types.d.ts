import { Key } from 'react';

import { ICountry } from '../country/types';
import { IProject } from '../project/types';

export interface IClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  companyName: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityName: string;
  gender: string;
  status: string;
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
  companyName: string;
  gender: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  status: string;
  address: string;
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
