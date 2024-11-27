import { IClientReq } from 'services/api/client/types';
import { ICompanyReq } from 'services/api/company/types';
import { IProjectReq } from 'services/api/project/types';
import { IUserReq } from 'services/api/users/types';

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
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  clientDetail: (id: number) => [`client-detail-${id}`],
  clientStatus: [`client-status`],
  clientAdd: [`add-client`],
  clientEdit: [`edit-client`],
  companyDelete: [`company-delete`]
};

export const projectKeys = {
  projectList: (data: IProjectReq) => [
    `project-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  projectDetail: (id: number) => [`project-detail-${id}`],
  projectAdd: [`add-project`],
  projectEdit: [`edit-project`],
  projectDelete: [`project-delete`],
  projectStatus: [`project-status`]
};

export const companyKeys = {
  companyList: (data: ICompanyReq) => [
    `company-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  companyDetail: (id: number) => [`company-detail-${id}`],
  companyDelete: [`company-delete`],
  companyAdd: [`add-company`],
  companyEdit: [`edit-company`]
};

export const dashboardKey = {
  dashboardCount: [`dashboard-count`],
  dashboardClient: [`dashboard-client`],
  dashboardCompany: [`dashboard-company`]
};

export const countryKey = {
  countryList: [`country-list`],
  countryAdd: [`country-add`]
};

export const profileKey = {
  profileDetail: [`profile-detail`],
  profileEdit: [`profile-edit`]
};

export const userKeys = {
  userList: (data: IUserReq) => [
    `user-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  userDetail: (id: number) => [`user-detail-${id}`],
  userDelete: [`user-delete`],
  userAdd: [`add-user`],
  userEdit: [`edit-user`]
};
