import { ButtonWrapper, Wrapper } from './style';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import InvoiceManagementTable from 'components/module/invoiceManagement/InvoiceManagementTable';

import { IInvoiceReq } from 'services/api/invoice/types';
import { useDashboardClient, useDashboardProject } from 'services/hooks/dashboard';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Invoices'
  }
];

const InvoiceManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);

  const [args, setArgs] = useState<IInvoiceReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const { data: clientList } = useDashboardClient();
  const clientListOption = clientList?.map((item) => {
    return {
      label: item.firstName + ' ' + item.lastName,
      value: item.id
    };
  });

  const { data: projectList } = useDashboardProject();
  const projectListOption = projectList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const onSubmit = (value: IInvoiceReq) => {
    setArgs((prev) => ({ ...prev, ...value, offset: 0 }));
  };

  const resetFilter = (value: IInvoiceReq) => {
    setFilterVisible(false);
    setArgs((prev) => ({ ...prev, ...value, offset: 0, limit: 10 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Invoices</h2>
          <div className="pageHeaderButton">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setFilterVisible((prev) => !prev)}
            >
              Add Filter
            </Button>
            <Button type="primary" onClick={() => navigate(ROUTES.invoiceAdd)}>
              Add Invoice
            </Button>
          </div>
        </div>
        {filterVisible && (
          <Form onFinish={onSubmit} form={form} autoComplete="off" className="filterForm">
            <Row gutter={[0, 30]}>
              <RenderTextInput
                col={{ xs: 8 }}
                name="invoiceNumber"
                placeholder="Enter invoice no."
                label="Invoice no."
                allowClear="allowClear"
                size="middle"
              />
              <RenderDatePicker
                col={{ xs: 8 }}
                name="invoiceDate"
                label="Invoice Date"
                size="middle"
              />
              <RenderSelectInput
                col={{ xs: 8 }}
                name="clientId"
                placeholder="Select client"
                label="Client"
                allowClear={true}
                optionLabel={clientListOption}
              />
              <RenderSelectInput
                col={{ xs: 8 }}
                name="projectId"
                placeholder="Select project"
                label="Project"
                allowClear={true}
                optionLabel={projectListOption}
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
        <InvoiceManagementTable args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default InvoiceManagement;
