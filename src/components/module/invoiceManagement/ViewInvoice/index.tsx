import { CRDetailWrapper, DetailWrapper } from './style';

import { Col, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useInvoiceDetail } from 'services/hooks/invoice';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { BillingType, EmployeeStatus, ProjectStatus } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.invoiceManagement}>Invoice</Link>
  },
  {
    title: 'Invoice Detail'
  }
];

const ViewInvoice = () => {
  const { id } = useParams();
  const { data: invoiceData } = useInvoiceDetail(Number(id));

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Invoice Detail</h2>
        </div>
        <DetailWrapper>
          <Divider orientation="left">Invoice Information</Divider>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Invoice Number</h4>
              <p>{invoiceData?.invoiceNumber ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Custom Invoice Number</h4>
              <p>{invoiceData?.customInvoiceNumber ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Invoice Date</h4>
              <p>
                {invoiceData?.invoiceDate
                  ? dayjs(invoiceData?.invoiceDate).format(DATE_FORMAT)
                  : '-'}
              </p>
            </Col>
          </Row>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Due Date</h4>
              <p>{invoiceData?.dueDate ? dayjs(invoiceData?.dueDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Amount</h4>
              <p>{invoiceData?.amount ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Addition charges Desc.</h4>
              <p>{invoiceData?.additionalChargeDesc ?? '-'}</p>
            </Col>
          </Row>
          <Divider orientation="left">Client Details</Divider>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>First Name</h4>
              <p>{invoiceData?.client?.firstName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Last Name</h4>
              <p>{invoiceData?.client?.lastName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email</h4>
              <p>{invoiceData?.client?.email}</p>
            </Col>
          </Row>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Address</h4>
              <p>{invoiceData?.client?.address ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Phone</h4>
              <p>{invoiceData?.client?.phone ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Status</h4>
              <p>{invoiceData?.client?.status === EmployeeStatus.Active ? 'Active' : 'Inactive'}</p>
            </Col>
          </Row>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Client Company</h4>
              <p>{invoiceData?.client?.clientCompanyName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Account Manager</h4>
              <p>{invoiceData?.client?.accountManager ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Skype Id</h4>
              <p>{invoiceData?.client?.skypeId ?? '-'}</p>
            </Col>
          </Row>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Country</h4>
              <p>{invoiceData?.client?.countryName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>State</h4>
              <p>{invoiceData?.client?.stateName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>City</h4>
              <p>{invoiceData?.client?.cityName ?? '-'}</p>
            </Col>
          </Row>
          <Divider orientation="left">Company Details</Divider>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Name</h4>
              <p>{invoiceData?.company?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email</h4>
              <p>{invoiceData?.company?.email ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Country</h4>
              <p>{invoiceData?.company?.countryName ?? '-'}</p>
            </Col>
          </Row>
          <Divider orientation="left">Project Details</Divider>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Name</h4>
              <p>{invoiceData?.project?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Start Date</h4>
              <p>
                {invoiceData?.project?.startDate
                  ? dayjs(invoiceData?.project?.startDate).format(DATE_FORMAT)
                  : '-'}
              </p>
            </Col>
            <Col xs={6}>
              <h4>Status</h4>
              <p>
                {ProjectStatus.find((item) => item.value == invoiceData?.project?.status)?.label ??
                  '-'}
              </p>
            </Col>
          </Row>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Project Manager</h4>
              <p>
                {invoiceData?.project?.projectManager?.firstName ?? '-'}{' '}
                {invoiceData?.project?.projectManager?.lastName ?? '-'}
              </p>
            </Col>
            <Col xs={6}>
              <h4>Team Leader</h4>
              <p>
                {invoiceData?.project?.teamLeader?.firstName ?? '-'}{' '}
                {invoiceData?.project?.teamLeader?.lastName ?? '-'}
              </p>
            </Col>
            <Col xs={6}>
              <h4>Is Internal Project?</h4>
              <p>{invoiceData?.project.isInternalProject ? 'Yes' : 'No'}</p>
            </Col>
          </Row>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Hourly Rate</h4>
              <p>{invoiceData?.project?.hourlyMonthlyRate ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Project Hours</h4>
              <p>{invoiceData?.project?.projectHours ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Total Cost</h4>
              <p>{invoiceData?.project?.projectCost ?? '-'}</p>
            </Col>
          </Row>
          <Row className="invoiceRow">
            <Col xs={6}>
              <h4>Billing Type</h4>
              <p>
                {BillingType.find((item) => item.value == invoiceData?.project?.billingType)
                  ?.label ?? '-'}
              </p>
            </Col>
            <Col xs={6}>
              <h4>Currency</h4>
              <p>{invoiceData?.project?.currency ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Payment Term Days</h4>
              <p>{invoiceData?.project?.paymentTermDays ?? '-'}</p>
            </Col>
          </Row>
          {invoiceData?.crs && invoiceData.crs.length > 0 && (
            <>
              <Divider orientation="left">CR Details</Divider>
              {invoiceData.crs.map((cr) => (
                <CRDetailWrapper key={cr?.id}>
                  <Row className="invoiceRow">
                    <Col xs={6}>
                      <h4>CR Name</h4>
                      <p>{cr.name}</p>
                    </Col>
                    <Col xs={6}>
                      <h4>Start Date</h4>
                      <p>{cr.startDate ? dayjs(cr.startDate).format(DATE_FORMAT) : '-'}</p>
                    </Col>
                    <Col xs={6}>
                      <h4>Is Internal CR</h4>
                      <p>{cr.isInternalCr ? 'Yes' : 'No'}</p>
                    </Col>
                  </Row>
                  <Row className="invoiceRow">
                    <Col xs={6}>
                      <h4>CR Hours</h4>
                      <p>{cr.crHours}</p>
                    </Col>
                    <Col xs={6}>
                      <h4>Hourly Rate</h4>
                      <p>{cr.hourlyMonthlyRate ?? '-'}</p>
                    </Col>
                    <Col xs={6}>
                      <h4>CR Cost</h4>
                      <p>{cr.crCost ?? '-'}</p>
                    </Col>
                  </Row>
                  <Divider></Divider>
                </CRDetailWrapper>
              ))}
            </>
          )}
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewInvoice;
