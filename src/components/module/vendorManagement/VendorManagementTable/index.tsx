import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IVendor, IVendorReq } from 'services/api/vendor/types';
import { vendorKeys } from 'services/hooks/queryKeys';
import { useDeleteVendor, useVendorList } from 'services/hooks/vendor';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { EmployeeRoleName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

interface IProps {
  searchDebounce: string;
  args: IVendorReq;
  setArgs: React.Dispatch<React.SetStateAction<IVendorReq>>;
}

const VendorManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employeeData } = authStore((state) => state);

  const { mutate: deleteMutate } = useDeleteVendor();
  const { data: vendorList, isLoading } = useVendorList({
    ...args,
    search: searchDebounce
  });

  const handleDeleteModal = (id: number) => {
    deleteMutate(id, {
      onSuccess: () => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [vendorKeys.vendorList({ ...args, search: searchDebounce })].some((key) => {
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

  const columns: ColumnsType<IVendor> = [
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
      render: (_, record: IVendor) => (
        <>{record?.phone && record?.phone?.length > 0 ? record?.phone : '-'}</>
      )
    },
    {
      title: 'Company name',
      dataIndex: 'company.id',
      key: 'company.id',
      sorter: false,
      render: (_, record: IVendor) => <>{record?.company?.name ?? '-'}</>
    },
    {
      title: 'Vendor Company Name',
      dataIndex: 'vendorCompanyName',
      key: 'vendorCompanyName',
      sorter: false,
      render: (_, record: IVendor) => <>{record?.vendorCompanyName ?? '-'}</>
    },
    {
      title: 'Account Manager',
      dataIndex: 'accountManager',
      key: 'accountManager',
      render: (_, record: IVendor) => <>{record?.accountManager ?? '-'}</>
    },
    {
      title: 'Country',
      dataIndex: 'countryName',
      key: 'countryName',
      render: (_, record: IVendor) => <>{record?.countryName ?? '-'}</>
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IVendor) => {
        if (record?.deletedAt) {
          return '-';
        }
        return (
          <div className="d-flex flex-row">
            <Tooltip title="View vendor" placement="top" trigger="hover">
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<EyeOutlined />}
                onClick={() => navigate(`${ROUTES.vendorView}/${record?.id}`)}
              />
            </Tooltip>
            <Tooltip title="Edit vendor" placement="top" trigger="hover">
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<EditOutlined />}
                onClick={() => {
                  navigate(`${ROUTES.vendorEdit}/${record?.id}`);
                }}
              />
            </Tooltip>
            {(employeeData?.role === EmployeeRoleName.Admin ||
              employeeData?.role === EmployeeRoleName.Sales_Executive ||
              employeeData?.role === EmployeeRoleName.Sales_Manager) && (
              <Tooltip title="Delete vendor" placement="top" trigger="hover">
                <CommonModal
                  title="Delete"
                  content="Are you sure delete this vendor?"
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
        (vendorList?.result ?? []).length > 0
          ? vendorList?.result.map((item) => ({ ...item, key: item.id }))
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
      total={vendorList?.recordsTotal ?? 10}
    />
  );
};

export default VendorManagementTable;
