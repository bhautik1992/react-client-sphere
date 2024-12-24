import { DeleteOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IInvoice, IInvoiceReq } from 'services/api/invoice/types';
import { useDeleteInvoice, useInvoiceList } from 'services/hooks/invoice';
import { invoiceKeys } from 'services/hooks/queryKeys';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { EmployeeRoleName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

interface IProps {
  searchDebounce: string;
  args: IInvoiceReq;
  setArgs: React.Dispatch<React.SetStateAction<IInvoiceReq>>;
}

const InvoiceManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employeeData } = authStore((state) => state);

  const { mutate: deleteMutate } = useDeleteInvoice();
  const { data: invoiceList, isLoading } = useInvoiceList({
    ...args,
    search: searchDebounce
  });
  const handleDeleteModal = (id: number) => {
    deleteMutate(id, {
      onSuccess: () => {
        // invalidate invoice list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [invoiceKeys.invoiceList({ ...args, search: searchDebounce })].some((key) => {
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

  const handleDownloadInvoice = (id: number) => {
    console.log('id: ', id);
  };

  const columns: ColumnsType<IInvoice> = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      sorter: true,
      render: (_, record: IInvoice) => <>{record?.invoiceNumber ?? '-'}</>
    },
    {
      title: 'Custom Invoice Number',
      dataIndex: 'customInvoiceNumber',
      key: 'customInvoiceNumber',
      sorter: true,
      render: (_, record: IInvoice) => <>{record?.customInvoiceNumber ?? '-'}</>
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      sorter: true,
      render: (_, record: IInvoice) => (
        <>{record?.invoiceDate ? dayjs(record?.invoiceDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: false,
      render: (_, record: IInvoice) => (
        <>{record?.dueDate ? dayjs(record?.dueDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Client Name',
      dataIndex: 'client.firstName',
      key: 'client.firstName',
      sorter: false,
      render: (_, record: IInvoice) => (
        <>
          {record?.client?.firstName ?? '-'} {record?.client?.lastName ?? '-'}
        </>
      )
    },
    {
      title: 'Client Company',
      dataIndex: 'client.company.name',
      key: 'client.company.name',
      sorter: false,
      render: (_, record: IInvoice) => <>{record?.client?.clientCompanyName ?? '-'}</>
    },
    {
      title: 'Project',
      dataIndex: 'project.name',
      key: 'project.name',
      sorter: false,
      render: (_, record: IInvoice) => <>{record?.project?.name ?? '-'}</>
    },
    {
      title: 'Cr(s)',
      dataIndex: 'crs',
      key: 'crs',
      sorter: false,
      width: 100,
      render: (_, record: IInvoice) => (
        <div>
          {record?.crs?.length > 0
            ? record.crs.map((cr) => <div key={cr.id}>{' - ' + cr.name}</div>)
            : '-'}
        </div>
      )
    },
    {
      title: 'Milestone(s)',
      dataIndex: 'milestones',
      key: 'milestones',
      sorter: false,
      width: 100,
      render: (_, record: IInvoice) => (
        <div>
          {record?.project?.milestones?.length > 0
            ? record?.project.milestones.map((milestone) => (
                <div key={milestone.id}>{' - ' + milestone.name}</div>
              ))
            : '-'}
        </div>
      )
    },
    {
      title: 'Account Manager',
      dataIndex: 'accountManager',
      key: 'accountManager',
      sorter: false,
      render: (_, record: IInvoice) => <>{record?.client?.accountManager ?? '-'}</>
    },
    {
      title: 'Project Amount',
      dataIndex: 'projectAmount',
      key: 'projectAmount',
      sorter: false,
      render: (_, record: IInvoice) => <>{record?.project?.projectCost ?? '-'}</>
    },
    {
      title: 'Additional charge',
      dataIndex: 'addCharge',
      key: 'addCharge',
      sorter: false,
      render: (_, record: IInvoice) => <>{record?.additionalAmount ?? '-'}</>
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: false,
      render: (_, record: IInvoice) => <>{+record?.amount + +record?.additionalAmount}</>
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      sorter: false,
      render: (_, record: IInvoice) => <>{record?.project?.currency ?? '-'}</>
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IInvoice) => (
        <div className="d-flex flex-row">
          <Tooltip title="View invoice" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.invoiceView}/${record?.id}`)}
            />
          </Tooltip>
          <Tooltip title="download invoice" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadInvoice(record?.id)}
            />
          </Tooltip>
          {(employeeData?.role === EmployeeRoleName.Admin ||
            employeeData?.role === EmployeeRoleName.Sales_Executive ||
            employeeData?.role === EmployeeRoleName.Sales_Manager) && (
            <Tooltip title="Delete invoice" placement="top" trigger="hover">
              <CommonModal
                title="Delete"
                content="Are you sure delete this invoice?"
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
      )
    }
  ];

  return (
    <CommonTable
      bordered
      columns={columns}
      dataSource={
        (invoiceList?.result ?? []).length > 0
          ? invoiceList?.result.map((item) => ({ ...item, key: item.id }))
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
      total={invoiceList?.recordsTotal ?? 10}
    />
  );
};

export default InvoiceManagementTable;
