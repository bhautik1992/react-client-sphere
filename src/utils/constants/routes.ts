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

  clientManagement: `/client-management`,
  clientView: `/client-management/view-client`,
  clientEdit: `/client-management/edit-client`,
  clientAdd: `/client-management/add-client`,

  vendorManagement: `/vendor-management`,
  vendorView: `/vendor-management/view-vendor`,
  vendorEdit: `/vendor-management/edit-vendor`,
  vendorAdd: `/vendor-management/add-vendor`,

  employeeManagement: `/employee-management`,
  employeeView: `/employee-management/view-employee`,
  employeeEdit: `/employee-management/edit-employee`,
  employeeAdd: `/employee-management/add-employee`,

  projectManagement: `/project-management`,
  projectView: `/project-management/view-project`,
  projectEdit: `/project-management/edit-project`,
  projectAdd: `/project-management/add-project`,

  crManagement: `/cr-management`,
  crView: `/cr-management/view-cr`,
  crEdit: `/cr-management/edit-cr`,
  crAdd: `/cr-management/add-cr`,

  companyManagement: `/company-management`,
  companyView: `/company-management/view-company`,
  companyAdd: `/company-management/add-company`,
  companyEdit: `/company-management/edit-company`,

  invoiceManagement: `/invoice-management`,
  invoiceView: `/invoice-management/view-invoice`,
  invoiceAdd: `/invoice-management/add-invoice`,

  paymentManagement: `/payment-management`,
  paymentView: `/payment-management/view-payment`,
  paymentAdd: `/payment-management/add-payment`,

  dynamicPath: (path: string) => `/static-path/${path}`
};
