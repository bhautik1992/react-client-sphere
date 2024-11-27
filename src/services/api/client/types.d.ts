import { Key } from 'react';

import { ICountry } from '../country/types';
import { IProject } from '../project/types';

export interface IClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: ICountry;
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
  name: string;
  email: string;
  phone: string;
  gender: string;
  countryId: number;
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
