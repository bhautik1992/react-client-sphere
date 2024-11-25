import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { useState } from 'react';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import AddVolunteerModal from 'components/common/Modal/AddVolunteerModal';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import VolenteerManagementTable from 'components/module/volunteerManagement/VolunteerManagementTable';

import { IVolunteerReq } from 'services/api/volunteer/types';

const BreadcrumbsPath = [
  {
    title: 'Responders'
  }
];

const VolunteerManagement = () => {
  const [form] = Form.useForm();

  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<IVolunteerReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    setArgs((prev) => ({ ...prev, offset: 0 }));
  };
  console.log('🚀 ~ args:', args);

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Responders</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search responder"
                allowClear
                prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
                onChange={onChange}
              />
            </Form>
            <Button type="primary" onClick={() => setIsOpen(true)}>
              Add Responder
            </Button>
          </div>
        </div>
        <VolenteerManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>

      {isOpen && (
        <AddVolunteerModal isOpen={Boolean(isOpen)} setIsOpen={(flag) => setIsOpen(!!flag)} />
      )}
    </Wrapper>
  );
};

export default VolunteerManagement;
