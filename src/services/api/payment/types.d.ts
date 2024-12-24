import { Key } from 'react';

import { IClient } from '../client/types';
import { ICompany } from '../company/types';
import { IInvoice, IInvoiceAmount } from '../invoice/types';
import { IProject } from '../project/types';

interface IPayment {
  id: number;
  paymentNumber: string;
  uniquePaymentId: string;
  paymentDate: string;
  companyId: number;
  company: ICompany;
  clientId: number;
  client: IClient;
  projectId: number;
  project: IProject;
  invoices: IInvoice[];
  paymentMethod: string;
  receivedINR: number;
  paymentAmount: number;
  conversionRate: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IPaymentReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: Key;
  sortBy?: Key;
  deletedPayment?: boolean;
}

export interface IAddPaymentReq {
  uniquePaymentId: string;
  paymentMethod: string;
  paymentDate: string;
  companyId: number;
  clientId: number;
  projectId: number;
  receivedINR: number;
  paymentAmount: number;
  conversionRate: number;
  comment: string;
  invoiceIds: number[];
  invoiceAmount: IInvoiceAmount[];
}

export interface IPaymentRes {
  result: IPayment[];
  recordsTotal: number;
}

export interface IAddPaymentRes {}
