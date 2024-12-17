// Env variables
export const API_BASE = import.meta.env.VITE_REACT_APP_API_BASE;
export const APP_NAME = import.meta.env.VITE_REACT_APP_NAME;

// Local Storage Variables
export const LocalStorageKeys = {
  employee: `employee${APP_NAME}`,
  authToken: `authToken${APP_NAME}`
};

// Api Endpoint
export const ApiEndPoints = {
  auth: {
    signIn: `auth/login`,
    forgotPassword: `auth/forgot-password`,
    changePassword: `auth/changePassword`
  },
  dashboard: {
    dashboardCount: `dashboard/count`,
    dashboardClient: `dashboard/client-list`,
    dashboardCompany: `dashboard/company-list`,
    dashboardEmployee: `dashboard/employee-list`,
    dashboardProject: `dashboard/project-list`
  },
  profile: {
    profileDetail: `dashboard/employee-profile`,
    editProfile: `employee/update`
  },
  employee: {
    employeeList: `employee/list`,
    employeeDetail: `employee/get`,
    employeeAdd: `employee/create`,
    employeeEdit: `employee/update`,
    employeeDelete: `employee/delete`
  },
  client: {
    clientList: `client/list`,
    clientActiveInactive: `client/active-inactive`,
    clientDetail: `client/get`,
    addClient: `client/create`,
    editClient: `client/update`,
    deleteClient: `client/delete`
  },
  vendor: {
    vendorList: `vendor/list`,
    vendorDetail: `vendor/get`,
    addVendor: `vendor/create`,
    editVendor: `vendor/update`,
    deleteVendor: `vendor/delete`
  },
  project: {
    projectList: `project/list`,
    addProject: `project/create`,
    editProject: `project/update`,
    deleteProject: `project/delete`,
    projectDetail: `project/get`,
    projectStatus: `project/status`,
    exportProjects: `project/export`
  },
  cr: {
    crList: `cr/list`,
    addCr: `cr/create`,
    editCr: `cr/update`,
    deleteCr: `cr/delete`,
    crDetail: `cr/get`,
    crStatus: `cr/status`,
    crDetailByProjectId: `cr/getByProjectId`,
    exportCrs: `cr/export`
  },
  company: {
    companyList: `company/list`,
    addCompany: `company/create`,
    editCompany: `company/update`,
    deleteCompany: `company/delete`,
    companyDetail: `company/get`
  },
  country_state_city: {
    countryList: `country-state-city/country-list`,
    stateList: `country-state-city/state-list`,
    cityList: `country-state-city/city-list`
  },
  invoice: {
    invoiceList: `invoice/list`,
    invoiceDetail: `invoice/get`,
    addInvoice: `invoice/create`,
    deleteInvoice: `invoice/delete`
  }
};
