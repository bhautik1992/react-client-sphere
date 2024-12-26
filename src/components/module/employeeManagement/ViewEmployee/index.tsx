import { DetailWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Col, Divider, Row, message } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IEmployee, IEmployeeReq } from 'services/api/employee/types';
import { useEmployeeDetail, useEmployeeStatus } from 'services/hooks/employee';
import { employeeKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { Department, EmployeeRole, EmployeeStatus, EmployeeStatusName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import EmployeeStatusDropdown from 'utils/renderDropDownStatus/employeeStatusDropdown';

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
  const queryClient = useQueryClient();
  const { data } = useEmployeeDetail(Number(id));
  const { mutate } = useEmployeeStatus();

  const handleConfirm = (newStatus: string, id: number) => {
    const data = {
      status: newStatus,
      id: id
    };

    mutate(data, {
      onSuccess: (res) => {
        // invalidate project list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [employeeKeys.employeeList({} as IEmployeeReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set status in project detail
        queryClient.setQueryData<IEmployee>(employeeKeys.employeeDetail(Number(id)), () => {
          return { ...res } as unknown as IEmployee;
        });
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">View Employee</h2>
          <EmployeeStatusDropdown
            status={data?.status ?? EmployeeStatusName.Resigned}
            employeeId={data?.id ?? 0}
            onStatusChange={(newStatus, employeeId) => handleConfirm(newStatus, employeeId)}
          />
        </div>
        <DetailWrapper>
          <Divider orientation="left">Personal Details</Divider>
          <Row className="employeeRow">
            <Col xs={4}>
              <h4>First Name</h4>
              <p>{data?.firstName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Middle Name</h4>
              <p>{data?.middleName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Last Name</h4>
              <p>{data?.lastName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Employee Code</h4>
              <p>{data?.employeeCode ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Personal Email</h4>
              <p>{data?.personalEmail ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Company Email</h4>
              <p>{data?.companyEmail ?? '-'}</p>
            </Col>
          </Row>
          <Row className="employeeRow">
            <Col xs={4}>
              <h4>Role</h4>
              <p>{EmployeeRole.find((role) => role.value === data?.role)?.label ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Reporting Person</h4>
              <p>
                {data?.reportingPerson?.firstName ?? '-'} {data?.reportingPerson?.lastName ?? '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Phone</h4>
              <p>{data?.phone ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Department</h4>
              <p>{Department.find((role) => role.value === data?.department)?.label ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Joining Date</h4>
              <p>{data?.joiningDate ? dayjs(data?.joiningDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Date of Birth</h4>
              <p>{data?.dateOfBirth ? dayjs(data?.dateOfBirth).format(DATE_FORMAT) : '-'}</p>
            </Col>
          </Row>
          <Row className="employeeRow">
            <Col xs={4}>
              <h4>Address</h4>
              <p>{data?.address ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Status</h4>
              <p>{EmployeeStatus.find((status) => status.value === data?.status)?.label ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>PAN Number</h4>
              <p>{data?.PAN ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Aadhar Number</h4>
              <p>{data?.aadhar ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Emergency Contact Name</h4>
              <p>{data?.emergencyContactName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Emergency Contact Number</h4>
              <p>{data?.emergencyContactNumber ?? '-'}</p>
            </Col>
          </Row>
          <Divider orientation="left">Bank Details</Divider>
          <Row className="employeeRow">
            <Col xs={4}>
              <h4>Bank Name</h4>
              <p>{data?.bankName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Account Number</h4>
              <p>{data?.accountNumber ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>IFSC Code</h4>
              <p>{data?.IFSC ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewEmployee;
