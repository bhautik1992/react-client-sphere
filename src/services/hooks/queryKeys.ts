import { IClientReq } from 'services/api/client/types';
import { ICompanyReq } from 'services/api/company/types';
import { ICityReq, IStateReq } from 'services/api/country/types';
import { ICrReq } from 'services/api/cr/types';
import { IEmployeeReq } from 'services/api/employee/types';
import { IProjectReq } from 'services/api/project/types';
import { IVendorReq } from 'services/api/vendor/types';

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

export const vendorKeys = {
  vendorList: (data: IVendorReq) => [
    `vendor-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  vendorDetail: (id: number) => [`vendor-detail-${id}`],
  vendorAdd: [`add-vendor`],
  vendorEdit: [`edit-vendor`],
  vendorDelete: [`vendor-delete`]
};

export const projectKeys = {
  projectList: (data: IProjectReq) => [
    `project-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`,
    `${data?.isInternalProject ?? ''}`
  ],
  projectDetail: (id: number) => [`project-detail-${id}`],
  projectAdd: [`add-project`],
  projectEdit: [`edit-project`],
  projectDelete: [`project-delete`],
  projectStatus: [`project-status`]
};

export const crKeys = {
  crList: (data: ICrReq) => [
    `cr-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`,
    `${data?.isInternalCr ?? ''}`
  ],
  crDetail: (id: number) => [`cr-detail-${id}`],
  crAdd: [`add-cr`],
  crEdit: [`edit-cr`],
  crDelete: [`cr-delete`],
  crStatus: [`cr-status`],
  crDetailByProductId: (id: number) => [`cr-detail-by-product-id-${id}`]
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
  dashboardCompany: [`dashboard-company`],
  dashboardEmployee: [`dashboard-employee`],
  dashboardProject: [`dashboard-project`]
};

export const countryStateCityKey = {
  countryList: [`country-list`],
  stateList: (data: IStateReq) => [`state-list`, `${data?.countryCode}`],
  cityList: (data: ICityReq) => [`city-list`, `${data?.countryCode}`, `${data?.stateCode}`]
};

export const profileKey = {
  profileDetail: [`profile-detail`],
  profileEdit: [`profile-edit`]
};

export const employeeKeys = {
  employeeList: (data: IEmployeeReq) => [
    `employee-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`
  ],
  employeeDetail: (id: number) => [`employee-detail-${id}`],
  employeeDelete: [`employee-delete`],
  employeeAdd: [`add-employee`],
  employeeEdit: [`edit-employee`]
};
