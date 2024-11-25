import { Wrapper } from './style';

import { Button, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useProfileDetail } from 'services/hooks/profile';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'My Profile'
  }
];

const MyProfile = () => {
  const navigate = useNavigate();
  const { data } = useProfileDetail();

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">My Profile</h2>
          <Button type="primary" onClick={() => navigate(ROUTES.editMyProfile)}>
            Edit Profile
          </Button>
        </div>
        <Row gutter={[0, 30]} className="profileDetail">
          <Col xs={18}>
            <Row gutter={[0, 40]} className="detailRow">
              <Col xs={12}>
                <h4>First Name</h4>
                <p>{data?.first_name ?? '-'}</p>
              </Col>
              <Col xs={12}>
                <h4>Last Name</h4>
                <p>{data?.last_name ?? '-'}</p>
              </Col>
              <Col xs={12}>
                <h4>Email Address</h4>
                <p>{data?.email ?? '-'}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Wrapper>
  );
};

export default MyProfile;
