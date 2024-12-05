import { DetailWrapper } from './style';

import { Col, Row } from 'antd';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useVendorDetail } from 'services/hooks/vendor';

import { Designation } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.vendorManagement}>Vendor</Link>
  },
  {
    title: 'Vendor Detail'
  }
];

const ViewVendor = () => {
  const { id } = useParams();
  const { data: vendorData } = useVendorDetail(Number(id));

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Vendor Detail</h2>
        </div>
        <DetailWrapper>
          <Row className="clientRow">
            <Col xs={6}>
              <h4>First Name</h4>
              <p>{vendorData?.firstName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Last Name</h4>
              <p>{vendorData?.lastName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email</h4>
              <p>{vendorData?.email ?? '-'}</p>
            </Col>
          </Row>
          <Row className="clientRow">
            <Col xs={6}>
              <h4>Phone</h4>
              <p>{vendorData?.phone ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Address</h4>
              <p>{vendorData?.address ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Skype Id</h4>
              <p>{vendorData?.skypeId ?? '-'}</p>
            </Col>
          </Row>
          <Row className="clientRow">
            <Col xs={6}>
              <h4>Designation</h4>
              <p>{Designation.find((d) => d.value === vendorData?.designation)?.label ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Account Manager</h4>
              <p>{vendorData?.accountManager ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Website</h4>
              <p>{vendorData?.website ?? '-'}</p>
            </Col>
          </Row>
          <Row className="clientRow">
            <Col xs={6}>
              <h4>Country</h4>
              <p>{vendorData?.countryName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>State</h4>
              <p>{vendorData?.stateName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>City</h4>
              <p>{vendorData?.cityName ?? '-'}</p>
            </Col>
          </Row>
          <Row className="clientRow">
            <Col xs={6}>
              <h4>Company Name</h4>
              <p>{vendorData?.company?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Vendor Company Name</h4>
              <p>{vendorData?.vendorCompanyName ?? '-'}</p>
            </Col>
            <Col xs={6}></Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewVendor;
