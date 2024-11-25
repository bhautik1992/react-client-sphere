import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IAddTrainingReq,
  IAddTrainingRes,
  IEditTrainingReq,
  IEditTrainingRes,
  ITraining,
  ITrainingReq,
  ITrainingRes
} from './types';

export const trainningAPI = {
  async trainingList(data: ITrainingReq): Promise<ITrainingRes> {
    return apiInstance
      .post(ApiEndPoints.training.trainingList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async trainingDetail(id: string): Promise<ITraining> {
    return apiInstance
      .get(`${ApiEndPoints.training.trainingDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteTraining(id: string): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.training.deleteTraining}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addTraining(data: IAddTrainingReq): Promise<IAddTrainingRes> {
    return apiInstance
      .post(ApiEndPoints.training.addTraining, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editTraining(data: IEditTrainingReq): Promise<IEditTrainingRes> {
    return apiInstance
      .post(ApiEndPoints.training.editTraining, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
