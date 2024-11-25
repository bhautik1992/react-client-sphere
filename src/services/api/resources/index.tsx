import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IResourceDetailRes,
  IResourceReq,
  IResourceRes,
  IResourceTypeRes,
  IUploadImageRes
} from './types';

export const resourceAPI = {
  async resourceList(data: IResourceReq): Promise<IResourceRes> {
    return apiInstance
      .post(ApiEndPoints.resource.resourceList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async resourceDetail(id: string): Promise<IResourceDetailRes> {
    return apiInstance
      .get(`${ApiEndPoints.resource.resourceDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteResource(id: string): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.resource.resourceDelete}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addEditResource(data: any): Promise<string> {
    return apiInstance
      .post(ApiEndPoints.resource.resourceAddEdit, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async resourceTypeList(): Promise<IResourceTypeRes> {
    return apiInstance
      .post(ApiEndPoints.resource.resourceTypeList)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async uploadImage(data: FormData): Promise<IUploadImageRes[]> {
    return apiInstance
      .post(`${ApiEndPoints.uploadImage.uploadImage}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
