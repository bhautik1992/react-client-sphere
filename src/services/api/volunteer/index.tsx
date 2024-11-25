import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IAddVolunteerReq,
  IAddVolunteerRes,
  IEditVolunteerReq,
  IVolunteer,
  IVolunteerReq,
  IVolunteerRes,
  IVolunteerStatusReq
} from './types';

export const volunteerAPI = {
  async volunteerList(data: IVolunteerReq): Promise<IVolunteerRes> {
    return apiInstance
      .post(ApiEndPoints.volunteer.volunteerList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async volunteerDetail(id: string): Promise<IVolunteer> {
    return apiInstance
      .get(`${ApiEndPoints.volunteer.volunteerDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async volunteerStatus(data: IVolunteerStatusReq): Promise<IApiSuccess<string>> {
    return apiInstance
      .post(ApiEndPoints.volunteer.volunteerActiveInactive, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addVolunteer(data: IAddVolunteerReq): Promise<IAddVolunteerRes> {
    return apiInstance
      .post(ApiEndPoints.volunteer.addVolunteer, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editVolunteer(data: IEditVolunteerReq): Promise<IAddVolunteerRes> {
    return apiInstance
      .post(ApiEndPoints.volunteer.editVolunteer, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
