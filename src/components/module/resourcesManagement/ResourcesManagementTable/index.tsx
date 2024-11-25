import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IResource, IResourceReq } from 'services/api/resources/types';
import { resourceKeys } from 'services/hooks/queryKeys';
import { useDeleteResource, useResourceList } from 'services/hooks/resource';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';

interface IProps {
  searchDebounce: string;
  args: IResourceReq;
  setArgs: React.Dispatch<React.SetStateAction<IResourceReq>>;
}

const ResourcesManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: resourceList, isLoading } = useResourceList({ ...args, search: searchDebounce });
  const { mutate } = useDeleteResource();

  const handleDeleteModal = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        // invalidate resource list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [resourceKeys.resourceList({ ...args, search: searchDebounce })].some((key) => {
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

  const columns: ColumnsType<IResource> = [
    {
      title: 'Resources type',
      dataIndex: 'resourceType',
      key: 'resourceType',
      sorter: true
    },
    {
      title: 'Title text',
      dataIndex: 'title',
      key: 'title',
      sorter: true
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      sorter: true
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IResource) => (
        <>
          <Tooltip title="View resource" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.resourcesView}/${record?._id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit resource" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => navigate(`${ROUTES.resourcesEdit}/${record?._id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete resource" placement="top" trigger="hover">
            <CommonModal
              title="Delete"
              content="Are you sure delete this resource?"
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
        </>
      )
    }
  ];

  return (
    <CommonTable
      bordered
      columns={columns}
      dataSource={
        (resourceList?.result ?? []).length > 0
          ? resourceList?.result?.map((item) => ({ ...item, key: item._id }))
          : []
      }
      rowKey={(obj) => obj?._id}
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
      total={resourceList?.recordsTotal ?? 10}
    />
  );
};

export default ResourcesManagementTable;
