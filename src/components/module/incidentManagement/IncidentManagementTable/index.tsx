import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IDashboardReq } from 'services/api/dashboard/types';
import { IIncident, IIncidentReq } from 'services/api/incident/type';
import { HarmedUserType } from 'services/api/types';
import { useIncidentDelete, useIncidentList } from 'services/hooks/incident';
import { useJsonFile } from 'services/hooks/jsonFile';
import { dashboardKey, incidentKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { JsonFileType } from 'utils/constants';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { statusFilterData } from 'utils/constants/filterData';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

interface IProps {
  searchDebounce: string;
  args: IIncidentReq;
  setArgs: React.Dispatch<React.SetStateAction<IIncidentReq>>;
}

const IncidentManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: incidentList, isLoading } = useIncidentList({ ...args, search: searchDebounce });
  const { mutate } = useIncidentDelete();
  const { data: jsonData } = useJsonFile(JsonFileType.incidentType);

  const titleFilters = useMemo(
    () =>
      jsonData?.map((item: any) => ({
        text: item.label,
        value: item.value
      })) ?? [],
    [jsonData]
  );

  const handleDeleteModal = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        // invalidate incident list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [incidentKeys.incidentList({ ...args, search: searchDebounce })].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // invalidate dashboard
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardCount({} as IDashboardReq)].some((key) => {
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

  const columns: ColumnsType<any> = [
    {
      title: 'Subscriber',
      dataIndex: 'userName',
      key: 'userName',
      sorter: true,
      render: (_: any, record: IIncident) => (
        <>{record?.type !== HarmedUserType.MYSELF ? record?.harmed : record?.userName}</>
      )
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true
    },
    {
      title: 'Incident type',
      dataIndex: 'type',
      key: 'type',
      sorter: true
    },
    {
      title: 'Incident Title',
      dataIndex: 'title',
      key: 'title',
      filters: titleFilters ?? [],
      sorter: true
    },
    {
      title: 'Responder',
      dataIndex: 'volunteer',
      key: 'volunteer',
      sorter: true,
      render: (_: any, record: IIncident) => <>{record?.volunteer ?? '-'}</>
    },
    {
      title: 'Incident date',
      dataIndex: 'incidentDateTime',
      key: 'incidentDateTime',
      sorter: true,
      render: (_, record: IIncident) => <>{dayjs(record?.incidentDateTime).format(DATE_FORMAT)}</>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusFilterData,
      render: (_, record: IIncident) => (
        <Tag className="table-status-tag" color={renderTagColor(record?.status)}>
          {record?.status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IIncident) => (
        <>
          <Tooltip title="View incident" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.incidentView}/${record?._id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete incident" placement="top" trigger="hover">
            <CommonModal
              title="Delete Incident"
              content="Are you sure delete incident?"
              type="confirm"
              onConfirm={() => handleDeleteModal(record?._id)}
            >
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<DeleteOutlined />}
                disabled={Boolean(record?.status !== 'Pending')}
              />
            </CommonModal>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <CommonTable
      bordered
      columns={columns}
      dataSource={
        (incidentList?.result ?? []).length > 0
          ? incidentList?.result?.map((item) => ({ ...item, key: item?._id }))
          : []
      }
      rowKey={(obj) => obj?._id}
      currentPage={args.offset === 0 ? 1 : args.offset / 10 + 1}
      onChange={(pagination, filters, sorter, extra) => {
        const { columnKey, order } = sorter as SorterResult<any>; // Type assertion
        const pageIndex = pagination?.current ?? 1;
        const { status, title } = filters;
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
            offset: (pageIndex - 1) * args.limit,
            status: status ?? [],
            type: title ?? []
          });
        }
      }}
      loading={isLoading}
      total={incidentList?.recordsTotal ?? 10}
    />
  );
};

export default IncidentManagementTable;
