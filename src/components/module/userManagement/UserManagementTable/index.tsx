import { DownOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CommonTable } from 'components/common/Table';

import { IUser, IUserListReq } from 'services/api/user/types';
import { userKeys } from 'services/hooks/queryKeys';
import { useUserList, useUserStatus } from 'services/hooks/user';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

interface IProps {
  searchDebounce: string;
  args: IUserListReq;
  setArgs: React.Dispatch<React.SetStateAction<IUserListReq>>;
}

const UserManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userList, isLoading } = useUserList({
    ...args,
    search: searchDebounce
  });
  const { mutate } = useUserStatus();

  const handleConfirm = (status: boolean, id: string) => {
    const data = {
      status: !status,
      userId: id
    };
    mutate(data, {
      onSuccess: () => {
        // invalidate user list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [userKeys.userList({ ...args, search: searchDebounce })].some((key) => {
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

  const columns: ColumnsType<any> = [
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: true
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      sorter: true
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: true
    },
    {
      title: 'Date of birth',
      dataIndex: 'birthDate',
      key: 'birthDate',
      sorter: true,
      render: (_, record: any) => <>{dayjs(record?.birthDate).format(DATE_FORMAT)}</>
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: true
    },
    {
      title: 'Zip code',
      dataIndex: 'zipCode',
      key: 'zipCode',
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (_, record: IUser) => (
        <Popconfirm
          title="Status"
          placement="left"
          description={`Are you sure to ${record?.isActive ? 'inactive' : 'active'} this user ?`}
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleConfirm(record?.isActive, record?._id)}
        >
          <Tag className="table-status-tag" color={renderTagColor(record?.isActive)}>
            {record?.isActive ? 'Active' : 'Inactive'} <DownOutlined />
          </Tag>
        </Popconfirm>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IUser) => (
        <Tooltip title="View subscriber" placement="top" trigger="hover">
          <Button
            type="text"
            size="small"
            className="cta_btn table_cta_btn"
            icon={<EyeOutlined />}
            onClick={() => navigate(`${ROUTES.userView}/${record?._id}`)}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <CommonTable
      bordered
      columns={columns}
      dataSource={
        (userList?.result ?? [])?.length > 0
          ? userList?.result?.map((item) => ({ ...item, key: item._id }))
          : []
      }
      currentPage={args.offset === 0 ? 1 : args.offset / 10 + 1}
      onChange={(pagination, _, sorter, extra) => {
        const { columnKey, order } = sorter as SorterResult<any>; // Type assertion
        const pageIndex = pagination?.current ?? 1;

        if (extra?.action === 'paginate') {
          setArgs({
            ...args,
            offset: (pageIndex - 1) * (pagination?.pageSize ?? 10),
            limit: pagination?.pageSize ?? 10
          });
        } else {
          setArgs({
            ...args,
            sortBy: order ? columnKey : '',
            sortOrder: order?.replace('end', '') ?? '',
            offset: 0
          });
        }
      }}
      loading={isLoading}
      total={userList?.recordsTotal ?? 0}
    />
  );
};

export default UserManagementTable;
