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

  clientManagement: `/clients-management`,
  clientView: `/clients-management/view-client`,
  clientEdit: `/clients-management/edit-client`,
  clientAdd: `/clients-management/add-client`,

  vendorManagement: `/vendors-management`,
  vendorView: `/vendors-management/view-vendor`,
  vendorEdit: `/vendors-management/edit-vendor`,
  vendorAdd: `/vendors-management/add-vendor`,

  usersManagement: `/users-management`,
  usersView: `/users-management/view-user`,
  usersEdit: `/users-management/edit-user`,
  usersAdd: `/users-management/add-user`,

  projectManagement: `/project-management`,
  projectView: `/project-management/view-project`,
  projectEdit: `/project-management/edit-project`,
  projectAdd: `/project-management/add-project`,

  companyManagement: `/company-management`,
  companyView: `/company-management/view-company`,

  dynamicPath: (path: string) => `/static-path/${path}`
};
