import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import { IAddUserReq, IAddUserRes, IEditUserReq, IUser, IUserReq, IUserRes } from './types';

export const userAPI = {
  async userList(data: IUserReq): Promise<IUserRes> {
    return apiInstance
      .post(ApiEndPoints.user.userList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async userDetail(id: number): Promise<IUser> {
    return apiInstance
      .get(`${ApiEndPoints.user.userDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteUser(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.user.userDelete}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addUser(data: IAddUserReq): Promise<IAddUserRes> {
    return apiInstance
      .post(ApiEndPoints.user.userAdd, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editUser(data: IEditUserReq): Promise<IAddUserRes> {
    return apiInstance
      .post(`${ApiEndPoints.user.userEdit}/${data.id}`, data)
      .then((response) => {
        return response?.data;
      })
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
