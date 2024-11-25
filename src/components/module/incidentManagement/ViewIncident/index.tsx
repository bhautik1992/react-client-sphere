import { DetailWrapper } from './style';

import { Col, Image, Row } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useIncidentDetail } from 'services/hooks/incident';

import { FULL_DATE_TIME } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

import CommentList from '../CommentList';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.incidentManagement}>Incident</Link>
  },
  {
    title: 'Incident Report Detail'
  }
];

const ViewIncident = () => {
  const { id } = useParams();

  const { data: incidentDetail } = useIncidentDetail(id ?? '');
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Incident Report Detail</h2>
        </div>
        <DetailWrapper>
          <h3>Incident Details</h3>
          <Row className="incidentRow">
            <Col xs={5}>
              <h4>Incident Happened With</h4>
              <p>
                {incidentDetail?.harmed
                  ? incidentDetail?.harmed
                  : `${incidentDetail?.userId?.firstName}  ${incidentDetail?.userId?.lastName}`}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Incident Type</h4>
              <p>{incidentDetail?.type ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Incident Title</h4>
              <p>{incidentDetail?.title ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Incident Location</h4>
              <p>{incidentDetail?.place ?? '-'}</p>
            </Col>
            <Col xs={3}>
              <h4>Status</h4>
              <p style={{ color: renderTagColor(incidentDetail?.status ?? '') }}>
                {incidentDetail?.status}
              </p>
            </Col>
          </Row>
          <Row className="incidentRow">
            <Col>
              <h4>Date</h4>
              <p>
                {incidentDetail?.incidentDateTime
                  ? dayjs(incidentDetail?.incidentDateTime).format(FULL_DATE_TIME)
                  : '-'}
              </p>
            </Col>
          </Row>
          <Row className="incidentRow">
            <Col xs={18}>
              <h4>Incident Details</h4>
              <p>{incidentDetail?.descriptionText ?? '-'}</p>
            </Col>
          </Row>
          {incidentDetail?.descriptionAudioFileUrl?.signedUrl && (
            <Row className="incidentRow">
              <Col>
                <h4>Attachment</h4>
                <audio controls>
                  <source src={incidentDetail?.descriptionAudioFileUrl?.signedUrl} />
                </audio>
              </Col>
            </Row>
          )}
          {(incidentDetail?.evidence ?? []).length > 0 && (
            <Row className="incidentRow">
              <Col>
                <h4>Evidences</h4>
                <Image.PreviewGroup>
                  {incidentDetail?.evidence?.map((data) => (
                    <Image key={data?.url} width={100} src={data?.signedUrl} />
                  ))}
                </Image.PreviewGroup>
              </Col>
            </Row>
          )}
        </DetailWrapper>
        <DetailWrapper className="userDetail">
          <h3>Subscriber Details</h3>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Subscriber</h4>
              <p>{`${incidentDetail?.userId?.firstName} ${incidentDetail?.userId?.lastName}`}</p>
            </Col>
            <Col xs={6}>
              <h4>Incident Happen With</h4>
              <p>
                {incidentDetail?.harmed && incidentDetail?.harmed?.length > 0
                  ? incidentDetail?.harmed
                  : '-'}
              </p>
            </Col>
            <Col xs={6}>
              <h4>Phone Number</h4>
              <p>
                {incidentDetail?.userId?.phoneNumber &&
                incidentDetail?.userId?.phoneNumber?.length > 0
                  ? incidentDetail?.userId?.phoneNumber
                  : '-'}
              </p>
            </Col>
            <Col xs={6}>
              <h4>Email Address</h4>
              <p>{incidentDetail?.userId?.email ?? '-'}</p>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <h4>Address</h4>
              <p>
                {incidentDetail?.userId?.address && incidentDetail?.userId?.address?.length > 0
                  ? incidentDetail?.userId?.address
                  : '-'}
              </p>
            </Col>
          </Row>
        </DetailWrapper>
        <DetailWrapper className="userDetail">
          <h3>Responder details</h3>
          {incidentDetail?.volunteerId ? (
            <>
              <Row className="incidentRow">
                <Col xs={6}>
                  <h4>Responder</h4>
                  <p>
                    {incidentDetail?.volunteerId?.firstName
                      ? `${incidentDetail?.volunteerId?.firstName} ${incidentDetail?.volunteerId?.lastName}`
                      : '-'}
                  </p>
                </Col>
                <Col xs={6}>
                  <h4>Department</h4>
                  <p>{incidentDetail?.volunteerId?.designation ?? '-'}</p>
                </Col>
                <Col xs={6}>
                  <h4>Phone Number</h4>
                  <p>
                    {incidentDetail?.volunteerId?.phoneNumber &&
                    incidentDetail?.volunteerId?.phoneNumber?.length > 0
                      ? incidentDetail?.volunteerId?.phoneNumber
                      : '-'}
                  </p>
                </Col>
                <Col xs={6}>
                  <h4>Email Address</h4>
                  <p>{incidentDetail?.volunteerId?.email ?? '-'}</p>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <h4>Address</h4>
                  <p>
                    {incidentDetail?.volunteerId?.address &&
                    incidentDetail?.volunteerId?.address?.length > 0
                      ? incidentDetail?.volunteerId?.address
                      : '-'}
                  </p>
                </Col>
              </Row>
            </>
          ) : (
            <Row>Responder not assign</Row>
          )}
        </DetailWrapper>
        <DetailWrapper className="userDetail">
          <h3>Comments</h3>
          <CommentList />
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewIncident;
