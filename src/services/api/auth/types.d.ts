export interface ISignInReq {
  email: string;
  password: string;
}

export interface ISignInRes {
  id: number;
  firstName: string;
  lastName: string;
  personalEmail: string;
  companyEmail: string;
  access_token: string;
  role: string;
}

export interface IForgotPwdReq {
  email: string;
  employeeType: string;
}

export interface IResetPasswordReq {
  token: string;
  password: string;
  employeeType: string;
}

export interface IChangePasswordReq {
  id: number;
  currentPassword: string;
  newPassword: string;
}

export interface IChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
