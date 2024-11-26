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
    dashboardCount: `dashboard/count`
  },
  profile: {
    profileDetail: `dashboard/user-profile`,
    editProfile: `user/update`
  },
  client: {
    clientList: `client/list`,
    clientActiveInactive: `client/active-inactive`,
    clientDetail: `client/get`,
    addClient: `client/create`,
    editClient: `client/update`,
    deleteClient: `client/delete`
  },
  user: {
    userList: `user/list`,
    userDetail: `user/get`,
    userAdd: `user/create`,
    userEdit: `user/update`,
    userDelete: `user/delete`
  },
  company: {
    companyList: `company/list`,
    addCompany: `company/create`,
    editCompany: `company/update`,
    deleteCompany: `company/delete`,
    companyDetail: `company/get`
  }
};
