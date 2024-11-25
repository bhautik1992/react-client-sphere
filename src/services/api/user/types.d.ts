export interface IUserListReq {
  limit: number;
  offset: number;
  search?: string;
  sortOrder?: string;
  sortBy?: string | number | bigint;
}

export interface IUserListRes {
  result: IUser[];
  recordsTotal: number;
  recordsFiltered: number;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  school: string;
  standard: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  profilePicture?: any;
  isVerified: boolean;
  emailVerificationToken?: any;
  isActive: boolean;
  isDeleted: boolean;
}

export interface IUserStatusReq {
  userId: string;
  status: boolean;
}
