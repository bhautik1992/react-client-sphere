export interface ISignInReq {
  email: string;
  password: string;
}

export interface ISignInRes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  access_token: string;
}

export interface IForgotPwdReq {
  email: string;
  userType: string;
}

export interface IResetPasswordReq {
  token: string;
  password: string;
  userType: string;
}

export interface IChangePasswordReq {
  id: number;
  current_password: string;
  new_password: string;
}

export interface IChangePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
