import { AxiosResponse } from 'axios';

import { IApiSuccess } from 'utils/Types';
import { ApiEndPoints } from 'utils/constants';

import apiInstance from '..';
import {
  IAddProjectReq,
  IAddProjectRes,
  IEditProjectReq,
  IProject,
  IProjectReq,
  IProjectRes,
  IProjectStatusReq
} from './types';

export const projectAPI = {
  async projectList(data: IProjectReq): Promise<IProjectRes> {
    return apiInstance
      .post(ApiEndPoints.project.projectList, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async projectDetail(id: number): Promise<IProject> {
    return apiInstance
      .get(`${ApiEndPoints.project.projectDetail}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async deleteProject(id: number): Promise<IApiSuccess<string>> {
    return apiInstance
      .delete(`${ApiEndPoints.project.deleteProject}/${id}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async projectStatus(data: IProjectStatusReq): Promise<IApiSuccess<string>> {
    return apiInstance
      .post(ApiEndPoints.project.projectStatus, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async addProject(data: IAddProjectReq): Promise<IAddProjectRes> {
    return apiInstance
      .post(ApiEndPoints.project.addProject, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async editProject(data: IEditProjectReq): Promise<IAddProjectRes> {
    return apiInstance
      .post(`${ApiEndPoints.project.editProject}/${data.id}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  },

  async exportProjects(data: IProjectReq): Promise<AxiosResponse<Blob>> {
    return apiInstance
      .post(ApiEndPoints.project.exportProjects, data, { responseType: 'blob' })
      .then((response) => response)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
};
