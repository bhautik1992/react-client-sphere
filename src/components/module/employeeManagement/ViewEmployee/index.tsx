import { DetailWrapper } from './style';

import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useEmployeeDetail } from 'services/hooks/employee';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { Department, EmployeeRole } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.employeeManagement}>Employees</Link>
  },
  {
    title: 'View Employee'
  }
];

const ViewEmployee = () => {
  const { id } = useParams();

  const { data } = useEmployeeDetail(Number(id));
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">View Employee</h2>
        </div>
        <DetailWrapper>
          <Row className="employeeRow">
            <Col xs={6}>
              <h4>Employee Code</h4>
              <p>{data?.employeeCode ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>First Name</h4>
              <p>{data?.firstName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Last Name</h4>
              <p>{data?.lastName ?? '-'}</p>
            </Col>
          </Row>
          <Row className="employeeRow">
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
              <p>{EmployeeRole.find((role) => role.value === data?.role)?.label ?? '-'}</p>
            </Col>
          </Row>
          <Row className="employeeRow">
            <Col xs={6}>
              <h4>Department</h4>
              <p>{Department.find((role) => role.value === data?.department)?.label ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Reporting Person</h4>
              <p>
                {data?.reportingPerson?.firstName ?? '-'} {data?.reportingPerson?.lastName ?? '-'}
              </p>
            </Col>
            <Col xs={6}></Col>
          </Row>
          <Row className="employeeRow">
            <Col xs={6}>
              <h4>Phone</h4>
              <p>{data?.phone ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Date of Birth</h4>
              <p>{data?.dateOfBirth ? dayjs(data?.dateOfBirth).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Joining Date</h4>
              <p>{data?.joiningDate ? dayjs(data?.joiningDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewEmployee;
