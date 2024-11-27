// Env variables
export const API_BASE = import.meta.env.VITE_REACT_APP_API_BASE;
export const APP_NAME = import.meta.env.VITE_REACT_APP_NAME;

// Local Storage Variables
export const LocalStorageKeys = {
  user: `user${APP_NAME}`,
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
    dashboardCompany: `dashboard/company-list`
  },
  profile: {
    profileDetail: `dashboard/user-profile`,
    editProfile: `user/update`
  },
  user: {
    userList: `user/list`,
    userDetail: `user/get`,
    userAdd: `user/create`,
    userEdit: `user/update`,
    userDelete: `user/delete`
  },
  client: {
    clientList: `client/list`,
    clientActiveInactive: `client/active-inactive`,
    clientDetail: `client/get`,
    addClient: `client/create`,
    editClient: `client/update`,
    deleteClient: `client/delete`
  },
  project: {
    projectList: `project/list`,
    addProject: `project/create`,
    editProject: `project/update`,
    deleteProject: `project/delete`,
    projectDetail: `project/get`,
    projectStatus: `project/status`
  },
  company: {
    companyList: `company/list`,
    addCompany: `company/create`,
    editCompany: `company/update`,
    deleteCompany: `company/delete`,
    companyDetail: `company/get`
  },
  country: {
    countryList: `country/list`,
    addCountry: `country/create`
  }
};
