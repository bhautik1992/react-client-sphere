import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Client from 'components/svg/Client';
import Dashboard from 'components/svg/Dashboard';
import ResourcesManagement from 'components/svg/ResourcesManagement';
import TrainingPrograms from 'components/svg/TrainingPrograms';

import { ROUTES } from 'utils/constants/routes';
import { toAbsoluteUrl } from 'utils/functions';

import { StyledLayout } from '../Layout.Styled';

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
  createMenuItem(ROUTES.dashboard, 'Dashboard', '1', <Dashboard />),
  createMenuItem(ROUTES.clientManagement, 'Client Management', '3', <Client />),
  createMenuItem(ROUTES.trainingMangement, 'Training Programs', '5', <TrainingPrograms />),
  createMenuItem(ROUTES.resourcesMangement, 'Resource Management', '6', <ResourcesManagement />)
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
  const [collapsed, setCollapsed] = useState(true);

  const activeTab = useMemo(() => {
    const activeLinkKey = compareLinkAndReturnKey(items, location?.pathname);
    if (activeLinkKey) {
      return [activeLinkKey];
    } else {
      return [items?.find((item) => item?.link?.split('/')[1].includes(location?.pathname))];
    }
  }, [location.pathname]);

  return (
    <StyledLayout.Sider
      collapsible
      breakpoint="lg"
      collapsed={collapsed}
      width={'260px'}
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
        items={items}
      />
    </StyledLayout.Sider>
  );
};

export default Sidebar;
