export const COMPANY_EMAIL = 'infiazure@gmail.com';

export enum MenuPermissions {
  DASHBOARD = '1',
  EMPLOYEES = '2',
  CLIENTS = '3',
  VENDORS = '4',
  PROJECTS = '5',
  PROJECT_CRS = '6',
  INVOICES = '7',
  PAYMENT = '8',
  COMPANIES = '9'
}

export enum EmployeeStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export enum ProjectStatusName {
  NotStarted = 'not_started',
  Started = 'started',
  Pending = 'pending',
  Completed = 'completed'
}

export enum CrStatusName {
  NotStarted = 'not_started',
  Started = 'started',
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum EmployeeRoleName {
  Admin = 'admin',
  Sales_Manager = 'sales_manager',
  Sales_Executive = 'sales_executive',
  Project_Manager = 'project_manager',
  Team_Leader = 'team_leader',
  Senior_Software_Engineer = 'senior_software_engineer',
  Software_Engineer = 'software_engineer',
  Trainee = 'trainee'
}

export enum BillingTypeName {
  Hourly = 'hourly',
  Monthly = 'monthly',
  Fixed = 'fixed'
}

export enum InvoiceStatusName {
  Generated = 'generated',
  PartialCompleted = 'partial_completed',
  Completed = 'completed'
}

export enum InvoicePaymentCycleName {
  Weekly = 'weekly',
  BiWeekly = 'biweekly',
  Monthly = 'monthly'
}

export enum InvoiceDayName {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday'
}

export enum PaymentStatusName {
  Paid = 'paid',
  Unpaid = 'unpaid',
  PartialPaid = 'partial_paid'
}

export const EmployeeRole = [
  {
    value: EmployeeRoleName.Admin,
    label: 'Admin'
  },
  {
    value: EmployeeRoleName.Sales_Manager,
    label: 'Sales Manager'
  },
  {
    value: EmployeeRoleName.Sales_Executive,
    label: 'Sales Executive'
  },
  {
    value: EmployeeRoleName.Project_Manager,
    label: 'Project Manager'
  },
  {
    value: EmployeeRoleName.Team_Leader,
    label: 'Team Leader'
  },
  {
    value: EmployeeRoleName.Senior_Software_Engineer,
    label: 'Senior Software Engineer'
  },
  {
    value: EmployeeRoleName.Software_Engineer,
    label: 'Software Engineer'
  },
  {
    value: EmployeeRoleName.Trainee,
    label: 'Trainee'
  }
];

export const ProjectStatus = [
  {
    value: ProjectStatusName.NotStarted,
    label: 'Not Started'
  },
  {
    value: ProjectStatusName.Started,
    label: 'Started'
  },
  {
    value: ProjectStatusName.Pending,
    label: 'Pending'
  },
  {
    value: ProjectStatusName.Completed,
    label: 'Completed'
  }
];

export const BillingType = [
  {
    value: BillingTypeName.Fixed,
    label: 'Fixed Cost'
  },
  {
    value: BillingTypeName.Hourly,
    label: 'Hourly'
  },
  {
    value: BillingTypeName.Monthly,
    label: 'Monthly'
  }
];

export const CurrencyType = [
  {
    value: 'USD',
    label: 'USD'
  },
  {
    value: 'GBP',
    label: 'GBP'
  },
  {
    value: 'EUR',
    label: 'EUR'
  },
  {
    value: 'INR',
    label: 'INR'
  },
  {
    value: 'AUD',
    label: 'AUD'
  }
];

export const Department = [
  {
    value: 'admin',
    label: 'Admin'
  },
  {
    value: 'development',
    label: 'Development'
  },
  {
    value: 'marketing',
    label: 'Marketing'
  },
  {
    value: 'designing',
    label: 'Designing'
  },
  {
    value: 'testing',
    label: 'Testing'
  }
];

export const InvoiceStatus = [
  {
    value: InvoiceStatusName.Generated,
    label: 'Generated'
  },
  {
    value: InvoiceStatusName.PartialCompleted,
    label: 'Partial Completed'
  },
  {
    value: InvoiceStatusName.Completed,
    label: 'Completed'
  }
];

export const InvoicePaymentCycle = [
  {
    value: InvoicePaymentCycleName.Weekly,
    label: 'Weekly'
  },
  {
    value: InvoicePaymentCycleName.BiWeekly,
    label: 'Bi-Weekly'
  },
  {
    value: InvoicePaymentCycleName.Monthly,
    label: 'Monthly'
  }
];

export const PaymentStatus = [
  {
    value: PaymentStatusName.Paid,
    label: 'Paid'
  },
  {
    value: PaymentStatusName.Unpaid,
    label: 'Unpaid'
  },
  {
    value: PaymentStatusName.PartialPaid,
    label: 'Partially Paid'
  }
];

export const CrStatus = [
  {
    value: CrStatusName.NotStarted,
    label: 'Not Started'
  },
  {
    value: CrStatusName.Started,
    label: 'Started'
  },
  {
    value: CrStatusName.Pending,
    label: 'Pending'
  },
  {
    value: CrStatusName.Completed,
    label: 'Completed'
  },
  {
    value: CrStatusName.Cancelled,
    label: 'Cancelled'
  }
];

export const InvoicePaymentCycleDay = [
  {
    value: InvoiceDayName.Monday,
    label: 'Monday'
  },
  {
    value: InvoiceDayName.Tuesday,
    label: 'Tuesday'
  },
  {
    value: InvoiceDayName.Wednesday,
    label: 'Wednesday'
  },
  {
    value: InvoiceDayName.Thursday,
    label: 'Thursday'
  },
  {
    value: InvoiceDayName.Friday,
    label: 'Friday'
  }
];
