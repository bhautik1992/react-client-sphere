import { Key } from 'react';

interface IProject {
  id: number;
  name: string;
  description: string;
  status: string;
  amount: number;
  startDate: string;
  endDate: null;
  createdAt: string;
  updatedAt: string;
  clientId: number;
  companyId: number;
}

export interface IClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  gender: string;
  status: string;
  projects: project[];
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
  country: string;
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
