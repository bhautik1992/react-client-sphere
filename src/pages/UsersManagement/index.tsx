import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { useState } from 'react';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import AddEditUserModal from 'components/common/Modal/AddUserModal';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import UsersManagementTable from 'components/module/usersManagement/UsersManagementTable';

import { IUserReq } from 'services/api/users/types';

const BreadcrumbsPath = [
  {
    title: 'Users'
  }
];

const UsersManagement = () => {
  const [form] = Form.useForm();

  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [args, setArgs] = useState<IUserReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const searchDebounce = useDebounce(searchValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setArgs((prev) => ({ ...prev, offset: 0 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Users</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search user"
                allowClear
                prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
                onChange={onChange}
              />
            </Form>
            <Button type="primary" onClick={() => setIsOpen(true)}>
              Add User
            </Button>
          </div>
        </div>
        <UsersManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
      {isOpen && (
        <AddEditUserModal isOpen={Boolean(isOpen)} setIsOpen={(flag) => setIsOpen(!!flag)} />
      )}
    </Wrapper>
  );
};

export default UsersManagement;
