import { ButtonWrapper, Wrapper } from './style';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDebounce from '../../components/common/useDebounce';
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
  const [searchValue, setSearchValue] = useState<string>('');
  const [isInternalProject, setIsInternalProject] = useState<boolean>(false);
  const [deletedProject, setDeletedProject] = useState<boolean>(false);
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

  const handleChange = (value: string) => {
    const deleted = value === 'deleted';
    setDeletedProject(deleted);
    const internal = value === 'internal';
    setIsInternalProject(internal);
    setArgs((prev) => ({
      ...prev,
      isInternalProject: internal,
      deleteProject: deleted,
      offset: 0
    }));
  };

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<IProjectReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    isInternalProject,
    deletedProject
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setArgs((prev) => ({ ...prev, offset: 0 }));
  };

  const handleExport = () => {
    exportProjects(args);
  };

  const onSubmit = (value: IProjectReq) => {
    setFilterVisible(false);
    setArgs((prev) => {
      const updatedArgs = { ...prev, ...value, offset: 0 };
      return updatedArgs;
    });
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Projects</h2>
          <div className="pageHeaderButton">
            <Button icon={<PlusOutlined />} onClick={() => setFilterVisible((prev) => !prev)}>
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
                    setFilterVisible(false);
                  }}
                >
                  Reset
                </Button>
              </ButtonWrapper>
            </Row>
          </Form>
        )}
        <ProjectManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default ProjectManagement;
