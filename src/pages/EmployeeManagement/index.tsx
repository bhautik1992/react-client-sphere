import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import EmployeesManagementTable from 'components/module/employeeManagement/EmployeeManagementTable';

import { IEmployeeReq } from 'services/api/employee/types';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Employees'
  }
];

const EmployeesManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');

  const [args, setArgs] = useState<IEmployeeReq>({
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
          <h2 className="pageTitle">Employees</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search employee"
                allowClear
                prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
                onChange={onChange}
              />
            </Form>
            <Button type="primary" onClick={() => navigate(ROUTES.employeeAdd)}>
              Add Employee
            </Button>
          </div>
        </div>
        <EmployeesManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default EmployeesManagement;
