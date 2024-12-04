import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';

import { IAddProjectReq, IProject, IProjectReq } from 'services/api/project/types';
import { useDashboardClient } from 'services/hooks/dashboard';
import { useAddProject, useEditProject } from 'services/hooks/project';
import { dashboardKey, projectKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { BillingType, CurrencyType, InvoiceStatus, ProjectStatus } from 'utils/constants/enum';

interface IAddProjectModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  projectData?: IProject | null;
}

const AddProjectModal: React.FC<IAddProjectModalProps & ModalProps> = ({
  className,
  width = 1300,
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

  const clientListOption = clientList?.map((item) => {
    return {
      label: item.firstName + ' ' + item.lastName,
      value: item.id
    };
  });

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'backdropClick') return;
    setOpen(false);
    setIsOpen?.(false);
  };

  const handleClientChange = (clientId: number) => {
    form.setFieldsValue({
      companyName: clientList?.find((item) => item.id === clientId)?.companyName,
      clientCompanyName: clientList?.find((item) => item.id === clientId)?.clientCompanyName
    });
  };

  const handleBillingTypeChange = () => {
    form.setFieldsValue({
      hourlyMonthlyRate: '',
      projectHours: '',
      amount: ''
    });
  };

  const handleHourlyMonthlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({
      amount: String(+e.target.value * (form.getFieldValue('projectHours') || 0))
    });
  };

  const handleProjectHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({
      amount: String(+e.target.value * (form.getFieldValue('hourlyMonthlyRate') || 0))
    });
  };

  const onSubmit = (value: IAddProjectReq) => {
    value.amount = +value.amount;
    return projectData?.id ? editProject(value) : addProject(value);
  };

  const addProject = (value: IAddProjectReq) => {
    value.hourlyMonthlyRate = +value.hourlyMonthlyRate;
    value.projectHours = +value.projectHours;
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
      id: projectData?.id ?? 0,
      projectHours: +value.projectHours,
      hourlyMonthlyRate: +value.hourlyMonthlyRate
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
      width={width}
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
          startDate: projectData?.startDate ? dayjs(projectData?.startDate) : null,
          endDate: projectData?.endDate ? dayjs(projectData?.endDate) : null,
          clientId: projectData?.client.id ?? null,
          companyName: projectData?.client.companyName ?? null,
          clientCompanyName: projectData?.client.clientCompanyName ?? null,
          InvoiceStatus: projectData?.invoiceStatus ?? null,
          projectManager: projectData?.projectManager ?? null,
          billingType: projectData?.billingType ?? 'fixed',
          hourlyMonthlyRate: projectData?.hourlyMonthlyRate ?? null,
          projectHours: projectData?.projectHours ?? null,
          currency: projectData?.currency ?? null,
          amount: projectData?.amount ?? null
        }}
      >
        <Row gutter={[20, 30]}>
          <RenderTextInput
            col={{ xs: 12 }}
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
            col={{ xs: 12 }}
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
            col={{ xs: 12 }}
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
          <RenderDatePicker
            col={{ xs: 12 }}
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
            col={{ xs: 12 }}
            // disabledDate={(currentDate: dayjs.Dayjs) => currentDate.isBefore(new Date())}
            name="endDate"
            placeholder="Enter project end date"
            label="End Date"
            allowClear="allowClear"
            size="middle"
            format={DATE_FORMAT}
          />
          <RenderSelectInput
            col={{ xs: 12 }}
            name="clientId"
            placeholder="Please select client"
            label="Client"
            allowClear={true}
            optionLabel={clientListOption}
            disabled={Boolean(projectData?.client.id)}
            onSelect={handleClientChange}
            rules={[
              {
                required: true,
                message: 'Please select client'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="companyName"
            placeholder="Company name"
            label="Company Name"
            allowClear={true}
            disabled={true}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="clientCompanyName"
            placeholder="Client company name"
            label="Client Company Name"
            allowClear={true}
            disabled={true}
          />
          <RenderSelectInput
            col={{ xs: 12 }}
            name="invoiceStatus"
            placeholder="Please select invoice status"
            label="Invoice Status"
            allowClear={true}
            optionLabel={InvoiceStatus}
            rules={[
              {
                required: true,
                message: 'Please select invoice status'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="projectManager"
            placeholder="Enter project manager"
            label="Project Manager"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter project manager'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 12 }}
            name="currency"
            placeholder="Please select currency"
            label="Currency"
            allowClear={true}
            optionLabel={CurrencyType}
            rules={[
              {
                required: true,
                message: 'Please select currency'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 12 }}
            name="billingType"
            placeholder="Please select billing type"
            label="Billing Type"
            allowClear={true}
            optionLabel={BillingType}
            rules={[
              {
                required: true,
                message: 'Please select billing type'
              }
            ]}
            onChange={handleBillingTypeChange}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="hourlyMonthlyRate"
            placeholder="Enter project hourly rate"
            label="Hourly/Monthly Rate"
            allowClear="allowClear"
            size="middle"
            onChange={handleHourlyMonthlyRateChange}
            rules={[
              () => ({
                validator: (_: any, value: string) => {
                  const regex = /^[0-9]*$/;
                  if (!regex.test(value)) {
                    return Promise.reject(new Error('Please enter valid hourly rate'));
                  }
                  if (+value <= 0) {
                    return Promise.reject(new Error('Hourly rate must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="projectHours"
            placeholder="Enter project hours"
            label="Project Hours"
            allowClear="allowClear"
            size="middle"
            onChange={handleProjectHoursChange}
            rules={[
              () => ({
                validator: (_: any, value: string) => {
                  const regex = /^[0-9]*$/;
                  if (!regex.test(value)) {
                    return Promise.reject(new Error('Please enter valid project hours'));
                  }
                  if (+value <= 0) {
                    return Promise.reject(new Error('Project hours must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="amount"
            placeholder="Enter project amount"
            label="Amount"
            allowClear="allowClear"
            size="middle"
            disabled={true}
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
