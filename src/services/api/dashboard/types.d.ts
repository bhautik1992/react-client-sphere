export interface IDashboardRes {
  usersCount: number;
  clientsCount: number;
  projectsCount: number;
  companiesCount: number;
}

export interface IDashboardClientRes {
  id: number;
  name: string;
}

export interface IDashboardCompanyRes {
  id: number;
  name: string;
}
