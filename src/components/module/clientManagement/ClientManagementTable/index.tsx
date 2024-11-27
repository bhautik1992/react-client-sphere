import { DeleteOutlined, DownOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Tag, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddClientModal from 'components/common/Modal/AddClientModal';
import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IClient, IClientReq } from 'services/api/client/types';
import { useClientList, useClientStatus, useDeleteClient } from 'services/hooks/client';
import { clientKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

interface IProps {
  searchDebounce: string;
  args: IClientReq;
  setArgs: React.Dispatch<React.SetStateAction<IClientReq>>;
}

const ClientManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useDeleteClient();
  const { mutate: statusMutate } = useClientStatus();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [clientData, setClientData] = useState<IClient | null>(null);

  const { data: clientList, isLoading } = useClientList({
    ...args,
    search: searchDebounce
  });

  const handleDeleteModal = (id: number) => {
    deleteMutate(id, {
      onSuccess: () => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [clientKeys.clientList({ ...args, search: searchDebounce })].some((key) => {
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

  const handleConfirm = (status: string, id: number) => {
    const data = {
      status: status === 'active' ? 'inactive' : 'active',
      clientId: id
    };

    statusMutate(data, {
      onSuccess: (res) => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [clientKeys.clientList({ ...args, search: searchDebounce })].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });
        // set status in client detail
        queryClient.setQueryData<IClient>(clientKeys.clientDetail(id ?? 0), () => {
          return { ...res } as unknown as IClient;
        });
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  const columns: ColumnsType<IClient> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true
    },

    {
      title: 'Phone number',
      dataIndex: 'phone',
      key: 'phone',
      sorter: true,
      render: (_, record: IClient) => (
        <>{record?.phone && record?.phone?.length > 0 ? record?.phone : '-'}</>
      )
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      sorter: true,
      render: (_, record: IClient) => (
        <>{record?.address && record?.address?.length > 0 ? record?.address : '-'}</>
      )
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: true,
      render: (_, record: IClient) => <>{record?.gender ?? '-'}</>
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: true,
      render: (_, record: IClient) => <>{record?.country?.name ?? '-'}</>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: IClient) => (
        <Popconfirm
          title="Status"
          placement="left"
          description={`Are you sure to ${
            record?.status === 'active' ? 'inactive' : 'active'
          } this client?`}
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleConfirm(record?.status, record?.id)}
        >
          <Tag className="table-status-tag" color={renderTagColor(record?.status === 'active')}>
            {record?.status === 'active' ? 'Active' : 'Inactive'} <DownOutlined />
          </Tag>
        </Popconfirm>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IClient) => (
        <div className="d-flex flex-row">
          <Tooltip title="View client" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.clientView}/${record?.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit client" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => {
                setIsOpen(true);
                setClientData(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete client" placement="top" trigger="hover">
            <CommonModal
              title="Delete"
              content="Are you sure delete this client?"
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
          (clientList?.result ?? []).length > 0
            ? clientList?.result.map((item) => ({ ...item, key: item.id }))
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
        total={clientList?.recordsTotal ?? 10}
      />
      {isOpen && (
        <AddClientModal
          isOpen={Boolean(isOpen)}
          setIsOpen={(flag) => setIsOpen(!!flag)}
          clientData={clientData}
        />
      )}
    </>
  );
};

export default ClientManagementTable;
