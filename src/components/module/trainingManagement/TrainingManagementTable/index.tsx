import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { ITraining, ITrainingReq } from 'services/api/training/types';
import { trainingKeys } from 'services/hooks/queryKeys';
import { useDeleteTraining, useTrainingList } from 'services/hooks/training';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

interface IProps {
  searchDebounce: string;
  args: ITrainingReq;
  setArgs: React.Dispatch<React.SetStateAction<ITrainingReq>>;
}

const TrainingManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: trainingList, isLoading } = useTrainingList({ ...args, search: searchDebounce });
  const { mutate } = useDeleteTraining();

  const handleDeleteModal = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        // invalidate training list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [trainingKeys.trainingList({ ...args, search: searchDebounce })].some((key) => {
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

  const columns: ColumnsType<ITraining> = [
    {
      title: 'Training title',
      dataIndex: 'title',
      key: 'title',
      sorter: true
    },
    {
      title: 'Training description',
      dataIndex: 'description',
      key: 'description',
      sorter: true
    },
    {
      title: 'Date created',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: true,
      render: (_, record: ITraining) => (
        <>{record?.startDate ? dayjs(record?.startDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: ITraining) => (
        <Tag className="table-status-tag" color={renderTagColor(record?.status)}>
          {record?.status ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      width: 100,
      render: (_, record: ITraining) => (
        <div className="d-flex flex-row">
          <Tooltip title="View training" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.trainingView}/${record?._id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit training" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => navigate(`${ROUTES.trainingEdit}/${record?._id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete training" placement="top" trigger="hover">
            <CommonModal
              title="Delete"
              content="Are you sure delete this training program?"
              type="confirm"
              onConfirm={() => handleDeleteModal(record?._id)}
            >
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<DeleteOutlined />}
              />
            </CommonModal>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <CommonTable
      bordered
      columns={columns}
      dataSource={
        (trainingList?.result ?? []).length > 0
          ? trainingList?.result.map((item) => ({ ...item, key: item._id }))
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
      total={trainingList?.recordsTotal ?? 10}
    />
  );
};

export default TrainingManagementTable;
