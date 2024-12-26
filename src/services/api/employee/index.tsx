import { AxiosResponse } from 'axios';

import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IAddEmployeeReq,
  IAddEmployeeRes,
  IEditEmployeeReq,
  IEmployee,
  IEmployeeReq,
  IEmployeeRes,
  IEmployeeStatusReq
} from './types';

export const employeeAPI = {
  async employeeList(data: IEmployeeReq): Promise<IEmployeeRes> {
    return apiInstance
      .post(ApiEndPoints.employee.employeeList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async employeeDetail(id: number): Promise<IEmployee> {
    return apiInstance
      .get(`${ApiEndPoints.employee.employeeDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteEmployee(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.employee.employeeDelete}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addEmployee(data: IAddEmployeeReq): Promise<IAddEmployeeRes> {
    return apiInstance
      .post(ApiEndPoints.employee.employeeAdd, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editEmployee(data: IEditEmployeeReq): Promise<IAddEmployeeRes> {
    return apiInstance
      .post(`${ApiEndPoints.employee.employeeEdit}/${data.id}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async employeeStatus(data: IEmployeeStatusReq): Promise<IApiSuccess<string>> {
    return apiInstance
      .post(ApiEndPoints.employee.employeeStatusChange, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async exportEmployees(data: IEmployeeReq): Promise<AxiosResponse<Blob>> {
    return apiInstance
      .post(ApiEndPoints.employee.employeeExport, data, { responseType: 'blob' })
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  // async uploadImage(data: FormData): Promise<IUploadImageRes[]> {
  //   return apiInstance
  //     .post(`${ApiEndPoints.uploadImage.uploadImage}`, data)
  //     .then((response) => {
  //       return response?.data;
  //     })
  //     .catch((error) => {
  //       throw error?.response?.data;
  //     });
  // }
};
