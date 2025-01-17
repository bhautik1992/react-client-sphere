import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IClient, IClientReq } from 'services/api/client/types';
import { useClientList, useClientStatus, useDeleteClient } from 'services/hooks/client';
import { clientKeys } from 'services/hooks/queryKeys';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { EmployeeRoleName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import ClientStatusDropdown from 'utils/renderDropDownStatus/clientStatusDropDown';

interface IProps {
  args: IClientReq;
  setArgs: React.Dispatch<React.SetStateAction<IClientReq>>;
}

const ClientManagementTable: React.FC<IProps> = ({ args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employeeData } = authStore((state) => state);

  const { mutate: deleteMutate } = useDeleteClient();
  const { mutate: statusMutate } = useClientStatus();

  const { data: clientList, isLoading } = useClientList({
    ...args
  });

  const handleDeleteModal = (id: number) => {
    deleteMutate(id, {
      onSuccess: () => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [clientKeys.clientList({ ...args })].some((key) => {
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
      status: status,
      clientId: id
    };

    statusMutate(data, {
      onSuccess: (res) => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [clientKeys.clientList({ ...args })].some((key) => {
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
      title: 'Nick name',
      dataIndex: 'nickName',
      key: 'nickName',
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
      sorter: false,
      render: (_, record: IClient) => (
        <>{record?.phone && record?.phone?.length > 0 ? record?.phone : '-'}</>
      )
    },
    {
      title: 'Company name',
      dataIndex: 'company.id',
      key: 'company.id',
      sorter: false,
      render: (_, record: IClient) => <>{record?.company?.name ?? '-'}</>
    },
    {
      title: 'Account Manager',
      dataIndex: 'accountManager',
      key: 'accountManager',
      render: (_, record: IClient) => (
        <>
          {record?.accountManager?.firstName ?? '-'} {record?.accountManager?.lastName ?? '-'}
        </>
      )
    },
    {
      title: 'Country',
      dataIndex: 'countryName',
      key: 'countryName',
      render: (_, record: IClient) => <>{record?.countryName ?? '-'}</>
    },
    {
      title: 'Projects',
      dataIndex: 'projects',
      key: 'projects',
      render: (_, record: IClient) => <>{record?.projects?.length ?? 0}</>
    },
    {
      title: 'Active Projects',
      dataIndex: 'projects',
      key: 'projects',
      render: (_, record: IClient) => (
        <>{record?.projects?.filter((p) => p.status === 'started').length ?? 0}</>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: IClient) => (
        <ClientStatusDropdown
          status={record?.status ?? 'active'}
          clientId={record?.id ?? 0}
          onStatusChange={(newStatus, crId) => handleConfirm(newStatus, crId)}
        />
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IClient) => {
        if (record?.deletedAt) {
          return '-';
        }
        return (
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
                  navigate(`${ROUTES.clientEdit}/${record?.id}`);
                }}
              />
            </Tooltip>
            {employeeData?.role === EmployeeRoleName.Admin && (
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
            )}
          </div>
        );
      }
    }
  ];

  return (
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
  );
};

export default ClientManagementTable;
