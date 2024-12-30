import { ButtonWrapper, Wrapper } from './style';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';
import CrManagementTable from 'components/module/crManagement/CrManagementTable';

import { ICrReq } from 'services/api/cr/types';
import { useExportCrs } from 'services/hooks/cr';
import { useDashboardClient, useDashboardProject } from 'services/hooks/dashboard';

import { CrStatus } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const BreadcrumbsPath = [
  {
    title: 'Project CRs'
  }
];

const CrManagement = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate: exportCrs } = useExportCrs();

  const [filterVisible, setFilterVisible] = useState(false);

  const { data: clientList } = useDashboardClient();
  const clientListOption = clientList?.map((item) => {
    return {
      label: item.firstName + ' ' + item.lastName,
      value: item.id
    };
  });

  const { data: projectList } = useDashboardProject();
  const projectListOption = projectList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const [args, setArgs] = useState<ICrReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: ''
  });

  const handleExport = () => {
    exportCrs(args);
  };

  const onSubmit = (value: ICrReq) => {
    setArgs((prev) => ({ ...prev, ...value, offset: 0 }));
  };

  const resetFilter = (value: ICrReq) => {
    setFilterVisible(false);
    setArgs((prev) => ({ ...prev, ...value, offset: 0, limit: 10 }));
  };

  return (
    <Wrapper>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Project CRs</h2>
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
            <Button type="primary" onClick={() => navigate(ROUTES.crAdd)}>
              Add CR
            </Button>
          </div>
        </div>
        {filterVisible && (
          <Form onFinish={onSubmit} form={form} autoComplete="off" className="filterForm">
            <Row gutter={[0, 30]}>
              <RenderTextInput
                col={{ xs: 8 }}
                name="name"
                placeholder="Enter cr name"
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
                name="projectId"
                placeholder="Select project"
                label="Project"
                allowClear={true}
                optionLabel={projectListOption}
              />
              <RenderSelectInput
                col={{ xs: 8 }}
                name="status"
                placeholder="Select cr status"
                label="Status"
                allowClear={true}
                optionLabel={CrStatus}
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
        <CrManagementTable args={args} setArgs={setArgs} />
      </div>
    </Wrapper>
  );
};

export default CrManagement;
