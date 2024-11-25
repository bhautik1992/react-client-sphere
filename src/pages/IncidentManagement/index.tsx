import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { useState } from 'react';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import IncidentManagementTable from 'components/module/incidentManagement/IncidentManagementTable';

import { IIncidentReq } from 'services/api/incident/type';

const BreadcrumbsPath = [
  {
    title: 'Incident'
  }
];

const IncidentManagement = () => {
  const [form] = Form.useForm();

  const [searchValue, setSearchValue] = useState<string>('');
  const [args, setArgs] = useState<IIncidentReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    status: [],
    type: []
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
          <h2 className="pageTitle">Incident</h2>
          <Form form={form}>
            <RenderTextInput
              size="middle"
              placeholder="Search incident"
              allowClear
              prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
              onChange={onChange}
            />
          </Form>
        </div>
        <IncidentManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default IncidentManagement;
