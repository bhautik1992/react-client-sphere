export interface IProfileRes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileEditReq {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}
