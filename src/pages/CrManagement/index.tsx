import { Wrapper } from './style';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDebounce from '../../components/common/useDebounce';
import { RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import CrManagementTable from 'components/module/crManagement/CrManagementTable';

import { ICrReq } from 'services/api/cr/types';
import { useExportCrs } from 'services/hooks/cr';

import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Project Crs'
  }
];

const CrManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');
  const [isInternalCr, setIsInternalCr] = useState<boolean>(false);
  const { mutate: exportCrs } = useExportCrs();

  const searchDebounce = useDebounce(searchValue);
  const [args, setArgs] = useState<ICrReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    isInternalCr
  });

  const handleChange = (value: string) => {
    const internal = value === 'internal';
    setIsInternalCr(internal);
    setArgs((prev) => ({ ...prev, isInternalCr: internal, offset: 0 }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setArgs((prev) => ({ ...prev, offset: 0 }));
  };

  const handleExport = () => {
    exportCrs(args);
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Project Crs</h2>
          <div className="pageHeaderButton">
            <Form form={form}>
              <RenderTextInput
                size="middle"
                placeholder="Search cr"
                allowClear
                prefix={<SearchOutlined style={{ color: '#0000ff' }} />}
                onChange={onChange}
              />
            </Form>
            <Select defaultValue="all" style={{ width: 100 }} onChange={handleChange}>
              <Select.Option value="all">All CRs</Select.Option>
              <Select.Option value="internal">Internal CRs</Select.Option>
            </Select>
            <Button type="primary" onClick={handleExport}>
              Export
            </Button>
            <Button type="primary" onClick={() => navigate(ROUTES.crAdd)}>
              Add Cr
            </Button>
          </div>
        </div>
        <CrManagementTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default CrManagement;
