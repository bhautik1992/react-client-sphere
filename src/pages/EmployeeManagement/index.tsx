import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
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
  const [deletedEmployee, setDeletedEmployee] = useState<boolean>(false);

  const [args, setArgs] = useState<IEmployeeReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    deletedEmployee
  });

  const handleChange = (value: string) => {
    const deleted = value === 'deleted';
    setDeletedEmployee(deleted);
    setArgs((prev) => ({
      ...prev,
      deletedEmployee: deleted,
      offset: 0
    }));
  };

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
                prefix={<SearchOutlined style={{ color: '#FFC7A0' }} />}
                onChange={onChange}
              />
            </Form>
            <Select defaultValue="all" style={{ width: 150 }} onChange={handleChange}>
              <Select.Option value="all">All Employees</Select.Option>
              <Select.Option value="deleted">Deleted Employees</Select.Option>
            </Select>
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
