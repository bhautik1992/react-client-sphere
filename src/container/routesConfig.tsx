import { EmployeeRoleName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const pageNotFoundRoute = [
  {
    path: ROUTES.pageNotFound,
    component: () => import('../pages/PageNotFound')
  }
];

const changePasswordRoute = [
  {
    path: ROUTES.changePassword,
    component: () => import('../pages/Auth/ChangePassword')
  }
];

const dashboardRoutes = [
  {
    path: '/dashboard',
    component: () => import('../pages/Dashboard'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager,
      EmployeeRoleName.Project_Manager,
      EmployeeRoleName.Team_Leader,
      EmployeeRoleName.Software_Engineer,
      EmployeeRoleName.Senior_Software_Engineer,
      EmployeeRoleName.Trainee
    ]
  }
];

const myProfileRoute = [
  {
    path: '/my-profile',
    component: () => import('../pages/MyProfile'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager,
      EmployeeRoleName.Project_Manager,
      EmployeeRoleName.Team_Leader,
      EmployeeRoleName.Software_Engineer,
      EmployeeRoleName.Senior_Software_Engineer,
      EmployeeRoleName.Trainee
    ]
  }
];

const editMyProfile = [
  {
    path: '/edit-my-profile',
    component: () => import('../pages/MyProfile'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager,
      EmployeeRoleName.Project_Manager,
      EmployeeRoleName.Team_Leader,
      EmployeeRoleName.Software_Engineer,
      EmployeeRoleName.Senior_Software_Engineer,
      EmployeeRoleName.Trainee
    ]
  }
];

const employeeRoute = [
  {
    path: ROUTES.employeeManagement,
    component: () => import('../pages/EmployeeManagement'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager,
      EmployeeRoleName.Project_Manager
    ],
    children: [
      {
        path: `${ROUTES.employeeView}/:id`,
        component: () => import('../components/module/employeeManagement/ViewEmployee'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager,
          EmployeeRoleName.Project_Manager
        ]
      },
      {
        path: `${ROUTES.employeeAdd}`,
        component: () => import('../components/module/employeeManagement/AddEditEmployee'),
        roles: [EmployeeRoleName.Admin, EmployeeRoleName.Project_Manager]
      },
      {
        path: `${ROUTES.employeeEdit}/:id`,
        component: () => import('../components/module/employeeManagement/AddEditEmployee'),
        roles: [EmployeeRoleName.Admin, EmployeeRoleName.Project_Manager]
      }
    ]
  }
];

const companyRoute = [
  {
    path: ROUTES.companyManagement,
    component: () => import('../pages/CompanyManagement'),
    roles: [EmployeeRoleName.Admin],
    children: [
      {
        path: `${ROUTES.companyView}/:id`,
        component: () => import('../components/module/companyManagement/ViewCompany'),
        roles: [EmployeeRoleName.Admin]
      }
    ]
  }
];

const clientRoute = [
  {
    path: ROUTES.clientManagement,
    component: () => import('../pages/ClientManagement'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager
    ],
    children: [
      {
        path: `${ROUTES.clientView}/:id`,
        component: () => import('../components/module/clientManagement/ViewClient'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      },
      {
        path: `${ROUTES.clientAdd}`,
        component: () => import('../components/module/clientManagement/AddEditClient'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      },
      {
        path: `${ROUTES.clientEdit}/:id`,
        component: () => import('../components/module/clientManagement/AddEditClient'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      }
    ]
  }
];

const vendorRoute = [
  {
    path: ROUTES.vendorManagement,
    component: () => import('../pages/VendorManagement'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager
    ],
    children: [
      {
        path: `${ROUTES.vendorView}/:id`,
        component: () => import('../components/module/vendorManagement/ViewVendor'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      },
      {
        path: `${ROUTES.vendorAdd}`,
        component: () => import('../components/module/vendorManagement/AddEditVendor'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      },
      {
        path: `${ROUTES.vendorEdit}/:id`,
        component: () => import('../components/module/vendorManagement/AddEditVendor'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      }
    ]
  }
];

const projectRoute = [
  {
    path: ROUTES.projectManagement,
    component: () => import('../pages/ProjectManagement'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager,
      EmployeeRoleName.Project_Manager
    ],
    children: [
      {
        path: `${ROUTES.projectView}/:id`,
        component: () => import('../components/module/projectManagement/ViewProject'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager,
          EmployeeRoleName.Project_Manager
        ]
      },
      {
        path: `${ROUTES.projectAdd}`,
        component: () => import('../components/module/projectManagement/AddEditProject'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      },
      {
        path: `${ROUTES.projectEdit}/:id`,
        component: () => import('../components/module/projectManagement/AddEditProject'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      }
    ]
  }
];

const projectCrRoute = [
  {
    path: ROUTES.crManagement,
    component: () => import('../pages/CrManagement'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager,
      EmployeeRoleName.Project_Manager
    ],
    children: [
      {
        path: `${ROUTES.crView}/:id`,
        component: () => import('../components/module/crManagement/ViewCr'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager,
          EmployeeRoleName.Project_Manager
        ]
      },
      {
        path: `${ROUTES.crAdd}`,
        component: () => import('../components/module/crManagement/AddEditCr'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      },
      {
        path: `${ROUTES.crEdit}/:id`,
        component: () => import('../components/module/crManagement/AddEditCr'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      }
    ]
  }
];

const invoiceRoute = [
  {
    path: ROUTES.invoiceManagement,
    component: () => import('../pages/InvoiceManagement'),
    roles: [
      EmployeeRoleName.Admin,
      EmployeeRoleName.Sales_Executive,
      EmployeeRoleName.Sales_Manager
    ],
    children: [
      {
        path: `${ROUTES.invoiceView}/:id`,
        component: () => import('../components/module/invoiceManagement/ViewInvoice'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      },
      {
        path: `${ROUTES.invoiceAdd}`,
        component: () => import('../components/module/invoiceManagement/AddEditInvoice'),
        roles: [
          EmployeeRoleName.Admin,
          EmployeeRoleName.Sales_Executive,
          EmployeeRoleName.Sales_Manager
        ]
      }
    ]
  }
];

const paymentRoute = [
  {
    path: ROUTES.paymentManagement,
    component: () => import('../pages/PaymentManagement'),
    roles: [EmployeeRoleName.Admin],
    children: [
      {
        path: `${ROUTES.paymentView}/:id`,
        component: () => import('../components/module/paymentManagement/ViewPayment'),
        roles: [EmployeeRoleName.Admin]
      },
      {
        path: `${ROUTES.paymentAdd}`,
        component: () => import('../components/module/paymentManagement/AddEditPayment'),
        roles: [EmployeeRoleName.Admin]
      }
    ]
  }
];

const routesConfig = [
  ...pageNotFoundRoute,
  ...changePasswordRoute,
  ...dashboardRoutes,
  ...myProfileRoute,
  ...editMyProfile,
  ...employeeRoute,
  ...companyRoute,
  ...clientRoute,
  ...vendorRoute,
  ...projectRoute,
  ...projectCrRoute,
  ...invoiceRoute,
  ...paymentRoute
];

export default routesConfig;
