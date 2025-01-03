import { Key } from 'react';

export interface IEmployee {
  id: number;
  employeeCode: string;
  firstName: string;
  middleName: string;
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
  PAN: string;
  aadhar: string;
  status: string;
  address: string;
  bankName: string;
  accountNumber: string;
  IFSC: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  imageUrl: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
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
  deletedEmployee?: boolean;
  employeeCode?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface IAddEmployeeReq {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  personalEmail: string;
  companyEmail: string;
  phone: string;
  department: string;
  joiningDate: string;
  dateOfBirth: string;
  reportingPersonId: number;
  PAN: string;
  aadhar: string;
  status: string;
  address: string;
  bankName: string;
  accountNumber: string;
  IFSC: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

export interface IEditEmployeeReq extends IAddEmployeeReq {
  id: number;
}
export interface IAddEmployeeRes {}

export interface IEmployeeStatusReq {
  id: number;
  status: string;
}

export interface IUploadImageRes {
  filename: string;
}
