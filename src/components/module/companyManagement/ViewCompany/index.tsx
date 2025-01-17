import { DetailWrapper } from './style';

import { Col, Row, Tooltip } from 'antd';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useCompanyDetail } from 'services/hooks/company';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.companyManagement}>Vendors</Link>
  },
  {
    title: 'View Vendor'
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
          <h2 className="pageTitle">View Vendor</h2>
        </div>
        <DetailWrapper>
          <Row className="companyRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{data?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Email</h4>
              <p>{data?.email ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Address</h4>
              <p>{data?.address ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Country</h4>
              <p>{data?.countryName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>State</h4>
              <p>{data?.stateName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>City</h4>
              <p>{data?.cityName ?? '-'}</p>
            </Col>
          </Row>
          <Row className="companyRow">
            <Col xs={4}>
              <h4>Comment</h4>
              <p>{data?.comment ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>No. of Projects</h4>
              <Tooltip
                title={
                  data?.assignedToProjects?.length ? (
                    <div>
                      {data.assignedToProjects.map((project) => (
                        <div key={project.id}>{project.name}</div>
                      ))}
                    </div>
                  ) : (
                    'No projects available'
                  )
                }
                placement="left"
                trigger="hover"
              >
                <p>{data?.assignedToProjects?.length ?? '-'}</p>
              </Tooltip>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewCompany;
