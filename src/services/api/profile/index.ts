import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IProfileEditReq, IProfileRes } from './types';

export const profileAPI = {
  async profileDetail(id: number): Promise<IProfileRes> {
    return apiInstance
      .get(`${ApiEndPoints.profile.profileDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async profileEdit(data: IProfileEditReq): Promise<IProfileRes> {
    return apiInstance
      .post(`${ApiEndPoints.profile.editProfile}/${data.id}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};