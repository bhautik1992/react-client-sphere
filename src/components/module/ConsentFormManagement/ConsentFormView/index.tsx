import { DetailWrapper } from './style';

import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useConsentFormDetail } from 'services/hooks/consentForm';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.consentForm}>Content Form</Link>
  },
  {
    title: 'Content Form Detail'
  }
];

const ContentFormView = () => {
  const { id } = useParams();

  const { data } = useConsentFormDetail(id ?? '');

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Consent Form Detail</h2>
        </div>
        <DetailWrapper>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Children name</h4>
              <p>{data?.childName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Children age</h4>
              <p>{data?.age ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Children dob</h4>
              <p>{data?.dob ? dayjs(data?.dob).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}></Col>
          </Row>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Parent name</h4>
              <p>{data?.parentName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Relation to children</h4>
              <p>{data?.relationToChild ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email address</h4>
              <p>{data?.email ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Phone number</h4>
              <p>{data?.phoneNumber ?? '-'}</p>
            </Col>
          </Row>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Parent signature</h4>
              <p>{data?.parentSignature ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Parent signature date</h4>
              <p>{data?.parentSignDate ? dayjs(data?.parentSignDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}></Col>
            <Col xs={6}></Col>
          </Row>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Verify by</h4>
              <p>{data?.verifiedBy ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Verify date</h4>
              <p>{data?.verifyDate ? dayjs(data?.verifyDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}></Col>
            <Col xs={6}></Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ContentFormView;
