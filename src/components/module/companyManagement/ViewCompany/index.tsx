import { DetailWrapper } from './style';

import { Col, Row } from 'antd';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useCompanyDetail } from 'services/hooks/company';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.companyManagement}>Companies</Link>
  },
  {
    title: 'View Company'
  }
];

const ViewCompany = () => {
  const { id } = useParams();

  const { data } = useCompanyDetail(Number(id));
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">View Company</h2>
        </div>
        <DetailWrapper>
          <Row className="companyRow">
            <Col xs={6}>
              <h4>Name</h4>
              <p>{data?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email</h4>
              <p>{data?.email ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Address</h4>
              <p>{data?.address ?? '-'}</p>
            </Col>
          </Row>
          <Row className="companyRow">
            <Col xs={6}>
              <h4>Country</h4>
              <p>{data?.country ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>No. of Projects</h4>
              <p>{data?.projects?.length ?? '-'}</p>
            </Col>
            <Col xs={6}></Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewCompany;