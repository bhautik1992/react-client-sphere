import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import PaymentManagementTable from 'components/module/paymentManagement/paymentManagementTable';

import { IPaymentReq } from 'services/api/payment/types';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Payments'
  }
];

const PaymentManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');
  const [deletedPayment, setDeletedPayment] = useState<boolean>(false);

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<IPaymentReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    deletedPayment
  });

  const handleChange = (value: string) => {
    const deleted = value === 'deleted';
    setDeletedPayment(deleted);
    setArgs((prev) => ({
      ...prev,
      deletedPayment: deleted,
      offset: 0
    }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setArgs((prev) => ({ ...prev, offset: 0 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Payments</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search payment"
                allowClear
                prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
                onChange={onChange}
              />
            </Form>
            <Select defaultValue="all" style={{ width: 150 }} onChange={handleChange}>
              <Select.Option value="all">All Payments</Select.Option>
              <Select.Option value="deleted">Deleted Payments</Select.Option>
            </Select>
            <Button type="primary" onClick={() => navigate(ROUTES.paymentAdd)}>
              Add Payment
            </Button>
          </div>
        </div>
        <PaymentManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default PaymentManagement;
