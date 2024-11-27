import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddEditCompanyModal from 'components/common/Modal/AddCompanyModal';
import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { ICompany, ICompanyReq } from 'services/api/company/types';
import { useCompanyList, useDeleteCompany } from 'services/hooks/company';
import { companyKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';

interface IProps {
  searchDebounce: string;
  args: ICompanyReq;
  setArgs: React.Dispatch<React.SetStateAction<ICompanyReq>>;
}

const CompanyManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [companyData, setCompanyData] = useState<ICompany | null>(null);

  const { data: companyList, isLoading } = useCompanyList({ ...args, search: searchDebounce });
  const { mutate } = useDeleteCompany();

  const handleDeleteModal = (id: number) => {
    mutate(id, {
      onSuccess: () => {
        // invalidate company list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [companyKeys.companyList({ ...args, search: searchDebounce })].some((key) => {
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

  const columns: ColumnsType<ICompany> = [
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
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: true
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: true,
      render: (_, record: ICompany) => <>{record?.country?.name ?? '-'}</>
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: ICompany) => (
        <>
          <Tooltip title="View company" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.companyView}/${record?.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit company" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => {
                setIsOpen(true);
                setCompanyData(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete company" placement="top" trigger="hover">
            <CommonModal
              title="Delete"
              content="Are you sure delete this company?"
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
        </>
      )
    }
  ];

  return (
    <>
      <CommonTable
        bordered
        columns={columns}
        dataSource={
          (companyList?.result ?? []).length > 0
            ? companyList?.result.map((item) => ({ ...item, key: item.id }))
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
        total={companyList?.recordsTotal ?? 10}
      />
      {isOpen && (
        <AddEditCompanyModal
          isOpen={Boolean(isOpen)}
          setIsOpen={(flag) => setIsOpen(!!flag)}
          companyData={companyData}
        />
      )}
    </>
  );
};

export default CompanyManagementTable;
