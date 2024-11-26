import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IAddCompanyReq,
  IAddCompanyRes,
  ICompany,
  ICompanyReq,
  ICompanyRes,
  IEditCompanyReq
} from './types';

export const companyAPI = {
  async companyList(data: ICompanyReq): Promise<ICompanyRes> {
    return apiInstance
      .post(ApiEndPoints.company.companyList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async companyDetail(id: number): Promise<ICompany> {
    return apiInstance
      .get(`${ApiEndPoints.company.companyDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteCompany(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.company.deleteCompany}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addCompany(data: IAddCompanyReq): Promise<IAddCompanyRes> {
    return apiInstance
      .post(ApiEndPoints.company.addCompany, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editCompany(data: IEditCompanyReq): Promise<IAddCompanyRes> {
    return apiInstance
      .post(`${ApiEndPoints.company.editCompany}/${data.id}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
