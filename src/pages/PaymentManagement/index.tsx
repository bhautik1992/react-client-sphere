import { ButtonWrapper, Wrapper } from './style';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import PaymentManagementTable from 'components/module/paymentManagement/paymentManagementTable';

import { IPaymentReq } from 'services/api/payment/types';
import { useDashboardProject } from 'services/hooks/dashboard';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Payments'
  }
];

const PaymentManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);

  const [args, setArgs] = useState<IPaymentReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const { data: projectList } = useDashboardProject();
  const projectListOption = projectList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const onSubmit = (value: IPaymentReq) => {
    setArgs((prev) => ({ ...prev, ...value, offset: 0 }));
  };

  const resetFilter = (value: IPaymentReq) => {
    setFilterVisible(false);
    setArgs((prev) => ({ ...prev, ...value, offset: 0, limit: 10 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Payments</h2>
          <div className="pageHeaderButton">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setFilterVisible((prev) => !prev)}
            >
              Add Filter
            </Button>
            <Button type="primary" onClick={() => navigate(ROUTES.paymentAdd)}>
              Add Payment
            </Button>
          </div>
        </div>
        {filterVisible && (
          <Form onFinish={onSubmit} form={form} autoComplete="off" className="filterForm">
            <Row gutter={[0, 30]}>
              <RenderTextInput
                col={{ xs: 8 }}
                name="paymentNumber"
                placeholder="Enter payment no."
                label="Payment no."
                allowClear="allowClear"
                size="middle"
              />
              <RenderDatePicker
                col={{ xs: 8 }}
                name="paymentDate"
                label="Payment Date"
                size="middle"
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
        <PaymentManagementTable args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default PaymentManagement;
