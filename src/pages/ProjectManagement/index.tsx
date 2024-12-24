import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ProjectManagementTable from 'components/module/projectManagement/ProjectManagementTable';

import { IProjectReq } from 'services/api/project/types';
import { useExportProjects } from 'services/hooks/project';

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

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Projects</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search project"
                allowClear
                prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
                onChange={onChange}
              />
            </Form>
            <Select defaultValue="all" style={{ width: 120 }} onChange={handleChange}>
              <Select.Option value="all">All Projects</Select.Option>
              <Select.Option value="internal">Internal Projects</Select.Option>
              <Select.Option value="deleted">Deleted Projects</Select.Option>
            </Select>
            <Button type="primary" onClick={handleExport}>
              Export
            </Button>
            <Button type="primary" onClick={() => navigate(ROUTES.projectAdd)}>
              Add Project
            </Button>
          </div>
        </div>
        <ProjectManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default ProjectManagement;
