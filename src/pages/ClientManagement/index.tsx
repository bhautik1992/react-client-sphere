import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ClientManagementTable from 'components/module/clientManagement/ClientManagementTable';

import { IClientReq } from 'services/api/client/types';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Clients'
  }
];

const ClientManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');
  const [deletedClient, setDeletedClient] = useState<boolean>(false);
  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<IClientReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    deletedClient
  });

  const handleChange = (value: string) => {
    const deleted = value === 'deleted';
    setDeletedClient(deleted);
    setArgs((prev) => ({
      ...prev,
      deletedClient: deleted,
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
          <h2 className="pageTitle">Clients</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search client"
                allowClear
                prefix={<SearchOutlined style={{ color: '#FFC7A0' }} />}
                onChange={onChange}
              />
            </Form>
            <Select defaultValue="all" style={{ width: 120 }} onChange={handleChange}>
              <Select.Option value="all">All Clients</Select.Option>
              <Select.Option value="deleted">Deleted Clients</Select.Option>
            </Select>
            <Button type="primary" onClick={() => navigate(ROUTES.clientAdd)}>
              Add Client
            </Button>
          </div>
        </div>
        <ClientManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default ClientManagement;
