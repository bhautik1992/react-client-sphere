import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IEmployee, IEmployeeReq } from 'services/api/employee/types';
import { useDeleteEmployee, useEmployeeList, useEmployeeStatus } from 'services/hooks/employee';
import { dashboardKey, employeeKeys } from 'services/hooks/queryKeys';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { Department, EmployeeRole, EmployeeRoleName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import EmployeeStatusDropdown from 'utils/renderDropDownStatus/employeeStatusDropdown';

interface IProps {
  searchDebounce: string;
  args: IEmployeeReq;
  setArgs: React.Dispatch<React.SetStateAction<IEmployeeReq>>;
}

const EmployeesManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employeeData } = authStore((state) => state);

  const { data: employeeList, isLoading } = useEmployeeList({ ...args, search: searchDebounce });
  const { mutate } = useDeleteEmployee();
  const { mutate: statusMutate } = useEmployeeStatus();

  const handleConfirm = (status: string, id: number) => {
    const data = {
      status,
      id
    };

    statusMutate(data, {
      onSuccess: (res) => {
        // invalidate project list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [employeeKeys.employeeList({ ...args, search: searchDebounce })].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });
        // set status in client detail
        queryClient.setQueryData<IEmployee>(employeeKeys.employeeDetail(id ?? 0), () => {
          return { ...res } as unknown as IEmployee;
        });

        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardEmployee].some((key) => {
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

  const handleDeleteModal = (id: number) => {
    mutate(id, {
      onSuccess: () => {
        // invalidate employee list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [employeeKeys.employeeList({ ...args, search: searchDebounce })].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardEmployee].some((key) => {
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

  const columns: ColumnsType<IEmployee> = [
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      sorter: true
    },
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true
    },
    {
      title: 'Middle name',
      dataIndex: 'middleName',
      key: 'middleName',
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
      sorter: false
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: false,
      render: (_, record: IEmployee) => (
        <>{EmployeeRole.find((role) => role.value === record?.role)?.label ?? '-'}</>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: true,
      render: (_, record: IEmployee) => (
        <>{Department.find((role) => role.value === record?.department)?.label ?? '-'}</>
      )
    },
    {
      title: 'Reporting Person',
      dataIndex: 'reportingPerson',
      key: 'reportingPerson',
      sorter: true,
      render: (_, record: IEmployee) => (
        <>
          {record?.reportingPerson
            ? `${record?.reportingPerson?.firstName} ${record?.reportingPerson?.lastName}`
            : '-'}
        </>
      )
    },
    {
      title: 'Date of joining',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      render: (_, record: IEmployee) => (
        <>{record?.joiningDate ? dayjs(record?.joiningDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Date of birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (_, record: IEmployee) => (
        <>{record?.dateOfBirth ? dayjs(record?.dateOfBirth).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'PAN Number',
      dataIndex: 'PAN',
      key: 'PAN',
      sorter: false
    },
    {
      title: 'Aadhar Number',
      dataIndex: 'aadhar',
      key: 'aadhar',
      sorter: false
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: IEmployee) => (
        <EmployeeStatusDropdown
          status={record.status}
          employeeId={record.id}
          onStatusChange={(newStatus, employeeId) => handleConfirm(newStatus, employeeId)}
        />
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IEmployee) => {
        if (record?.deletedAt) {
          return '-';
        }
        return (
          <div className="d-flex flex-row">
            <Tooltip title="View employee" placement="top" trigger="hover">
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<EyeOutlined />}
                onClick={() => navigate(`${ROUTES.employeeView}/${record?.id}`)}
              />
            </Tooltip>
            <Tooltip title="Edit employee" placement="top" trigger="hover">
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<EditOutlined />}
                onClick={() => {
                  navigate(`${ROUTES.employeeEdit}/${record?.id}`);
                }}
              />
            </Tooltip>
            {employeeData?.role === EmployeeRoleName.Admin && (
              <Tooltip title="Delete employee" placement="top" trigger="hover">
                <CommonModal
                  title="Delete"
                  content="Are you sure delete this employee?"
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
        (employeeList?.result ?? []).length > 0
          ? employeeList?.result.map((item) => ({ ...item, key: item.id }))
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
      total={employeeList?.recordsTotal ?? 10}
    />
  );
};

export default EmployeesManagementTable;
