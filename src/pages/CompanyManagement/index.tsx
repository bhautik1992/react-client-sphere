import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDebounce from '../../components/common/useDebounce';
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
  const [deletedVendor, setDeletedVendor] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<ICompanyReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    deletedVendor
  });

  const handleChange = (value: string) => {
    const deleted = value === 'deleted';
    setDeletedVendor(deleted);
    setArgs((prev) => ({
      ...prev,
      deletedVendor: deleted,
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
          <h2 className="pageTitle">Vendors</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search vendor"
                allowClear
                prefix={<SearchOutlined style={{ color: '#FFC7A0' }} />}
                onChange={onChange}
              />
            </Form>
            <Select defaultValue="all" style={{ width: 150 }} onChange={handleChange}>
              <Select.Option value="all">All Vendors</Select.Option>
              <Select.Option value="deleted">Deleted Vendors</Select.Option>
            </Select>
            <Button type="primary" onClick={() => navigate(ROUTES.companyAdd)}>
              Add Vendor
            </Button>
          </div>
        </div>
        <CompanyManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default CompanyManagement;
