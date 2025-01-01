import { ButtonWrapper, Wrapper } from './style';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import EmployeesManagementTable from 'components/module/employeeManagement/EmployeeManagementTable';

import { IEmployeeReq } from 'services/api/employee/types';
import { useExportEmployees } from 'services/hooks/employee';

import { EmployeeRole } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Employees'
  }
];

const EmployeesManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);
  const { mutate: exportEmployees } = useExportEmployees();

  const [args, setArgs] = useState<IEmployeeReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const handleExport = () => {
    exportEmployees({ ...args });
  };

  const onSubmit = (value: IEmployeeReq) => {
    setArgs((prev) => ({ ...prev, ...value, offset: 0 }));
  };

  const resetFilter = (value: IEmployeeReq) => {
    setFilterVisible(false);
    setArgs((prev) => ({ ...prev, ...value, offset: 0, limit: 10 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Employees</h2>
          <div className="pageHeaderButton">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setFilterVisible((prev) => !prev)}
            >
              Add Filter
            </Button>
            <Button type="primary" onClick={handleExport}>
              Export
            </Button>
            <Button type="primary" onClick={() => navigate(ROUTES.employeeAdd)}>
              Add Employee
            </Button>
          </div>
        </div>
        {filterVisible && (
          <Form onFinish={onSubmit} form={form} autoComplete="off" className="filterForm">
            <Row gutter={[0, 30]}>
              <RenderTextInput
                col={{ xs: 8 }}
                name="employeeCode"
                placeholder="Enter employee code"
                label="Emp Code"
                allowClear="allowClear"
                size="middle"
              />
              <RenderTextInput
                col={{ xs: 8 }}
                name="name"
                placeholder="Enter name"
                label="Name"
                allowClear="allowClear"
                size="middle"
              />
              <RenderTextInput
                col={{ xs: 8 }}
                name="email"
                placeholder="Enter email"
                label="Email"
                allowClear="allowClear"
                size="middle"
              />
              <RenderSelectInput
                col={{ xs: 8 }}
                name="role"
                placeholder="Select role"
                label="Role"
                allowClear={true}
                optionLabel={EmployeeRole}
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
        <EmployeesManagementTable args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default EmployeesManagement;
