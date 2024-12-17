import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IAddInvoiceReq, IAddInvoiceRes, IInvoice, IInvoiceReq, IInvoiceRes } from './types';

export const invoiceAPI = {
  async invoiceList(data: IInvoiceReq): Promise<IInvoiceRes> {
    return apiInstance
      .post(ApiEndPoints.invoice.invoiceList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async invoiceDetail(id: number): Promise<IInvoice> {
    return apiInstance
      .get(`${ApiEndPoints.invoice.invoiceDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteInvoice(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.invoice.deleteInvoice}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addInvoice(data: IAddInvoiceReq): Promise<IAddInvoiceRes> {
    return apiInstance
      .post(ApiEndPoints.invoice.addInvoice, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
