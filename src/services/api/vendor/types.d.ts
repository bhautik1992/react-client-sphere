import { ICompany } from '../company/types';

export interface IVendor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: ICompany;
  vendorCompanyName: string;
  accountManager: string;
  address: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityName: string;
  skypeId: string;
  website: string;
}

export interface IVendorReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
}

export interface IAddVendorReq {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: number;
  vendorCompanyName: string;
  accountManager: string;
  address: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  skypeId: string;
  website: string;
}

export interface IVendorRes {
  result: IVendor[];
  recordsTotal: number;
}

export interface IAddVendorRes {}

export interface IEditVendorReq extends IAddVendorReq {
  id: number;
}
