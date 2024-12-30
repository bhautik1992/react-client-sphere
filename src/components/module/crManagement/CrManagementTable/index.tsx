import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { ICr, ICrReq } from 'services/api/cr/types';
import { useCrList, useCrStatus, useDeleteCr } from 'services/hooks/cr';
import { crKeys } from 'services/hooks/queryKeys';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { BillingType, EmployeeRoleName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import CrStatusDropdown from 'utils/renderDropDownStatus/crStatusDropDown';

interface IProps {
  args: ICrReq;
  setArgs: React.Dispatch<React.SetStateAction<ICrReq>>;
}

const CrManagementTable: React.FC<IProps> = ({ args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employeeData } = authStore((state) => state);

  const { mutate: deleteMutate } = useDeleteCr();
  const { mutate: statusMutate } = useCrStatus();

  const { data: crList, isLoading } = useCrList({
    ...args
  });
  const handleDeleteModal = (id: number) => {
    deleteMutate(id, {
      onSuccess: () => {
        // invalidate cr list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [crKeys.crList({ ...args })].some((key) => {
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
      status,
      crId: id
    };

    statusMutate(data, {
      onSuccess: (res) => {
        // invalidate cr list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [crKeys.crList({ ...args })].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });
        // set status in client detail
        queryClient.setQueryData<ICr>(crKeys.crDetail(id ?? 0), () => {
          return { ...res } as unknown as ICr;
        });
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  const columns: ColumnsType<ICr> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: true,
      render: (_, record: ICr) => (
        <>{record?.startDate ? dayjs(record?.startDate).format(DATE_FORMAT) : '-'}</>
      )
    },

    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: true,
      render: (_, record: ICr) => (
        <>{record?.endDate ? dayjs(record?.endDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      sorter: false,
      render: (_, record: ICr) => <>{record?.project?.name ?? '-'}</>
    },
    {
      title: 'Client Name',
      dataIndex: 'client.firstName',
      key: 'client.firstName',
      sorter: false,
      render: (_, record: ICr) => (
        <>
          {record?.client?.firstName ?? '-'} {record?.client?.lastName ?? '-'}
        </>
      )
    },
    {
      title: 'Billing Type',
      dataIndex: 'billingType',
      key: 'billingType',
      sorter: false,
      render: (_, record: ICr) => (
        <>{BillingType.find((item) => item.value === record.billingType)?.label ?? '-'}</>
      )
    },
    {
      title: 'Hourly Rate',
      dataIndex: 'hourlyMonthlyRate',
      key: 'hourlyMonthlyRate',
      sorter: false,
      render: (_, record: ICr) => <>{record?.hourlyMonthlyRate ?? '-'}</>
    },
    {
      title: 'Cr Hours',
      dataIndex: 'crHours',
      key: 'crHours',
      sorter: false,
      render: (_, record: ICr) => <>{record?.crHours ?? '-'}</>
    },
    {
      title: 'Total Cost',
      dataIndex: 'crCost',
      key: 'crCost',
      sorter: false,
      render: (_, record: ICr) => <>{record?.crCost ?? '-'}</>
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      sorter: false,
      render: (_, record: ICr) => <>{record?.currency ?? '-'}</>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: ICr) => (
        <CrStatusDropdown
          status={record.status}
          crId={record.id}
          onStatusChange={(newStatus, crId) => handleConfirm(newStatus, crId)}
        />
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: ICr) => {
        if (record?.deletedAt) {
          return '-';
        }
        return (
          <div className="d-flex flex-row">
            <Tooltip title="View cr" placement="top" trigger="hover">
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<EyeOutlined />}
                onClick={() => navigate(`${ROUTES.crView}/${record?.id}`)}
              />
            </Tooltip>
            <Tooltip title="Edit cr" placement="top" trigger="hover">
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<EditOutlined />}
                onClick={() => {
                  navigate(`${ROUTES.crEdit}/${record?.id}`);
                }}
              />
            </Tooltip>
            {(employeeData?.role === EmployeeRoleName.Admin ||
              employeeData?.role === EmployeeRoleName.Sales_Executive ||
              employeeData?.role === EmployeeRoleName.Sales_Manager) && (
              <Tooltip title="Delete cr" placement="top" trigger="hover">
                <CommonModal
                  title="Delete"
                  content="Are you sure delete this cr?"
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
        (crList?.result ?? []).length > 0
          ? crList?.result.map((item) => ({ ...item, key: item.id }))
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
      total={crList?.recordsTotal ?? 10}
    />
  );
};

export default CrManagementTable;
