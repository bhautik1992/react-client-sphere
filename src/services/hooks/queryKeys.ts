import { IClientReq } from 'services/api/client/types';
import { ICompanyReq } from 'services/api/company/types';
import { ICityReq, IStateReq } from 'services/api/country/types';
import { ICrReq } from 'services/api/cr/types';
import { IEmployeeReq } from 'services/api/employee/types';
import { IInvoiceReq } from 'services/api/invoice/types';
import { IPaymentReq } from 'services/api/payment/types';
import { IProjectReq } from 'services/api/project/types';

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
    `${data?.sortOrder ?? ''}`,
    `${data?.deletedClient ?? ''}`
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
    `${data?.sortOrder ?? ''}`,
    `${data?.isInternalProject ?? ''}`,
    `${data?.deletedProject ?? ''}`,
    `${data?.projectManagerId ?? ''}`,
    `${data?.clientId ?? ''}`,
    `${data?.status ?? ''}`,
    `${data?.name ?? ''}`,
    `${data?.startDate ?? ''}`
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
    `${data?.isInternalCr ?? ''}`,
    `${data?.deletedCr ?? ''}`,
    `${data?.clientId ?? ''}`,
    `${data?.projectId ?? ''}`,
    `${data?.status ?? ''}`,
    `${data?.name ?? ''}`,
    `${data?.startDate ?? ''}`
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
    `${data?.sortOrder ?? ''}`,
    `${data?.deletedVendor ?? ''}`
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
    `${data?.sortOrder ?? ''}`,
    `${data?.deletedEmployee ?? ''}`,
    `${data?.employeeCode ?? ''}`,
    `${data?.name ?? ''}`,
    `${data?.email ?? ''}`,
    `${data?.role ?? ''}`
  ],
  employeeDetail: (id: number) => [`employee-detail-${id}`],
  employeeDelete: [`employee-delete`],
  employeeAdd: [`add-employee`],
  employeeEdit: [`edit-employee`],
  employeeStatus: [`employee-status`]
};

export const invoiceKeys = {
  invoiceList: (data: IInvoiceReq) => [
    `invoice-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`,
    `${data?.deletedInvoice ?? ''}`,
    `${data?.clientId ?? ''}`,
    `${data?.projectId ?? ''}`,
    `${data?.invoiceNumber ?? ''}`,
    `${data?.invoiceDate ?? ''}`
  ],
  invoiceDetail: (id: number) => [`invoice-detail-${id}`],
  invoiceAdd: [`add-invoice`],
  invoiceDelete: [`invoice-delete`],
  invoiceByProjectId: (id: number) => [`invoice-by-project-id-${id}`],
  generatedInvoiceNumber: [`generated-invoice-number`],
  markAsPaid: [`mark-as-paid`]
};

export const paymentKeys = {
  paymentList: (data: IPaymentReq) => [
    `payment-list`,
    `${data?.limit}`,
    `${data?.offset}`,
    `${data?.search ?? ''}`,
    `${data?.sortBy ?? ''}`,
    `${data?.sortOrder ?? ''}`,
    `${data?.deletedPayment ?? ''}`,
    `${data?.projectId ?? ''}`,
    `${data?.paymentNumber ?? ''}`,
    `${data?.paymentDate ?? ''}`
  ],
  paymentDetail: (id: number) => [`payment-detail-${id}`],
  paymentAdd: [`add-payment`],
  paymentDelete: [`payment-delete`],
  generatedPaymentNumber: [`generated-payment-number`]
};

export const milestoneKeys = {
  milestoneDelete: [`milestone-delete`]
};
