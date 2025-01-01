import { ButtonWrapper, Wrapper } from './style';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ClientManagementTable from 'components/module/clientManagement/ClientManagementTable';

import { IClientReq } from 'services/api/client/types';
import { useDashboardEmployee } from 'services/hooks/dashboard';

import { ClientStatus } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Clients'
  }
];

const ClientManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);
  const { data: employeeList } = useDashboardEmployee();
  const accountManagerListOption = employeeList?.map((item) => ({
    label: `${item.firstName} ${item.lastName}`,
    value: item.id
  }));

  const [args, setArgs] = useState<IClientReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const onSubmit = (value: IClientReq) => {
    setArgs((prev) => ({ ...prev, ...value, offset: 0 }));
  };

  const resetFilter = (value: IClientReq) => {
    setFilterVisible(false);
    setArgs((prev) => ({ ...prev, ...value, offset: 0, limit: 10 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Clients</h2>
          <div className="pageHeaderButton">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setFilterVisible((prev) => !prev)}
            >
              Add Filter
            </Button>
            <Button type="primary" onClick={() => navigate(ROUTES.clientAdd)}>
              Add Client
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
              <RenderSelectInput
                col={{ xs: 8 }}
                name="status"
                placeholder="Select status"
                label="Status"
                allowClear={true}
                optionLabel={ClientStatus}
              />
              <RenderSelectInput
                col={{ xs: 8 }}
                name="accountManagerId"
                placeholder="Select account manager"
                label="Account Manager"
                allowClear={true}
                optionLabel={accountManagerListOption}
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
        <ClientManagementTable args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default ClientManagement;
