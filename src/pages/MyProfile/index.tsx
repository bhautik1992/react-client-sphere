import { Wrapper } from './style';

import { Button, Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useProfileDetail } from 'services/hooks/profile';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { Department, EmployeeRole } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'My Profile'
  }
];

const MyProfile = () => {
  const navigate = useNavigate();
  const { data } = useProfileDetail();

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">My Profile</h2>
          <Button type="primary" onClick={() => navigate(ROUTES.editMyProfile)}>
            Edit Profile
          </Button>
        </div>
        <Row gutter={[16, 30]} className="profileDetail">
          <Col xs={24}>
            <Row gutter={[16, 40]} className="detailRow">
              <Col xs={8}>
                <h4>Employee Code</h4>
                <p>{data?.employeeCode ?? '-'}</p>
              </Col>
              <Col xs={8}>
                <h4>First Name</h4>
                <p>{data?.firstName ?? '-'}</p>
              </Col>
              <Col xs={8}>
                <h4>Last Name</h4>
                <p>{data?.lastName ?? '-'}</p>
              </Col>
            </Row>
            <Row gutter={[16, 40]} className="detailRow">
              <Col xs={8}>
                <h4>Role</h4>
                <p>{EmployeeRole.find((role) => role.value === data?.role)?.label ?? '-'}</p>
              </Col>
              <Col xs={8}>
                <h4>Personal Email</h4>
                <p>{data?.personalEmail ?? '-'}</p>
              </Col>
              <Col xs={8}>
                <h4>Company Email</h4>
                <p>{data?.companyEmail ?? '-'}</p>
              </Col>
            </Row>
            <Row gutter={[16, 40]} className="detailRow">
              <Col xs={8}>
                <h4>Phone</h4>
                <p>{data?.phone ?? '-'}</p>
              </Col>
              <Col xs={8}>
                <h4>Department</h4>
                <p>{Department.find((dep) => dep.value === data?.department)?.label ?? '-'}</p>
              </Col>
              <Col xs={8}></Col>
            </Row>
            <Row gutter={[16, 40]} className="detailRow">
              <Col xs={8}>
                <h4>Date of Birth</h4>
                <p>{data?.dateOfBirth ? dayjs(data?.dateOfBirth).format(DATE_FORMAT) : '-'}</p>
              </Col>
              <Col xs={8}>
                <h4>Joining Date</h4>
                <p>{data?.joiningDate ? dayjs(data?.joiningDate).format(DATE_FORMAT) : '-'}</p>
              </Col>
              <Col xs={8}></Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Wrapper>
  );
};

export default MyProfile;
