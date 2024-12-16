import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PauseOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CommonModal from 'components/common/Modal/CommonModal';
import ProjectInfoTable from 'components/common/Modal/ProjectInfoModal';
import { CommonTable } from 'components/common/Table';

import { IProject, IProjectReq } from 'services/api/project/types';
import { useDeleteProject, useProjectList, useProjectStatus } from 'services/hooks/project';
import { projectKeys } from 'services/hooks/queryKeys';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { BillingType, EmployeeRoleName, ProjectStatusName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import ProjectStatusDropdown from 'utils/renderDropDownStatus/projectStatusDropDown';

interface IProps {
  searchDebounce: string;
  args: IProjectReq;
  setArgs: React.Dispatch<React.SetStateAction<IProjectReq>>;
}

const ProjectManagementTable: React.FC<IProps> = ({ searchDebounce, args, setArgs }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { employeeData } = authStore((state) => state);

  const { mutate: deleteMutate } = useDeleteProject();
  const { mutate: statusMutate } = useProjectStatus();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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

  const handleMarkAsCompleted = (id: number) => {
    handleConfirm(ProjectStatusName.Completed, id);
  };

  const handleMarkAsPending = (id: number) => {
    handleConfirm(ProjectStatusName.Pending, id);
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
      sorter: true,
      render: (_, record: IProject) => <>{record?.name ?? '-'}</>
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
      title: 'Project Manager',
      dataIndex: 'projectManager',
      key: 'projectManager',
      sorter: false,
      render: (_, record: IProject) => (
        <>
          {record?.projectManager
            ? `${record?.projectManager?.firstName} ${record?.projectManager?.lastName}`
            : 'Outsourcing PM'}
        </>
      )
    },
    {
      title: 'Team Leader',
      dataIndex: 'teamLeader',
      key: 'teamLeader',
      sorter: false,
      render: (_, record: IProject) => (
        <>
          {record?.teamLeader?.firstName ?? ''} {record?.teamLeader?.lastName ?? '-'}
        </>
      )
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
      title: 'Total Cost',
      dataIndex: 'projectCost',
      key: 'projectCost',
      sorter: false,
      render: (_, record: IProject) => (
        <div className="d-flex flex-row">
          <p className="mt-6">{record?.projectCost ?? '-'}</p>
          <Tooltip title="View project cost" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<InfoCircleOutlined />}
              onClick={() => setIsModalVisible(true)}
            />
          </Tooltip>
          <Modal
            title="Project Cost"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            ]}
            destroyOnClose={true}
          >
            <ProjectInfoTable record={record} />
          </Modal>
        </div>
      )
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      sorter: false,
      render: (_, record: IProject) => <>{record?.currency ?? '-'}</>
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
          {record?.status === ProjectStatusName.Started && (
            <Tooltip title="Add Cr" placement="top" trigger="hover">
              <Button
                type="text"
                size="small"
                className="cta_btn table_cta_btn"
                icon={<PlusOutlined />}
                onClick={() => {
                  navigate(`${ROUTES.crAdd}`, {
                    state: { project: record }
                  });
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="View project" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.projectView}/${record?.id}`)}
            />
          </Tooltip>
          <Tooltip title="Mark as completed" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<CheckOutlined />}
              onClick={() => handleMarkAsCompleted(record?.id)}
            />
          </Tooltip>
          <Tooltip title="On hold" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<PauseOutlined />}
              onClick={() => handleMarkAsPending(record?.id)}
            />
          </Tooltip>
          <Tooltip title="Edit project" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`${ROUTES.projectEdit}/${record?.id}`);
              }}
            />
          </Tooltip>
          {(employeeData?.role === EmployeeRoleName.Admin ||
            employeeData?.role === EmployeeRoleName.Sales_Executive ||
            employeeData?.role === EmployeeRoleName.Sales_Manager) && (
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
  );
};

export default ProjectManagementTable;
