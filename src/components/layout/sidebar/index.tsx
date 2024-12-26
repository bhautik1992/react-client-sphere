import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Client from 'components/svg/Client';
import CompanyManagement from 'components/svg/CompanyManagement';
import Dashboard from 'components/svg/Dashboard';
import EmployeeManagement from 'components/svg/EmployeeManagement';
import ProjectManagement from 'components/svg/ProjectManagement';
import Invoice from 'components/svg/invoice';
import Payment from 'components/svg/payment';

import { authStore } from 'services/store/auth';

import { EmployeeRoleName, MenuPermissions } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import { toAbsoluteUrl } from 'utils/functions';

import { StyledLayout } from '../Layout.Styled';

const menuAccessByRole = {
  [EmployeeRoleName.Admin]: [
    MenuPermissions.DASHBOARD,
    MenuPermissions.EMPLOYEES,
    MenuPermissions.CLIENTS,
    MenuPermissions.PROJECTS,
    MenuPermissions.PROJECT_CRS,
    MenuPermissions.INVOICES,
    MenuPermissions.COMPANIES,
    MenuPermissions.PAYMENT
  ],
  [EmployeeRoleName.Sales_Manager]: [
    MenuPermissions.DASHBOARD,
    MenuPermissions.EMPLOYEES,
    MenuPermissions.CLIENTS,
    MenuPermissions.PROJECTS,
    MenuPermissions.PROJECT_CRS,
    MenuPermissions.INVOICES
  ],
  [EmployeeRoleName.Sales_Executive]: [
    MenuPermissions.DASHBOARD,
    MenuPermissions.EMPLOYEES,
    MenuPermissions.CLIENTS,
    MenuPermissions.PROJECTS,
    MenuPermissions.PROJECT_CRS,
    MenuPermissions.INVOICES
  ],
  [EmployeeRoleName.Project_Manager]: [
    MenuPermissions.DASHBOARD,
    MenuPermissions.EMPLOYEES,
    MenuPermissions.PROJECTS,
    MenuPermissions.PROJECT_CRS
  ],
  [EmployeeRoleName.Team_Leader]: [MenuPermissions.DASHBOARD],
  [EmployeeRoleName.Senior_Software_Engineer]: [MenuPermissions.DASHBOARD],
  [EmployeeRoleName.Software_Engineer]: [MenuPermissions.DASHBOARD],
  [EmployeeRoleName.Trainee]: [MenuPermissions.DASHBOARD]
};

function createMenuItem(
  link?: string,
  label?: string,
  key?: any,
  icon?: any,
  children?: any,
  type?: any
) {
  return {
    link,
    key,
    icon,
    children,
    label,
    type
  };
}

const items = [
  createMenuItem(ROUTES.dashboard, 'Dashboard', MenuPermissions.DASHBOARD, <Dashboard />),
  createMenuItem(
    ROUTES.employeeManagement,
    'Employees',
    MenuPermissions.EMPLOYEES,
    <EmployeeManagement />
  ),
  createMenuItem(ROUTES.clientManagement, 'Clients', MenuPermissions.CLIENTS, <Client />),
  createMenuItem(
    ROUTES.companyManagement,
    'Vendors',
    MenuPermissions.COMPANIES,
    <CompanyManagement />
  ),
  createMenuItem(
    ROUTES.projectManagement,
    'Projects',
    MenuPermissions.PROJECTS,
    <ProjectManagement />
  ),
  createMenuItem(
    ROUTES.crManagement,
    'Project CRs',
    MenuPermissions.PROJECT_CRS,
    <ProjectManagement />
  ),
  createMenuItem(ROUTES.invoiceManagement, 'Invoices', MenuPermissions.INVOICES, <Invoice />),
  createMenuItem(ROUTES.paymentManagement, 'Payments', MenuPermissions.PAYMENT, <Payment />)
];

function compareLinkAndReturnKey(items: any, currentPath: any): any {
  let activeLinkKey;
  for (const item of items) {
    if (item?.children && Array.isArray(item?.children) && item.children.length > 0) {
      activeLinkKey = compareLinkAndReturnKey(item.children, currentPath);
    } else if (currentPath.includes(item?.link)) {
      activeLinkKey = item.key;
      break;
    } else {
      continue;
    }
  }
  return activeLinkKey;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const { employeeData } = authStore.getState();
  const employeeRole = employeeData?.role || EmployeeRoleName.Trainee;

  const allowedKeys = menuAccessByRole[employeeRole as EmployeeRoleName] || [];
  const filteredItems = items.filter((item) => allowedKeys.includes(item.key));

  const activeTab = useMemo(() => {
    const activeLinkKey = compareLinkAndReturnKey(filteredItems, location?.pathname);
    return activeLinkKey ? [activeLinkKey] : [];
  }, [location.pathname, filteredItems]);

  return (
    <StyledLayout.Sider
      collapsible
      breakpoint="lg"
      collapsed={collapsed}
      width={'230px'}
      collapsedWidth={60}
      onCollapse={(collapsed) => {
        setCollapsed(collapsed);
      }}
      trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    >
      <div className="logoWrapper">
        {collapsed ? (
          <img className="logoSm" alt="Logo" src={toAbsoluteUrl('/icons/Logo_Small.svg')} />
        ) : (
          <img className="logoLg" alt="Logo" src={toAbsoluteUrl('/icons/Logo.svg')} />
        )}
      </div>
      <Menu
        className="sidebarMenu"
        defaultSelectedKeys={activeTab}
        mode="inline"
        onClick={({ item }: any) => navigate(item.props.link)}
        items={filteredItems}
      />
    </StyledLayout.Sider>
  );
};

export default Sidebar;
