import { ButtonWrapper, Wrapper } from './style';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ProjectManagementTable from 'components/module/projectManagement/ProjectManagementTable';

import { IProjectReq } from 'services/api/project/types';
import { useDashboardClient, useDashboardEmployee } from 'services/hooks/dashboard';
import { useExportProjects } from 'services/hooks/project';

import { EmployeeRoleName, ProjectStatus } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Projects'
  }
];

const ProjectManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate: exportProjects } = useExportProjects();
  const [filterVisible, setFilterVisible] = useState(false);

  const { data: clientList } = useDashboardClient();
  const clientListOption = clientList?.map((item) => {
    return {
      label: item.firstName + ' ' + item.lastName,
      value: item.id
    };
  });

  const { data: employeeList } = useDashboardEmployee();
  const projectManagerListOption = [
    {
      label: 'Outsourcing PM',
      value: 0
    },
    ...(Array.isArray(employeeList)
      ? employeeList
          .filter((item) => item.role === EmployeeRoleName.Project_Manager)
          .map((item) => ({
            label: `${item.firstName} ${item.lastName}`,
            value: item.id
          }))
      : [])
  ];
  const [args, setArgs] = useState<IProjectReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const handleExport = () => {
    exportProjects(args);
  };

  const onSubmit = (value: IProjectReq) => {
    setArgs((prev) => ({ ...prev, ...value, offset: 0 }));
  };

  const resetFilter = (value: IProjectReq) => {
    setFilterVisible(false);
    setArgs((prev) => ({ ...prev, ...value, offset: 0, limit: 10 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Projects</h2>
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
            <Button type="primary" onClick={() => navigate(ROUTES.projectAdd)}>
              Add Project
            </Button>
          </div>
        </div>
        {filterVisible && (
          <Form onFinish={onSubmit} form={form} autoComplete="off" className="filterForm">
            <Row gutter={[0, 30]}>
              <RenderTextInput
                col={{ xs: 8 }}
                name="name"
                placeholder="Enter project name"
                label="Name"
                allowClear="allowClear"
                size="middle"
              />
              <RenderDatePicker col={{ xs: 8 }} name="startDate" label="Start Date" size="middle" />
              <RenderSelectInput
                col={{ xs: 8 }}
                name="clientId"
                placeholder="Select client"
                label="Client"
                allowClear={true}
                optionLabel={clientListOption}
              />
              <RenderSelectInput
                col={{ xs: 8 }}
                name="projectManagerId"
                placeholder="Select project manager"
                label="Project Manager"
                allowClear={true}
                optionLabel={projectManagerListOption}
              />
              <RenderSelectInput
                col={{ xs: 8 }}
                name="status"
                placeholder="Select project status"
                label="Status"
                allowClear={true}
                optionLabel={ProjectStatus}
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
        <ProjectManagementTable args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default ProjectManagement;
