import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IIncidentCommentRes, IIncidentDetailRes, IIncidentReq, IIncidentRes } from './type';

export const incidentAPI = {
  async incidentList(data: IIncidentReq): Promise<IIncidentRes> {
    return apiInstance
      .post(ApiEndPoints.incident.incidentList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async incidentDelete(id: string): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.incident.incidentDelete}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async incidentDetail(id: string): Promise<IIncidentDetailRes> {
    return apiInstance
      .get(`${ApiEndPoints.incident.incidentDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async incidentCommentList(id: string): Promise<IIncidentCommentRes> {
    return apiInstance
      .get(`${ApiEndPoints.incident.incidentCommentList}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
