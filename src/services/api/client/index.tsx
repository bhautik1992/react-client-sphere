import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IAddClientReq,
  IAddClientRes,
  IClient,
  IClientReq,
  IClientStatusReq,
  IEditClientReq
} from './types';

export const clientAPI = {
  async clientList(data: IClientReq): Promise<IClient[]> {
    return apiInstance
      .post(ApiEndPoints.client.clientList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async clientDetail(id: number): Promise<IClient> {
    return apiInstance
      .get(`${ApiEndPoints.client.clientDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async clientStatus(data: IClientStatusReq): Promise<IApiSuccess<string>> {
    return apiInstance
      .post(ApiEndPoints.client.clientActiveInactive, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addClient(data: IAddClientReq): Promise<IAddClientRes> {
    return apiInstance
      .post(ApiEndPoints.client.addClient, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editClient(data: IEditClientReq): Promise<IAddClientRes> {
    return apiInstance
      .post(`${ApiEndPoints.client.editClient}/${data.id}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
