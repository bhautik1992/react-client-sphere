import { DetailWrapper } from './style';

import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Col, Form, Popconfirm, Row, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { RenderTextInput } from 'components/common/FormField';
import useDebounce from 'components/common/useDebounce';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IIncidentReq } from 'services/api/incident/type';
import { IVolunteer, IVolunteerReq } from 'services/api/volunteer/types';
import { volunteerKeys } from 'services/hooks/queryKeys';
import { useVolunteerDetail, useVolunteerStatus } from 'services/hooks/volunteer';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

import VolunteerIncidentTable from '../VolunteerIncidentTable';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.volunteerManagement}>Responders</Link>
  },
  {
    title: 'Responder Detail'
  }
];

const ViewVolunteer = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: volunteerData } = useVolunteerDetail(id ?? '');
  const { mutate } = useVolunteerStatus();

  const [searchValue, setSearchValue] = useState<string>('');

  const [args, setArgs] = useState<IIncidentReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    status: [],
    type: [],
    volunteerId: id
  });
  const searchDebounce = useDebounce(searchValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    setArgs((prev) => ({ ...prev, offset: 0 }));
  };

  const handleConfirm = () => {
    const data = {
      status: !volunteerData?.isActive,
      userId: id ?? ''
    };

    mutate(data, {
      onSuccess: (res) => {
        // invalidate volunteer list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [volunteerKeys.volunteerList({} as IVolunteerReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set status in volunteer detail
        queryClient.setQueryData<IVolunteer>(volunteerKeys.volunteerDetail(id ?? ''), () => {
          return { ...res } as unknown as IVolunteer;
        });
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Responder Detail</h2>
          <Popconfirm
            title="Status"
            placement="bottomLeft"
            description={`Are you sure to ${
              volunteerData?.isActive ? 'inactive' : 'active'
            } this responder?`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleConfirm()}
          >
            <Tag color={renderTagColor(volunteerData?.isActive ?? '')}>
              {volunteerData?.isActive ? 'Active' : 'Inactive'} <DownOutlined />
            </Tag>
          </Popconfirm>
        </div>
        <DetailWrapper>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>First Name</h4>
              <p>{volunteerData?.firstName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Last Name</h4>
              <p>{volunteerData?.lastName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Phone Number</h4>
              <p>{volunteerData?.phoneNumber ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email Address</h4>
              <p>{volunteerData?.email ?? '-'}</p>
            </Col>
          </Row>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Category</h4>
              <p>{volunteerData?.designation ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Date of Birth</h4>
              <p>
                {volunteerData?.birthDate
                  ? dayjs(volunteerData?.birthDate).format(DATE_FORMAT)
                  : '-'}
              </p>
            </Col>
            <Col xs={6}>
              <h4>Gender</h4>
              <p>{volunteerData?.gender ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Address</h4>
              <p>{volunteerData?.address ?? '-'}</p>
            </Col>
          </Row>
        </DetailWrapper>
      </div>
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
        <VolunteerIncidentTable searchDebounce={searchDebounce} args={args} setArgs={setArgs} />
      </div>
    </>
  );
};

export default ViewVolunteer;
