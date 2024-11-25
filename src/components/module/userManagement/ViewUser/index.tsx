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
import { IUser, IUserListReq } from 'services/api/user/types';
import { userKeys } from 'services/hooks/queryKeys';
import { useUserDetail, useUserStatus } from 'services/hooks/user';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

import UserIncidentManagementTable from '../UserIncidentManagementTable';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.userManagement}>Subscribers</Link>
  },
  {
    title: 'Subscriber Detail'
  }
];

const ViewUser = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data } = useUserDetail(id ?? '');
  const { mutate } = useUserStatus();

  const [searchValue, setSearchValue] = useState<string>('');
  const [args, setArgs] = useState<IIncidentReq>({
    limit: 10,
    offset: 0,
    sortBy: '',
    sortOrder: '',
    status: [],
    type: [],
    userId: id
  });

  const searchDebounce = useDebounce(searchValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    setArgs((prev) => ({ ...prev, offset: 0 }));
  };

  const handleConfirm = () => {
    const value = {
      status: !data?.isActive,
      userId: id ?? ''
    };
    mutate(value, {
      onSuccess: () => {
        // invalidate user list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [userKeys.userList({} as IUserListReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set status in user detail
        queryClient.setQueryData<IUser>(userKeys.userDetail(id ?? ''), (data) => {
          return { ...data } as unknown as IUser;
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
          <h2 className="pageTitle">Subscriber Detail</h2>
          <Popconfirm
            title="Status"
            placement="bottomLeft"
            description={`Are you sure to ${data?.isActive ? 'inactive' : 'active'} this user?`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleConfirm()}
          >
            <Tag color={renderTagColor(data?.isActive ?? '')}>
              {data?.isActive ? 'Active' : 'Inactive'} <DownOutlined />
            </Tag>
          </Popconfirm>
        </div>
        <DetailWrapper>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>First Name</h4>
              <p>{data?.firstName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Last Name</h4>
              <p>{data?.lastName ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Phone Number</h4>
              <p>{data?.phoneNumber ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email Address</h4>
              <p>{data?.email ?? '-'}</p>
            </Col>
          </Row>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Date of Birth</h4>
              <p>{data?.birthDate ? dayjs(data?.birthDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Gender</h4>
              <p>{data?.gender ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>School</h4>
              <p>{data?.school ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Standard</h4>
              <p>{data?.standard ?? '-'}</p>
            </Col>
          </Row>
          <Row className="incidentRow">
            <Col xs={6}>
              <h4>Address</h4>
              <p>{data?.address ?? '-'}</p>
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
        <UserIncidentManagementTable
          searchDebounce={searchDebounce}
          args={args}
          setArgs={setArgs}
        />
      </div>
    </>
  );
};

export default ViewUser;
