import { Wrapper } from './style';

import { Col, Row } from 'antd';

import Meta from 'components/common/Meta';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ContentHeader from 'components/layout/contentHeader';

import { useDashboard } from 'services/hooks/dashboard';

const BreadcrumbsPath = [
  {
    title: 'Dashboard'
  }
];

const Dashboard = () => {
  const { data } = useDashboard();
  return (
    <>
      <Meta title="Building Bridges Application - Dashboard" />
      <Wrapper>
        <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
        <ContentHeader pageTitle="Dashboard" />
        <div className="shadow-paper">
          <Row>
            <Col xs={8} lg={6}>
              <div className="dashboardInfo">
                <span className="number">{data?.usersCount ?? '00'}</span>
                <h2 className="infoTitle">Users</h2>
              </div>
            </Col>
            <Col xs={8} lg={6}>
              <div className="dashboardInfo">
                <span className="number">{data?.clientsCount ?? '00'}</span>
                <h2 className="infoTitle">Clients</h2>
              </div>
            </Col>
            <Col xs={8} lg={6}>
              <div className="dashboardInfo">
                <span className="number">{data?.projectsCount ?? '00'}</span>
                <h2 className="infoTitle">Projects</h2>
              </div>
            </Col>
            <Col xs={8} lg={6}>
              <div className="dashboardInfo">
                <span className="number">{data?.companiesCount ?? '00'}</span>
                <h2 className="infoTitle">Companies</h2>
              </div>
            </Col>
          </Row>
        </div>
      </Wrapper>
    </>
  );
};

export default Dashboard;
