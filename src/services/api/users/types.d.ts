import { Key } from 'react';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  personalEmail: string;
  companyEmail: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  dateOfBirth: string;
  reportingPerson: string;
  userCode: string;
  createdAt: string;
  updatedAt: string;
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

export interface IAddUserReq {
  id?: number;
  firstName: string;
  lastName: string;
  role: string;
  personalEmail: string;
  companyEmail: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  dateOfBirth: string;
  reportingPerson: string;
}

export interface IEditUserReq extends IAddUserReq {
  id: number;
}
export interface IAddUserRes {}
