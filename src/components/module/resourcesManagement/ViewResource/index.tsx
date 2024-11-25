import { DetailWrapper } from './style';

import { Button, Col, Image, Row } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useResourceDetail } from 'services/hooks/resource';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.resourcesMangement}>Resources Management</Link>
  },
  {
    title: 'View Resource'
  }
];

const ViewResource = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useResourceDetail(id ?? '');
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">View Resource</h2>
          <Button type="primary" onClick={() => navigate(`${ROUTES.resourcesEdit}/${id}`)}>
            Edit
          </Button>
        </div>
        <DetailWrapper>
          <Row className="incidentRow">
            <Col>
              <h4>Resource Type</h4>
              <p>{data?.resourceType?.title ?? '-'}</p>
            </Col>
            <Col>
              <h4>Resource Title</h4>
              <p>{data?.title ?? '-'}</p>
            </Col>
            <Col>
              <h4>Resource Image</h4>
              {data?.resourceType?.imageSignUrl ? (
                <Image width={200} src={data?.resourceType?.imageSignUrl} />
              ) : (
                '-'
              )}
            </Col>
            <Col>
              <h4>Resource URL</h4>
              <p>{data?.url ?? '-'}</p>
            </Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewResource;
