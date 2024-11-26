import { Key } from 'react';

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface IUserRes {
  result: IUser[];
  recordsTotal: number;
}

export interface IUserReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: string;
  sortBy?: Key;
}

export interface IUserDetailRes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface IAddUserReq {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface IEditUserReq extends IAddUserReq {
  id: number;
}
export interface IAddUserRes {}
