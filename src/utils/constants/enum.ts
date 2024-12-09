export const COMPANY_EMAIL = 'infiazure@gmail.com';

export enum EmployeeStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export enum DesignationName {
  Admin = 'admin',
  ProjectManager = 'project_manager',
  TeamLeader = 'team_leader',
  SalesManager = 'sales_manager',
  Developer = 'developer',
  Intern = 'intern',
  Tester = 'tester'
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
  Employee = 'employee'
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
    value: EmployeeRoleName.Employee,
    label: 'Employee'
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
    value: 'designing',
    label: 'Designing'
  },
  {
    value: 'testing',
    label: 'Testing'
  },
  {
    value: 'marketing',
    label: 'Marketing'
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

export const Designation = [
  {
    value: DesignationName.Admin,
    label: 'Admin'
  },
  {
    value: DesignationName.ProjectManager,
    label: 'Project Manager'
  },
  {
    value: DesignationName.TeamLeader,
    label: 'Team Leader'
  },
  {
    value: DesignationName.SalesManager,
    label: 'Sales Manager'
  },
  {
    value: DesignationName.Developer,
    label: 'Developer'
  },
  {
    value: DesignationName.Intern,
    label: 'Intern'
  },
  {
    value: DesignationName.Tester,
    label: 'Tester'
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
