import { Key } from 'react';

import { IClient } from '../client/types';
import { ICompany } from '../company/types';
import { ICr } from '../cr/types';
import { IEmployee } from '../employee/types';
import { IProject } from '../project/types';

interface IInvoice {
  id: number;
  invoiceNumber: string;
  customInvoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyId: number;
  company: ICompany;
  clientId: number;
  client: IClient;
  projectId: number;
  project: IProject;
  crIds: number[];
  crs: ICr[];
  amount: number;
  additionalAmount: number;
  additionalChargeDesc: string;
  isPaymentReceived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IInvoiceReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
}

export interface IAddInvoiceReq {
  customInvoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyId: number;
  clientId: number;
  projectId: number;
  crIds: number[];
  amount: number;
  additionalAmount: number;
  additionalChargeDesc: string;
  isUpdateCrAmount: boolean;
  crInvoiceAmount: ICrInvoiceAmt[];
}

export interface IInvoiceRes {
  result: IInvoice[];
  recordsTotal: number;
}

export interface IAddInvoiceRes {}

export interface IEditInvoiceReq extends IAddInvoiceReq {
  id: number;
}

export interface IInvoiceAmount {
  id: number;
  invoicedCost: number;
}
