import { IClientReq } from 'services/api/client/types';
import { IResourceReq } from 'services/api/resources/types';
import { ITrainingReq } from 'services/api/training/types';

export const authKeys = {
  authMutate: ['auth-mutate-key'],
  authForgotPsw: [`auth-forgot-password`],
  authResetPsw: [`auth-reset-password`],
  authChangePsw: [`auth-change-password`]
};

export const clientKeys = {
  clientList: (data: IClientReq) => [
    `client-list`,
    `${data?.limit}`,
    `${data?.page}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  clientDetail: (id: number) => [`client-detail-${id}`],
  clientStatus: [`client-status`],
  clientAdd: [`add-client`],
  clientEdit: [`edit-client`]
};

export const trainingKeys = {
  trainingList: (data: ITrainingReq) => [
    `training-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  trainingDetail: (id: string) => [`training-detail-${id}`],
  trainingDelete: [`training-delete`],
  trainingAdd: [`add-training`],
  trainingEdit: [`edit-training`]
};

export const dashboardKey = {
  dashboardCount: [`dashboard-count`]
};

export const profileKey = {
  profileDetail: [`profile-detail`],
  profileEdit: [`profile-edit`]
};

export const resourceKeys = {
  resourceList: (data: IResourceReq) => [
    `resource-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  resourceDetail: (id: string) => [`resource-detail-${id}`],
  resourceDelete: [`resource-delete`],
  resourceAddEdit: [`add-edit-resource`],
  resourceTypeList: [`resource-type-list`],
  resourceImage: [`resource-image`]
};
