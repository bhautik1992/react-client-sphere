import { DetailWrapper } from './style';

import { Col, Row } from 'antd';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useUserDetail } from 'services/hooks/user';

import { RoleData } from 'utils/constants/role';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.usersManagement}>Users</Link>
  },
  {
    title: 'View User'
  }
];

const ViewUser = () => {
  const { id } = useParams();

  const { data } = useUserDetail(Number(id));
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">View User</h2>
        </div>
        <DetailWrapper>
          <Row className="userRow">
            <Col xs={6}>
              <h4>First Name</h4>
              <p>{data?.first_name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Last Name</h4>
              <p>{data?.last_name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email</h4>
              <p>{data?.email ?? '-'}</p>
            </Col>
          </Row>
          <Row className="userRow">
            <Col xs={6}>
              <h4>Role</h4>
              <p>{RoleData.find((role) => role.value === data?.role)?.label ?? '-'}</p>
            </Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewUser;
