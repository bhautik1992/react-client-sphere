import { Wrapper } from './style';

import { Button } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { useCmsDetail } from 'services/hooks/cms';

import { ROUTES } from 'utils/constants/routes';

const TermsAndCondition = () => {
  const navigate = useNavigate();
  const { key } = useParams();
  const { data } = useCmsDetail(key ?? '');

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.cms}>CMS Management</Link>
    },
    {
      title: key === 'termsAndConditions' ? 'Terms And Condition' : 'Privacy Policy'
    }
  ];
  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{data?.name}</h2>
          <div className="pageHeaderButton">
            <Button type="primary" onClick={() => navigate(`${ROUTES.editCms}/${key}`)}>
              Edit
            </Button>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}></div>
      </div>
    </Wrapper>
  );
};

export default TermsAndCondition;
