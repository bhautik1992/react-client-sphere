export interface IDashboardReq {
  endDate?: string;
  startDate?: string;
}

export interface IDashboardRes {
  incidentCount: number;
  pendingIncidentCount: number;
  userCount: number;
  volunteerCount: number;
}
