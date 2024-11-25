import Breadcrumb from 'antd/es/breadcrumb/Breadcrumb';
import React, { ReactNode } from 'react';

import { Wrapper } from './breadcrumb.styled';

interface BreadcrumbItem {
  title: string | ReactNode;
}

interface IBreadcrumbProps {
  items: BreadcrumbItem[];
}

const StyledBreadcrumb: React.FC<IBreadcrumbProps> = ({ items }) => {
  return (
    <Wrapper>
      <Breadcrumb separator="/" items={items}></Breadcrumb>
    </Wrapper>
  );
};

export default StyledBreadcrumb;
