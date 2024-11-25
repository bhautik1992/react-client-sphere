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
  user: {
    userList: `admin/user/list-user`,
    userDetail: `admin/user/details`,
    userActiveInactive: `admin/user/active-inactive`
  },
  incident: {
    incidentList: `admin/incident/list-incident`,
    incidentDelete: `admin/incident/delete`,
    incidentDetail: `admin/incident/details`,
    incidentCommentList: `admin/incident/list-comment`
  },
  volunteer: {
    volunteerList: `admin/volunteer/list-volunteer`,
    volunteerActiveInactive: `admin/volunteer/active-inactive`,
    volunteerDetail: `admin/volunteer/details`,
    addVolunteer: `admin/volunteer/add-volunteer`,
    editVolunteer: `admin/volunteer/edit-volunteer`
  },
  training: {
    trainingList: `admin/training/list-training`,
    addTraining: `admin/training/add-training`,
    editTraining: `admin/training/edit-training`,
    deleteTraining: `admin/training/delete`,
    trainingDetail: `admin/training/details`
  },
  dashboard: {
    dashboardCount: `admin/count`
  },
  cms: {
    cmsList: `cms`,
    cmsDetail: `cms`,
    cmsEdit: `cms/update`
  },
  profile: {
    profileDetail: `user/get`,
    editProfile: `user/update`
  },
  resource: {
    resourceList: `admin/resource/list-resource`,
    resourceDetail: `admin/resource/details`,
    resourceAddEdit: `admin/resource/add-edit-resource`,
    resourceDelete: `admin/resource/delete`,
    resourceTypeList: `admin/resource/resource-type-list`
  },
  uploadImage: {
    uploadImage: `upload-files`
  },
  json: {
    jsonFile: `json`
  },
  consentForm: {
    consentFormList: `consent-form/list`,
    consentFormDetail: `consent-form/details`
  }
};

export const JsonFileType = {
  incidentType: `incident_types.json`,
  responderCategory: `responder_categories.json`
};
