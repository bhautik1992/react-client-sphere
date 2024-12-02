export interface IProfileRes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileEditReq {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
