import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IAddPaymentReq, IAddPaymentRes, IPayment, IPaymentReq, IPaymentRes } from './types';

export const paymentAPI = {
  async paymentList(data: IPaymentReq): Promise<IPaymentRes> {
    return apiInstance
      .post(ApiEndPoints.payment.paymentList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async paymentDetail(id: number): Promise<IPayment> {
    return apiInstance
      .get(`${ApiEndPoints.payment.paymentDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deletePayment(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.payment.deletePayment}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addPayment(data: IAddPaymentReq): Promise<IAddPaymentRes> {
    return apiInstance
      .post(ApiEndPoints.payment.addPayment, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async generatedPaymentNumber(): Promise<IApiSuccess<string>> {
    return apiInstance
      .get(`${ApiEndPoints.payment.generatedPaymentNumber}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
