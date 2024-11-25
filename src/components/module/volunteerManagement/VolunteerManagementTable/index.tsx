import { DownOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddVolunteerModal from 'components/common/Modal/AddVolunteerModal';
import { CommonTable } from 'components/common/Table';

import { IVolunteer, IVolunteerReq } from 'services/api/volunteer/types';
import { useJsonFile } from 'services/hooks/jsonFile';
import { volunteerKeys } from 'services/hooks/queryKeys';
import { useVolunteerList, useVolunteerStatus } from 'services/hooks/volunteer';

import { IApiError } from 'utils/Types';
import { JsonFileType } from 'utils/constants';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

interface IProps {
  searchDebounce: string;
  args: IVolunteerReq;
  setArgs: React.Dispatch<React.SetStateAction<IVolunteerReq>>;
}

const VolunteerManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useVolunteerStatus();
  const { data: jsonData } = useJsonFile(JsonFileType.responderCategory);
  const titleFilters = useMemo(
    () =>
      jsonData?.map((item: any) => ({
        text: item.label,
        value: item.value
      })) ?? [],
    [jsonData]
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [volunteerData, setVolunteerData] = useState<IVolunteer | null>(null);

  const { data: volunteerList, isLoading } = useVolunteerList({
    ...args,
    search: searchDebounce
  });

  const handleConfirm = (status: boolean, id: string) => {
    const data = {
      status: !status,
      userId: id
    };

    mutate(data, {
      onSuccess: (res) => {
        // invalidate volunteer list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [volunteerKeys.volunteerList({ ...args, search: searchDebounce })].some(
              (key) => {
                return (
                  (query.options.queryKey?.[0] as string) ?? query.options.queryKey
                )?.includes(key[0]);
              }
            );
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

  const columns: ColumnsType<IVolunteer> = [
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
      title: 'Email address',
      dataIndex: 'email',
      key: 'email',
      sorter: true
    },

    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true,
      render: (_, record: IVolunteer) => (
        <>{record?.phoneNumber && record?.phoneNumber?.length > 0 ? record?.phoneNumber : '-'}</>
      )
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      sorter: true,
      render: (_, record: IVolunteer) => (
        <>{record?.address && record?.address?.length > 0 ? record?.address : '-'}</>
      )
    },
    {
      title: 'Date of birth',
      dataIndex: 'birthDate',
      key: 'birthDate',
      sorter: true,
      render: (_, record: IVolunteer) => (
        <>{record?.birthDate ? dayjs(record?.birthDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: true,
      render: (_, record: IVolunteer) => <>{record?.gender ?? '-'}</>
    },
    {
      title: 'Category',
      dataIndex: 'designation',
      key: 'designation',
      filters: titleFilters ?? [],
      sorter: true,
      render: (_, record: IVolunteer) => <>{record?.designation ?? '-'}</>
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (_, record: IVolunteer) => (
        <Popconfirm
          title="Status"
          placement="left"
          description={`Are you sure to ${
            record?.isActive ? 'inactive' : 'active'
          } this responder?`}
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
      render: (_, record: IVolunteer) => (
        <div className="d-flex flex-row">
          <Tooltip title="View responder" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.volunteerView}/${record?._id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit responder" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => {
                setIsOpen(true);
                setVolunteerData(record);
              }}
            />
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <>
      <CommonTable
        bordered
        columns={columns}
        dataSource={
          (volunteerList?.result ?? []).length > 0
            ? volunteerList?.result?.map((item) => ({ ...item, key: item._id }))
            : []
        }
        currentPage={args.offset === 0 ? 1 : args.offset / 10 + 1}
        onChange={(pagination, filters, sorter, extra) => {
          console.log('🚀 ~ filters:', filters);
          const { designation } = filters;
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
              offset: 0,
              category: designation
            });
          }
        }}
        loading={isLoading}
        total={volunteerList?.recordsTotal ?? 10}
        scroll={{ x: true }}
      />
      {isOpen && (
        <AddVolunteerModal
          isOpen={Boolean(isOpen)}
          setIsOpen={(flag) => setIsOpen(!!flag)}
          volunteerData={volunteerData}
        />
      )}
    </>
  );
};

export default VolunteerManagementTable;
