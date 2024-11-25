import { Key } from 'react';

export interface IVolunteer {
  address: string;
  birthDate: string;
  city: string;
  country: string;
  designation: string;
  email: string;
  firstName: string;
  gender: string;
  isActive: boolean;
  lastName: string;
  phoneNumber: string;
  state: string;
  zipCode: string;
  _id: string;
}

export interface IVolunteerRes {
  result: IVolunteer[];
  recordsTotal: number;
  recordsFiltered: number;
}

export interface IVolunteerReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
  category?: string[] | FilterValue | null;
}

export interface IAddVolunteerReq {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  birthDate?: string;
  designation?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  address?: string;
}

export interface IAddVolunteerRes {}

export interface IEditVolunteerReq extends IAddVolunteerReq {
  _id: string;
}

export interface IVolunteerStatusReq {
  userId: string;
  status: boolean;
}
