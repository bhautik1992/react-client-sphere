import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CommonTable } from 'components/common/Table';

import { IIncident, IIncidentReq } from 'services/api/incident/type';
import { HarmedUserType } from 'services/api/types';
import { useIncidentListByUserOrVolunteer } from 'services/hooks/incident';
import { useJsonFile } from 'services/hooks/jsonFile';

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

const UserIncidentManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();

  const { data: incidentList, isLoading } = useIncidentListByUserOrVolunteer({
    ...args,
    search: searchDebounce
  });
  const { data: jsonData } = useJsonFile(JsonFileType.incidentType);

  const titleFilters = jsonData?.map((item: any) => ({
    text: item.label,
    value: item.value
  }));

  const columns: ColumnsType<IIncident> = [
    {
      title: 'Incident happen with',
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
      title: 'Incident title',
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
      title: 'Location',
      dataIndex: 'place',
      key: 'place',
      sorter: true
    },
    {
      title: 'Report date',
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
        <Tooltip title="View incident" placement="top" trigger="hover">
          <Button
            type="text"
            size="small"
            className="cta_btn table_cta_btn"
            icon={<EyeOutlined />}
            onClick={() => navigate(`${ROUTES.incidentView}/${record?._id}`)}
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
        (incidentList?.result ?? []).length > 0
          ? incidentList?.result?.map((item) => ({ ...item, key: item?._id }))
          : []
      }
      currentPage={args.offset === 0 ? 1 : args.offset / 10 + 1}
      onChange={(pagination, filters, sorter, extra) => {
        const { columnKey, order } = sorter as SorterResult<any>; // Type assertion
        const pageIndex = pagination?.current ?? 1;
        const { status, type } = filters;
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
            status: status ?? [],
            type: type ?? []
          });
        }
      }}
      loading={isLoading}
      total={incidentList?.recordsTotal ?? 10}
    />
  );
};

export default UserIncidentManagementTable;
