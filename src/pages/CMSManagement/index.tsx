import { Wrapper } from './style';

import StyledBreadcrumb from 'components/layout/breadcrumb';
import CMSManagementTable from 'components/module/cmsManagement/cmsManagementTable';

const BreadcrumbsPath = [
  {
    title: 'CMS Management'
  }
];

const CMSManagement = () => {
  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">CMS Management</h2>
        </div>
        <CMSManagementTable />
      </div>
    </Wrapper>
  );
};

export default CMSManagement;
