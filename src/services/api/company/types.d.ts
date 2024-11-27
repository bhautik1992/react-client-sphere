import { Key } from 'react';

import { ICountry } from '../country/types';
import { IProject } from '../project/types';

export interface ICompany {
  id: number;
  name: string;
  email: string;
  address: string;
  country: ICountry;
  projects: IProject[];
}

export interface ICompanyReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: string;
  sortBy?: Key;
}

export interface ICompanyRes {
  result: ICompany[];
  recordsTotal: number;
}

export interface IAddCompanyReq {
  name: string;
  email: string;
  address: string;
  countryId: number;
}

export interface IAddCompanyRes {}

export interface IEditCompanyReq extends IAddCompanyReq {
  id: number;
}
