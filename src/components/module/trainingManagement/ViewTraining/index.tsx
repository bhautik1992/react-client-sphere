import { DetailWrapper } from './style';

import { Button, Col, Row } from 'antd';
import dayjs from 'dayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useTrainingDetail } from 'services/hooks/training';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.trainingMangement}>Training Management</Link>
  },
  {
    title: 'Training Detail'
  }
];

const ViewTraining = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data: trainingDetail } = useTrainingDetail(id ?? '');

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{trainingDetail?.title ?? '-'}</h2>
        </div>
        <DetailWrapper>
          <Row className="incidentRow">
            <Col>
              <p>{trainingDetail?.description ?? '-'}</p>
            </Col>
          </Row>
          <Row className="incidentRow">
            <Col>
              <h4>Additional Notes</h4>
              <p> {trainingDetail?.additionalNotes ?? '-'}</p>
            </Col>
          </Row>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Training For</h4>
              <p>{trainingDetail?.departments?.join(' , ') ?? '-'}</p>
            </Col>
            <Col>
              <h4>Training Date</h4>
              <p>{`${dayjs(trainingDetail?.startDate).format(DATE_FORMAT)} To ${dayjs(
                trainingDetail?.endDate
              ).format(DATE_FORMAT)}`}</p>
            </Col>
            <Col></Col>
          </Row>
          <Row className="incidentRow">
            <Col>
              <h4>Join Class</h4>
              <a href={trainingDetail?.links ?? '/'} target="_blank">
                {trainingDetail?.links ?? '-'}
              </a>
            </Col>
          </Row>
          <Row>
            <Button type="primary" onClick={() => navigate(`${ROUTES.trainingEdit}/${id}`)}>
              Edit
            </Button>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewTraining;
