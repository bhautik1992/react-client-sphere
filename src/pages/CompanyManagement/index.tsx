import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { useState } from 'react';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import AddEditCompanyModal from 'components/common/Modal/AddCompanyModal';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import CompanyManagementTable from 'components/module/companyManagement/CompanyManagementTable';

import { ICompanyReq } from 'services/api/company/types';

const BreadcrumbsPath = [
  {
    title: 'Companies'
  }
];

const CompanyManagement = () => {
  const [form] = Form.useForm();
  const [deletedCompany, setDeletedCompany] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<ICompanyReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    deletedCompany
  });

  const handleChange = (value: string) => {
    const deleted = value === 'deleted';
    setDeletedCompany(deleted);
    setArgs((prev) => ({
      ...prev,
      deletedCompany: deleted,
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
          <h2 className="pageTitle">Companies</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search company"
                allowClear
                prefix={<SearchOutlined style={{ color: '#FFC7A0' }} />}
                onChange={onChange}
              />
            </Form>
            <Select defaultValue="all" style={{ width: 150 }} onChange={handleChange}>
              <Select.Option value="all">All Companies</Select.Option>
              <Select.Option value="deleted">Deleted Companies</Select.Option>
            </Select>
            <Button type="primary" onClick={() => setIsOpen(true)}>
              Add Company
            </Button>
          </div>
        </div>
        <CompanyManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
      {isOpen && (
        <AddEditCompanyModal isOpen={Boolean(isOpen)} setIsOpen={(flag) => setIsOpen(!!flag)} />
      )}
    </Wrapper>
  );
};

export default CompanyManagement;
