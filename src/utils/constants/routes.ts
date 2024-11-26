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
  usersEdit: `/users-management/edit-user`,
  usersAdd: `/users-management/add-user`,

  trainingMangement: `/training-management`,
  trainingView: `/training-management/view-training`,
  trainingAdd: `/training-management/add-training`,
  trainingEdit: `/training-management/edit-training`,

  dynamicPath: (path: string) => `/static-path/${path}`
};
