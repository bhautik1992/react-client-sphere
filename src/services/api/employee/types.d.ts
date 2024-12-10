import { Key } from 'react';

export interface IEmployee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  personalEmail: string;
  companyEmail: string;
  phone: string;
  department: string;
  joiningDate: string;
  dateOfBirth: string;
  reportingPersonId: number;
  reportingPerson: IEmployee;
  employeeCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployeeRes {
  result: IEmployee[];
  recordsTotal: number;
}

export interface IEmployeeReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: string;
  sortBy?: Key;
}

export interface IAddEmployeeReq {
  id?: number;
  firstName: string;
  lastName: string;
  role: string;
  personalEmail: string;
  companyEmail: string;
  phone: string;
  department: string;
  joiningDate: string;
  dateOfBirth: string;
  reportingPersonId: number;
}

export interface IEditEmployeeReq extends IAddEmployeeReq {
  id: number;
}
export interface IAddEmployeeRes {}
