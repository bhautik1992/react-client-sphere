import { EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CommonTable } from 'components/common/Table';

import { IUser, IUserListReq } from 'services/api/user/types';
import { useConsentFormList } from 'services/hooks/consentForm';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';

interface IProps {
  searchDebounce: string;
  args: IUserListReq;
  setArgs: React.Dispatch<React.SetStateAction<IUserListReq>>;
}

const ConsentFormTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const { data: userList, isLoading } = useConsentFormList({
    ...args,
    search: searchDebounce
  });

  const columns: ColumnsType<any> = [
    {
      title: 'Children Name',
      dataIndex: 'childName',
      key: 'childName',
      sorter: true
    },
    {
      title: 'Children Dob',
      dataIndex: 'dob',
      key: 'dob',
      sorter: true,
      render: (_, record: any) => <>{record?.dob ? dayjs(record?.dob).format(DATE_FORMAT) : '-'}</>
    },
    {
      title: 'Parent Name',
      dataIndex: 'parentName',
      key: 'parentName',
      sorter: true
    },
    {
      title: 'Relation to Child',
      dataIndex: 'relationToChild',
      key: 'relationToChild',
      sorter: true
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true
    },
    {
      title: 'Verified By',
      dataIndex: 'verifiedBy',
      key: 'address',
      sorter: true,
      render: (_, record: any) => <>{record?.verifiedBy ? record?.verifiedBy : '-'}</>
    },
    {
      title: 'Verify Date',
      dataIndex: 'verifyDate',
      key: 'verifyDate',
      sorter: true,
      render: (_, record: any) => (
        <>{record?.verifyDate ? dayjs(record?.verifyDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IUser) => (
        <Tooltip title="View Subscriber" placement="top" trigger="hover">
          <Button
            type="text"
            size="small"
            className="cta_btn table_cta_btn"
            icon={<EyeOutlined />}
            onClick={() => navigate(`${ROUTES.consentFormView}/${record?._id}`)}
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

export default ConsentFormTable;
