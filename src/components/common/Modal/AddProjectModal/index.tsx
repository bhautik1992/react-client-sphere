import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';

import { IAddProjectReq, IProject, IProjectReq } from 'services/api/project/types';
import { useDashboardClient, useDashboardCompany } from 'services/hooks/dashboard';
import { useAddProject, useEditProject } from 'services/hooks/project';
import { dashboardKey, projectKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ProjectStatus } from 'utils/constants/project-status';

interface IAddProjectModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  projectData?: IProject | null;
}

const AddProjectModal: React.FC<IAddProjectModalProps & ModalProps> = ({
  className,
  isOpen,
  setIsOpen,
  projectData
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useAddProject();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditProject();

  const [open, setOpen] = useState<boolean>(false);

  const { data: clientList } = useDashboardClient();
  const { data: companyList } = useDashboardCompany();

  const clientListOption = clientList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const companyListOption = companyList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'backdropClick') return;
    setOpen(false);
    setIsOpen?.(false);
  };

  const onSubmit = (value: IAddProjectReq) => {
    value.amount = +value.amount;
    return projectData?.id ? editProject(value) : addProject(value);
  };

  const addProject = (value: IAddProjectReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate project list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [projectKeys.projectList({} as IProjectReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // invalidate dashboard
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardCount].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        handleClose();
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  const editProject = (value: IAddProjectReq) => {
    const data = {
      ...value,
      id: projectData?.id ?? 0
    };
    editMutate(data, {
      onSuccess: (res) => {
        // invalidate project list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [projectKeys.projectList({} as IProjectReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set detail view
        queryClient.setQueryData<IProject>(projectKeys.projectDetail(projectData?.id ?? 0), () => {
          return { ...res } as IProject;
        });
        handleClose();
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  return (
    <Modal
      open={Boolean(open || isOpen)}
      className={className}
      title={projectData ? 'Edit Project' : 'Add Project'}
      onCancel={handleClose}
      destroyOnClose={true}
      centered
      footer={[]}
    >
      <Form
        onFinish={onSubmit}
        form={form}
        autoComplete="off"
        className="signInForm"
        initialValues={{
          name: projectData?.name ?? '',
          description: projectData?.description ?? '',
          status: projectData?.status ?? null,
          amount: projectData?.amount ?? null,
          startDate: projectData?.startDate ? dayjs(projectData?.startDate) : null,
          endDate: projectData?.endDate ? dayjs(projectData?.endDate) : null,
          clientId: projectData?.client.id ?? null,
          companyId: projectData?.company.id ?? null
        }}
      >
        <Row gutter={[0, 30]}>
          <RenderTextInput
            col={{ xs: 24 }}
            name="name"
            placeholder="Enter project name"
            label="Name"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter project name'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 24 }}
            name="description"
            placeholder="Enter project description"
            label="Description"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter project description'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 24 }}
            name="status"
            placeholder="Please select project status"
            label="Status"
            allowClear={true}
            optionLabel={ProjectStatus}
            rules={[
              {
                required: true,
                message: 'Please select project status'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 24 }}
            name="amount"
            placeholder="Enter project amount"
            label="Amount"
            allowClear="allowClear"
            size="middle"
            rules={[
              () => ({
                validator: (_: any, value: string) => {
                  if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error('Please enter project amount'));
                  }
                  const regex = /^[0-9]*$/;
                  if (!regex.test(value)) {
                    return Promise.reject(new Error('Amount must be a valid number'));
                  }
                  if (+value <= 0) {
                    return Promise.reject(new Error('Amount must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          />
          <RenderDatePicker
            col={{ xs: 24 }}
            // disabledDate={(currentDate: dayjs.Dayjs) => currentDate.isAfter(new Date())}
            name="startDate"
            placeholder="Enter project start date"
            label="Start Date"
            allowClear="allowClear"
            size="middle"
            format={DATE_FORMAT}
            rules={[
              {
                required: true,
                message: 'Please select project start date'
              }
            ]}
          />
          <RenderDatePicker
            col={{ xs: 24 }}
            // disabledDate={(currentDate: dayjs.Dayjs) => currentDate.isBefore(new Date())}
            name="endDate"
            placeholder="Enter project end date"
            label="End Date"
            allowClear="allowClear"
            size="middle"
            format={DATE_FORMAT}
          />
          <RenderSelectInput
            col={{ xs: 24 }}
            name="clientId"
            placeholder="Please select client"
            label="Client"
            allowClear={true}
            optionLabel={clientListOption}
            disabled={Boolean(projectData?.client.id)}
            rules={[
              {
                required: true,
                message: 'Please select client'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 24 }}
            name="companyId"
            placeholder="Please select company"
            label="Company"
            allowClear={true}
            optionLabel={companyListOption}
            rules={[
              {
                required: true,
                message: 'Please select company'
              }
            ]}
          />
        </Row>
        <ButtonWrapper>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            className="submitButton"
            type="primary"
            size="middle"
            htmlType="submit"
            disabled={isLoading ?? isEditLoading}
          >
            {projectData?.id ? 'Update' : 'Create'}
          </Button>
        </ButtonWrapper>
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
