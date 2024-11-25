import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IUser, IUserListReq, IUserListRes, IUserStatusReq } from './types';

export const userAPI = {
  async userList(data: IUserListReq): Promise<IUserListRes> {
    return apiInstance
      .post(ApiEndPoints.user.userList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async userDetail(id: string): Promise<IUser> {
    return apiInstance
      .get(`${ApiEndPoints.user.userDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async userStatus(data: IUserStatusReq): Promise<IApiSuccess<string>> {
    return apiInstance
      .post(ApiEndPoints.user.userActiveInactive, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
