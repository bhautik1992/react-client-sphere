import { DetailWrapper } from './style';

import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useUserDetail } from 'services/hooks/user';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { UserRole } from 'utils/constants/enum';
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
              <p>{data?.firstName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Last Name</h4>
              <p>{data?.lastName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Phone</h4>
              <p>{data?.phone ?? '-'}</p>
            </Col>
          </Row>
          <Row className="userRow">
            <Col xs={6}>
              <h4>Personal Email</h4>
              <p>{data?.personalEmail ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Company Email</h4>
              <p>{data?.companyEmail ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Role</h4>
              <p>{UserRole.find((role) => role.value === data?.role)?.label ?? '-'}</p>
            </Col>
          </Row>
          <Row className="userRow">
            <Col xs={6}>
              <h4>Department</h4>
              <p>{data?.department ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Designation</h4>
              <p>{data?.designation ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Reporting Person</h4>
              <p>{data?.reportingPerson ?? '-'}</p>
            </Col>
          </Row>
          <Row className="userRow">
            <Col xs={6}>
              <h4>Date of Birth</h4>
              <p>{data?.dateOfBirth ? dayjs(data?.dateOfBirth).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Joining Date</h4>
              <p>{data?.joiningDate ? dayjs(data?.joiningDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>User Code</h4>
              <p>{data?.userCode ?? '-'}</p>
            </Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewUser;
