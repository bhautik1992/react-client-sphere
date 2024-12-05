import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IAddVendorReq,
  IAddVendorRes,
  IEditVendorReq,
  IVendor,
  IVendorReq,
  IVendorRes
} from './types';

export const vendorAPI = {
  async vendorList(data: IVendorReq): Promise<IVendorRes> {
    return apiInstance
      .post(ApiEndPoints.vendor.vendorList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async vendorDetail(id: number): Promise<IVendor> {
    return apiInstance
      .get(`${ApiEndPoints.vendor.vendorDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteVendor(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.vendor.deleteVendor}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addVendor(data: IAddVendorReq): Promise<IAddVendorRes> {
    return apiInstance
      .post(ApiEndPoints.vendor.addVendor, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editVendor(data: IEditVendorReq): Promise<IAddVendorRes> {
    return apiInstance
      .post(`${ApiEndPoints.vendor.editVendor}/${data.id}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
