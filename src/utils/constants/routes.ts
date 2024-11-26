export const ROUTES = {
  default: `/`,
  pageNotFound: `/404`,
  signIn: `/login`,
  changePassword: `/change-password`,
  forgotPassword: `/forgot-password`,
  ResetPassword: `/reset-password`,

  myProfile: `/my-profile`,
  editMyProfile: `/edit-profile`,
  dashboard: `/dashboard`,

  incidentManagement: `/incident`,
  incidentView: `/incident/view-incident`,

  clientManagement: `/clients`,
  clientView: `/clients/view-client`,

  trainingMangement: `/training-management`,
  trainingView: `/training-management/view-training`,
  trainingAdd: `/training-management/add-training`,
  trainingEdit: `/training-management/edit-training`,

  resourcesMangement: `/resources-management`,
  resourcesView: `/resources-management/view-resource`,
  resourcesEdit: `/resources-management/edit-resource`,
  resourcesAdd: `/resources-management/add-resource`,

  supportCallNumber: `/support-call-number`,

  cms: `/cms-management`,
  editCms: `/cms-management/edit`,

  consentForm: `/consent-form`,
  consentFormView: `/consent-form/view`,

  dynamicPath: (path: string) => `/static-path/${path}`
};
