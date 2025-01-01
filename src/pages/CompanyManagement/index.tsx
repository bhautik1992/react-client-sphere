import { ButtonWrapper, Wrapper } from './style';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import CompanyManagementTable from 'components/module/companyManagement/CompanyManagementTable';

import { ICompanyReq } from 'services/api/company/types';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Vendors'
  }
];

const CompanyManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);

  const [args, setArgs] = useState<ICompanyReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const onSubmit = (value: ICompanyReq) => {
    setArgs((prev) => ({ ...prev, ...value, offset: 0 }));
  };

  const resetFilter = (value: ICompanyReq) => {
    setFilterVisible(false);
    setArgs((prev) => ({ ...prev, ...value, offset: 0, limit: 10 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Vendors</h2>
          <div className="pageHeaderButton">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setFilterVisible((prev) => !prev)}
            >
              Add Filter
            </Button>
            <Button type="primary" onClick={() => navigate(ROUTES.companyAdd)}>
              Add Vendor
            </Button>
          </div>
        </div>
        {filterVisible && (
          <Form onFinish={onSubmit} form={form} autoComplete="off" className="filterForm">
            <Row gutter={[0, 30]}>
              <RenderTextInput
                col={{ xs: 8 }}
                name="name"
                placeholder="Enter Client name"
                label="Name"
                allowClear="allowClear"
                size="middle"
              />
              <RenderTextInput
                col={{ xs: 8 }}
                name="email"
                placeholder="Enter email"
                label="Email"
                allowClear="allowClear"
                size="middle"
              />
            </Row>
            <Row justify={'end'}>
              <ButtonWrapper>
                <Button className="submitButton" type="primary" size="middle" htmlType="submit">
                  Apply Filter
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    resetFilter(form.getFieldsValue());
                  }}
                >
                  Reset
                </Button>
              </ButtonWrapper>
            </Row>
          </Form>
        )}
        <CompanyManagementTable args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default CompanyManagement;
