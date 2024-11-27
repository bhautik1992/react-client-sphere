import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { useState } from 'react';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import AddProjectModal from 'components/common/Modal/AddProjectModal';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ProjectManagementTable from 'components/module/projectManagement/ProjectManagementTable';

import { IProjectReq } from 'services/api/project/types';

const BreadcrumbsPath = [
  {
    title: 'Projects'
  }
];

const ProjectManagement = () => {
  const [form] = Form.useForm();

  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<IProjectReq>({
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
            <Button type="primary" onClick={() => setIsOpen(true)}>
              Add Project
            </Button>
          </div>
        </div>
        <ProjectManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>

      {isOpen && (
        <AddProjectModal isOpen={Boolean(isOpen)} setIsOpen={(flag) => setIsOpen(!!flag)} />
      )}
    </Wrapper>
  );
};

export default ProjectManagement;
