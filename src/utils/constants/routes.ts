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

  clientManagement: `/clients`,
  clientView: `/clients/view-client`,

  usersManagement: `/users-management`,
  usersView: `/users-management/view-user`,

  companyManagement: `/company-management`,
  companyView: `/company-management/view-company`,

  dynamicPath: (path: string) => `/static-path/${path}`
};
