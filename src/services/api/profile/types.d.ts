export interface IProfileRes {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
  personalEmail: string;
  companyEmail: string;
  phone: string;
  department: string;
  password: string;
  dateOfBirth: string;
  joiningDate: string;
  reportingPersonId: number;
  employeeCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileEditReq {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
}
