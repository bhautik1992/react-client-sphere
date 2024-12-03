import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddEditUserModal from 'components/common/Modal/AddUserModal';
import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IUser, IUserReq } from 'services/api/users/types';
import { userKeys } from 'services/hooks/queryKeys';
import { useDeleteUser, useUserList } from 'services/hooks/user';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { UserRole } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

interface IProps {
  searchDebounce: string;
  args: IUserReq;
  setArgs: React.Dispatch<React.SetStateAction<IUserReq>>;
}

const UsersManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<IUser | null>(null);

  const { data: userList, isLoading } = useUserList({ ...args, search: searchDebounce });
  const { mutate } = useDeleteUser();

  const handleDeleteModal = (id: number) => {
    mutate(id, {
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
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  const columns: ColumnsType<IUser> = [
    {
      title: 'User Code',
      dataIndex: 'userCode',
      key: 'userCode',
      sorter: true
    },
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
      title: 'Personal Email',
      dataIndex: 'personalEmail',
      key: 'personalEmail',
      sorter: true
    },
    {
      title: 'Company Email',
      dataIndex: 'companyEmail',
      key: 'companyEmail',
      sorter: true
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: true
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      render: (_, record: IUser) => (
        <>{UserRole.find((role) => role.value === record?.role)?.label ?? '-'}</>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: true
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      sorter: true
    },
    {
      title: 'Date of joining',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      render: (_, record: IUser) => (
        <>{record?.joiningDate ? dayjs(record?.joiningDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Date of birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (_, record: IUser) => (
        <>{record?.dateOfBirth ? dayjs(record?.dateOfBirth).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Reporting person',
      dataIndex: 'reportingPerson',
      key: 'reportingPerson'
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      width: 100,
      render: (_, record: IUser) => (
        <>
          <Tooltip title="View user" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.usersView}/${record?.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit user" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => {
                setIsOpen(true);
                setUserData(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete user" placement="top" trigger="hover">
            <CommonModal
              title="Delete"
              content="Are you sure delete this user?"
              type="confirm"
              onConfirm={() => handleDeleteModal(record?.id)}
            >
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<DeleteOutlined />}
              />
            </CommonModal>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <>
      <CommonTable
        bordered
        columns={columns}
        dataSource={
          (userList?.result ?? []).length > 0
            ? userList?.result.map((item) => ({ ...item, key: item.id }))
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
              offset: (pageIndex - 1) * args.limit
            });
          }
        }}
        loading={isLoading}
        total={userList?.recordsTotal ?? 10}
      />
      {isOpen && (
        <AddEditUserModal
          isOpen={Boolean(isOpen)}
          setIsOpen={(flag) => setIsOpen(!!flag)}
          userData={userData}
        />
      )}
    </>
  );
};

export default UsersManagementTable;
