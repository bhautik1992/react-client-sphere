import { DetailWrapper, InvoiceDetailWrapper } from './style';

import { Col, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { usePaymentDetail } from 'services/hooks/payment';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { BillingType, PaymentMethod, ProjectStatus } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.paymentManagement}>Payment</Link>
  },
  {
    title: 'Payment Detail'
  }
];

const ViewPayment = () => {
  const { id } = useParams();
  const { data: paymentData } = usePaymentDetail(Number(id));

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Payment Detail</h2>
        </div>
        <DetailWrapper>
          <Divider orientation="left">Payment Information</Divider>
          <Row className="paymentRow">
            <Col xs={4}>
              <h4>Payment Number</h4>
              <p>{paymentData?.paymentNumber ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Payment Date</h4>
              <p>
                {paymentData?.paymentDate
                  ? dayjs(paymentData?.paymentDate).format(DATE_FORMAT)
                  : '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Payment Method</h4>
              <p>
                {PaymentMethod.find((item) => item.value === paymentData?.paymentMethod)?.label ??
                  '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Conversion Rate</h4>
              <p>{paymentData?.conversionRate ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Comment</h4>
              <p>{paymentData?.comment ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Company Details</Divider>
          <Row className="paymentRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{paymentData?.company?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Email</h4>
              <p>{paymentData?.company?.email ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Country</h4>
              <p>{paymentData?.company?.countryName ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Project Details</Divider>
          <Row className="paymentRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{paymentData?.project?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Start Date</h4>
              <p>
                {paymentData?.project?.startDate
                  ? dayjs(paymentData?.project?.startDate).format(DATE_FORMAT)
                  : '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Status</h4>
              <p>
                {ProjectStatus.find((item) => item.value == paymentData?.project?.status)?.label ??
                  '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Project Manager</h4>
              <p>
                {paymentData?.project?.projectManager?.firstName ?? '-'}{' '}
                {paymentData?.project?.projectManager?.lastName ?? '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Team Leader</h4>
              <p>
                {paymentData?.project?.teamLeader?.firstName ?? '-'}{' '}
                {paymentData?.project?.teamLeader?.lastName ?? '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Is Internal Project?</h4>
              <p>{paymentData?.project.isInternalProject ? 'Yes' : 'No'}</p>
            </Col>
          </Row>
          <Row className="paymentRow">
            <Col xs={4}>
              <h4>Hourly Rate</h4>
              <p>{paymentData?.project?.hourlyMonthlyRate ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Project Hours</h4>
              <p>{paymentData?.project?.projectHours ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Total Cost</h4>
              <p>{paymentData?.project?.projectCost ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Billing Type</h4>
              <p>
                {BillingType.find((item) => item.value == paymentData?.project?.billingType)
                  ?.label ?? '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Currency</h4>
              <p>{paymentData?.project?.currency ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Payment Term Days</h4>
              <p>{paymentData?.project?.paymentTermDays ?? '-'}</p>
            </Col>
          </Row>
          {paymentData?.invoices && paymentData.invoices.length > 0 && (
            <>
              <Divider orientation="left">Invoice Details</Divider>
              {paymentData.invoices.map((invoice) => (
                <InvoiceDetailWrapper key={invoice?.id}>
                  <Row className="paymentRow">
                    <Col xs={4}>
                      <h4>Invoice No.</h4>
                      <p>{invoice.invoiceNumber}</p>
                    </Col>
                    <Col xs={4}>
                      <h4>Invoice Date</h4>
                      <p>
                        {invoice.invoiceDate ? dayjs(invoice.invoiceDate).format(DATE_FORMAT) : '-'}
                      </p>
                    </Col>
                    <Col xs={4}>
                      <h4>Invoice Amount</h4>
                      <p>{invoice.amount ?? '-'}</p>
                    </Col>
                    <Col xs={4}></Col>
                    <Col xs={4}></Col>
                    <Col xs={4}></Col>
                  </Row>
                  <Divider></Divider>
                </InvoiceDetailWrapper>
              ))}
            </>
          )}
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewPayment;
