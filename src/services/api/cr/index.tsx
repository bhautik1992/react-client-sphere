import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IAddCrReq, IAddCrRes, ICr, ICrReq, ICrRes, ICrStatusReq, IEditCrReq } from './types';

export const crAPI = {
  async crList(data: ICrReq): Promise<ICrRes> {
    return apiInstance
      .post(ApiEndPoints.cr.crList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async crDetail(id: number): Promise<ICr> {
    return apiInstance
      .get(`${ApiEndPoints.cr.crDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteCr(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.cr.deleteCr}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async crStatus(data: ICrStatusReq): Promise<IApiSuccess<string>> {
    return apiInstance
      .post(ApiEndPoints.cr.crStatus, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addCr(data: IAddCrReq): Promise<IAddCrRes> {
    return apiInstance
      .post(ApiEndPoints.cr.addCr, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editCr(data: IEditCrReq): Promise<IAddCrRes> {
    return apiInstance
      .post(`${ApiEndPoints.cr.editCr}/${data.id}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async crDetailByProjectId(id: number): Promise<ICr> {
    return apiInstance
      .get(`${ApiEndPoints.cr.crDetailByProjectId}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
