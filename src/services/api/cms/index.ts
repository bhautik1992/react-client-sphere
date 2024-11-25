import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { ICMS, ICMSEditReq } from './types';

export const cmsAPI = {
  async cmsList(): Promise<ICMS[]> {
    return apiInstance
      .get(`${ApiEndPoints.cms.cmsList}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async cmsDetail(key: string): Promise<ICMS> {
    return apiInstance
      .get(`${ApiEndPoints.cms.cmsDetail}/${key}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async cmsEdit(data: ICMSEditReq): Promise<ICMS> {
    return apiInstance
      .put(`${ApiEndPoints.cms.cmsEdit}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
