export interface IDashboardRes {
  employeesCount: number;
  clientsCount: number;
  projectsCount: number;
  companiesCount: number;
}

export interface IDashboardClientRes {
  id: number;
  firstName: string;
  lastName: string;
  companyName: string;
  clientCompanyName: string;
}

export interface IDashboardCompanyRes {
  id: number;
  name: string;
  email: string;
}

export interface IDashboardEmployeeRes {
  id: number;
  firstName: string;
  lastName: string;
  personalEmail: string;
  companyEmail: string;
  role: string;
}

export interface IDashboardProjectRes {
  id: number;
  name: string;
  status: string;
  billingType: string;
  currency: string;
  client: Client;
}

interface Client {
  id: number;
  clientCompanyName: string;
}
