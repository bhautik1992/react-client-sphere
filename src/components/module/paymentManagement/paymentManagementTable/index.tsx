import { CustomTable, TableWrapper } from './style';

import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IInvoice } from 'services/api/invoice/types';
import { IPayment, IPaymentReq } from 'services/api/payment/types';
import { useDeletePayment, usePaymentList } from 'services/hooks/payment';
import { paymentKeys } from 'services/hooks/queryKeys';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { EmployeeRoleName, PaymentMethod } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

interface IProps {
  searchDebounce: string;
  args: IPaymentReq;
  setArgs: React.Dispatch<React.SetStateAction<IPaymentReq>>;
}

const PaymentManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employeeData } = authStore((state) => state);

  const { mutate: deleteMutate } = useDeletePayment();
  const { data: paymentList, isLoading } = usePaymentList({
    ...args,
    search: searchDebounce
  });
  const handleDeleteModal = (id: number) => {
    deleteMutate(id, {
      onSuccess: () => {
        // invalidate payment list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [paymentKeys.paymentList({ ...args, search: searchDebounce })].some((key) => {
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

  const columns: ColumnsType<IPayment> = [
    {
      title: 'Payment No',
      dataIndex: 'paymentNumber',
      key: 'paymentNumber',
      sorter: true,
      render: (_, record: IPayment) => <>{record?.paymentNumber ?? '-'}</>
    },
    {
      title: 'Payment Unique Id',
      dataIndex: 'uniquePaymentId',
      key: 'uniquePaymentId',
      sorter: true,
      render: (_, record: IPayment) => <>{record?.uniquePaymentId ?? '-'}</>
    },
    {
      title: 'Project',
      dataIndex: 'project.name',
      key: 'project.name',
      sorter: false,
      render: (_, record: IPayment) => <>{record?.project?.name ?? '-'}</>
    },
    {
      title: 'Client Name',
      dataIndex: 'client.firstName',
      key: 'client.firstName',
      sorter: false,
      render: (_, record: IPayment) => (
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
      render: (_, record: IPayment) => <>{record?.client?.clientCompanyName ?? '-'}</>
    },
    {
      title: 'Account Manager',
      dataIndex: 'accountManager',
      key: 'accountManager',
      sorter: false,
      render: (_, record: IPayment) => <>{record?.client?.accountManager?.firstName ?? '-'}</>
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      sorter: false,
      render: (_, record: IPayment) => (
        <>{PaymentMethod.find((method) => method.value === record?.paymentMethod)?.label ?? '-'}</>
      )
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      sorter: false,
      render: (_, record: IPayment) => <>{record?.comment ?? '-'}</>
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      sorter: false,
      render: (_, record: IPayment) => (
        <>{record?.paymentDate ? dayjs(record?.paymentDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      sorter: false,
      render: (_, record: IPayment) => <>{record?.project?.currency ?? '-'}</>
    },
    {
      title: 'Received Amount',
      dataIndex: 'receivedAmount',
      key: 'receivedAmount',
      sorter: false,
      render: (_, record: IPayment) => <>{record?.paymentAmount ? record?.paymentAmount : '-'}</>
    },
    {
      title: 'Received INR',
      dataIndex: 'receivedINR',
      key: 'receivedINR',
      sorter: false,
      render: (_, record: IPayment) => <>{record?.receivedINR ? record?.receivedINR : '-'}</>
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      sorter: false,
      render: (_, record: IPayment) => <>{record?.conversionRate ? record?.conversionRate : '-'}</>
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IPayment) => {
        if (record?.deletedAt) {
          return '-';
        }
        return (
          <div className="d-flex flex-row">
            <Tooltip title="View payment" placement="top" trigger="hover">
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<EyeOutlined />}
                onClick={() => navigate(`${ROUTES.paymentView}/${record?.id}`)}
              />
            </Tooltip>
            {employeeData?.role === EmployeeRoleName.Admin && (
              <Tooltip title="Delete payment" placement="top" trigger="hover">
                <CommonModal
                  title="Delete"
                  content="Are you sure delete this payment?"
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

  const expandedRowRender = (record: IPayment) => {
    const invoiceColumns: ColumnsType<IInvoice> = [
      {
        title: 'Invoice Number',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Invoice Date',
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        render: (_, invoice) =>
          invoice?.invoiceDate ? dayjs(invoice?.invoiceDate).format(DATE_FORMAT) : '-'
      },
      {
        title: 'Invoice Amount',
        dataIndex: 'amount',
        key: 'amount'
      },
      {
        title: 'Add Charge',
        dataIndex: 'additionalAmount',
        key: 'additionalAmount',
        render: (_, invoice) => <>{invoice?.additionalAmount ?? '-'}</>
      },
      {
        title: 'Total Amount',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (_, invoice) => {
          const totalAmount =
            (Number(invoice.amount) || 0) + (Number(invoice.additionalAmount) || 0);
          return totalAmount;
        }
      }
    ];

    return (
      <TableWrapper>
        <CustomTable
          bordered
          columns={invoiceColumns}
          dataSource={record?.invoices ?? []}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </TableWrapper>
    );
  };

  return (
    <CommonTable
      bordered
      columns={columns}
      dataSource={
        (paymentList?.result ?? []).length > 0
          ? paymentList?.result.map((item) => ({ ...item, key: item.id }))
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
      total={paymentList?.recordsTotal ?? 10}
      expandable={{
        expandedRowRender: expandedRowRender,
        rowExpandable: (record) => record.invoices?.length > 0
      }}
    />
  );
};

export default PaymentManagementTable;
