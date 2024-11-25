import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { useState } from 'react';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import ConsentFormTable from 'components/module/ConsentFormManagement/ConsentFormTable';

import { IConsentFormListReq } from 'services/api/consentForm/types';

const BreadcrumbsPath = [
  {
    title: 'Consent Forms'
  }
];

const ConsentFormManagement = () => {
  const [form] = Form.useForm();

  const [searchValue, setSearchValue] = useState<string>('');

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<IConsentFormListReq>({
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
          <h2 className="pageTitle">Consent Form</h2>
          <Form form={form}>
            <RenderTextInput
              size="middle"
              placeholder="Search subscriber"
              allowClear
              prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
              onChange={onChange}
            />
          </Form>
        </div>
        <ConsentFormTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default ConsentFormManagement;
