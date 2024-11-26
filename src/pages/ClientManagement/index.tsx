import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { useState } from 'react';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import AddClientModal from 'components/common/Modal/AddClientModal';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ClientManagementTable from 'components/module/clientManagement/ClientManagementTable';

import { IClientReq } from 'services/api/client/types';

const BreadcrumbsPath = [
  {
    title: 'Clients'
  }
];

const ClientManagement = () => {
  const [form] = Form.useForm();

  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<IClientReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

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
                prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
                onChange={onChange}
              />
            </Form>
            <Button type="primary" onClick={() => setIsOpen(true)}>
              Add Client
            </Button>
          </div>
        </div>
        <ClientManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>

      {isOpen && (
        <AddClientModal isOpen={Boolean(isOpen)} setIsOpen={(flag) => setIsOpen(!!flag)} />
      )}
    </Wrapper>
  );
};

export default ClientManagement;
