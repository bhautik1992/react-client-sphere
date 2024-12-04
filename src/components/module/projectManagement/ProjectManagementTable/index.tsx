import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddProjectModal from 'components/common/Modal/AddProjectModal';
import CommonModal from 'components/common/Modal/CommonModal';
import { CommonTable } from 'components/common/Table';

import { IProject, IProjectReq } from 'services/api/project/types';
import { useDeleteProject, useProjectList, useProjectStatus } from 'services/hooks/project';
import { projectKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { BillingType, InvoiceStatus } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import ProjectStatusDropdown from 'utils/projectStatusDropDown';

interface IProps {
  searchDebounce: string;
  args: IProjectReq;
  setArgs: React.Dispatch<React.SetStateAction<IProjectReq>>;
}

const ProjectManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useDeleteProject();
  const { mutate: statusMutate } = useProjectStatus();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [projectData, setProjectData] = useState<IProject | null>(null);

  const { data: projectList, isLoading } = useProjectList({
    ...args,
    search: searchDebounce
  });
  const handleDeleteModal = (id: number) => {
    deleteMutate(id, {
      onSuccess: () => {
        // invalidate project list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [projectKeys.projectList({ ...args, search: searchDebounce })].some((key) => {
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
      projectId: id
    };

    statusMutate(data, {
      onSuccess: (res) => {
        // invalidate project list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [projectKeys.projectList({ ...args, search: searchDebounce })].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });
        // set status in client detail
        queryClient.setQueryData<IProject>(projectKeys.projectDetail(id ?? 0), () => {
          return { ...res } as unknown as IProject;
        });
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  const columns: ColumnsType<IProject> = [
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
      render: (_, record: IProject) => (
        <>{record?.startDate ? dayjs(record?.startDate).format(DATE_FORMAT) : '-'}</>
      )
    },

    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: true,
      render: (_, record: IProject) => (
        <>{record?.endDate ? dayjs(record?.endDate).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Client Name',
      dataIndex: 'client.firstName',
      key: 'client.firstName',
      sorter: false,
      render: (_, record: IProject) => (
        <>
          {record?.client?.firstName ?? '-'} {record?.client?.lastName ?? '-'}
        </>
      )
    },
    {
      title: 'Company Name',
      dataIndex: 'client.companyName',
      key: 'client.companyName',
      sorter: false,
      render: (_, record: IProject) => <>{record?.client?.companyName ?? '-'}</>
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      key: 'projectManager',
      sorter: true,
      render: (_, record: IProject) => <>{record?.projectManager ?? '-'}</>
    },
    {
      title: 'Billing Type',
      dataIndex: 'billingType',
      key: 'billingType',
      sorter: false,
      render: (_, record: IProject) => (
        <>{BillingType.find((item) => item.value === record.billingType)?.label ?? '-'}</>
      )
    },
    {
      title: 'Hourly Rate',
      dataIndex: 'hourlyMonthlyRate',
      key: 'hourlyMonthlyRate',
      sorter: false,
      render: (_, record: IProject) => <>{record?.hourlyMonthlyRate ?? '-'}</>
    },
    {
      title: 'Project Hours',
      dataIndex: 'projectHours',
      key: 'projectHours',
      sorter: false,
      render: (_, record: IProject) => <>{record?.projectHours ?? '-'}</>
    },
    {
      title: 'Invoice Status',
      dataIndex: 'invoiceStatus',
      key: 'invoiceStatus',
      sorter: false,
      render: (_, record: IProject) => (
        <>{InvoiceStatus.find((item) => item.value === record?.invoiceStatus)?.label ?? '-'}</>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: IProject) => (
        <ProjectStatusDropdown
          status={record.status}
          projectId={record.id}
          onStatusChange={(newStatus, projectId) => handleConfirm(newStatus, projectId)}
        />
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: IProject) => (
        <div className="d-flex flex-row">
          <Tooltip title="View project" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.projectView}/${record?.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit project" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => {
                setIsOpen(true);
                setProjectData(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete project" placement="top" trigger="hover">
            <CommonModal
              title="Delete"
              content="Are you sure delete this project?"
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
          (projectList?.result ?? []).length > 0
            ? projectList?.result.map((item) => ({ ...item, key: item.id }))
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
        total={projectList?.recordsTotal ?? 10}
      />
      {isOpen && (
        <AddProjectModal
          isOpen={Boolean(isOpen)}
          setIsOpen={(flag) => setIsOpen(!!flag)}
          projectData={projectData}
        />
      )}
    </>
  );
};

export default ProjectManagementTable;
