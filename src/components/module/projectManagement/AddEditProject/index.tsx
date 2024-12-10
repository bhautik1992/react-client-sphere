import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Form, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  RenderCheckBox,
  RenderDatePicker,
  RenderSelectInput,
  RenderTextInput
} from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IAddProjectReq, IProject, IProjectReq } from 'services/api/project/types';
import {
  useDashboardClient,
  useDashboardCompany,
  useDashboardEmployee
} from 'services/hooks/dashboard';
import { useAddProject, useEditProject, useProjectDetail } from 'services/hooks/project';
import { dashboardKey, projectKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import {
  BillingType,
  BillingTypeName,
  COMPANY_EMAIL,
  CurrencyType,
  InvoicePaymentCycle,
  InvoicePaymentCycleName,
  ProjectStatus
} from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const AddEditProject = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddProject();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditProject();
  const { data: projectData } = useProjectDetail(Number(id));
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [billingType, setBillingType] = useState<string>('');
  const [filteredInvoicePaymentCycle, setFilteredInvoicePaymentCycle] = useState<
    { value: string; label: string }[]
  >([]);

  const { data: employeeList } = useDashboardEmployee();
  const projectManagerListOption = [
    {
      label: 'Outsourcing PM',
      value: 0
    },
    ...(Array.isArray(employeeList)
      ? employeeList
          .filter((item) => item.role === 'project_manager')
          .map((item) => ({
            label: `${item.firstName} ${item.lastName}`,
            value: item.id
          }))
      : [])
  ];
  const teamLeaderListOption = Array.isArray(employeeList)
    ? employeeList
        .filter((item) => item.role === 'team_leader')
        .map((item) => ({
          label: `${item.firstName} ${item.lastName}`,
          value: item.id
        }))
    : [];

  const { data: companyList } = useDashboardCompany();
  const companyListOption = companyList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const { data: clientList } = useDashboardClient();
  const clientListOption = clientList?.map((item) => {
    return {
      label: item.firstName + ' ' + item.lastName,
      value: item.id
    };
  });

  const handleClientChange = (clientId: number) => {
    form.setFieldsValue({
      clientCompanyName: clientList?.find((item) => item.id === clientId)?.clientCompanyName
    });
  };

  const handleBillingTypeChange = (value: string) => {
    setBillingType(value);
    form.setFieldsValue({
      hourlyMonthlyRate: '',
      projectHours: '',
      projectCost: ''
    });
    if (value === BillingTypeName.Hourly) {
      setFilteredInvoicePaymentCycle(InvoicePaymentCycle);
    } else if (value === BillingTypeName.Monthly) {
      setFilteredInvoicePaymentCycle(
        InvoicePaymentCycle.filter((cycle) => cycle.value === InvoicePaymentCycleName.Monthly)
      );
    } else {
      setFilteredInvoicePaymentCycle([]); // Hide dropdown for other cases
    }
  };

  const handleHourlyMonthlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({
      projectCost: String(+e.target.value * (form.getFieldValue('projectHours') || 0))
    });
  };

  const handleProjectHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const intValue = parseFloat(e.target.value) || 0;
    form.setFieldsValue({
      projectCost: String(+e.target.value * (form.getFieldValue('hourlyMonthlyRate') || 0)),
      projectHours: intValue
    });
  };

  const handleClose = () => {
    form.resetFields();
    navigate(ROUTES.projectManagement);
  };

  const onSubmit = (value: IAddProjectReq) => {
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

        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardProject].some((key) => {
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

  useEffect(() => {
    setIsChecked(projectData?.isInternalProject ?? false);
    form.setFieldsValue({ isInternalCr: projectData?.isInternalProject ?? false });
  }, [projectData, form]);

  useEffect(() => {
    form.setFieldsValue({
      assignFromCompanyId: companyList?.find((item) => item.email === COMPANY_EMAIL)?.id
    });
    if (!projectData) return;
    setBillingType(projectData?.billingType ?? '');
    form.setFieldsValue({
      name: projectData?.name ?? '',
      description: projectData?.description ?? '',
      status: projectData?.status ?? null,
      startDate: projectData?.startDate ? dayjs(projectData?.startDate) : null,
      endDate: projectData?.endDate ? dayjs(projectData?.endDate) : null,
      assignFromCompanyId: projectData?.assignFromCompanyId ?? null,
      assignToCompanyId: projectData?.assignToCompanyId ?? null,
      clientId: projectData?.clientId ?? null,
      clientCompanyName: projectData?.client.clientCompanyName ?? null,
      projectManagerId: projectData?.projectManagerId ?? null,
      teamLeaderId: projectData?.teamLeaderId ?? null,
      isInternalProject: projectData?.isInternalProject ?? false,
      billingType: projectData?.billingType ?? null,
      hourlyMonthlyRate: projectData?.hourlyMonthlyRate ?? null,
      projectHours: projectData?.projectHours ?? null,
      currency: projectData?.currency ?? null,
      projectCost: projectData?.projectCost ?? null,
      paymentTermDays: projectData?.paymentTermDays ?? null,
      invoicePaymentCycle: projectData?.invoicePaymentCycle ?? null
    });
  }, [projectData, form, companyList]);

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.projectManagement}>Projects</Link>
    },
    {
      title: id ? 'Edit Project' : 'Add Project'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Project' : 'Add Project'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <Divider orientation="left">Project Information</Divider>
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
              name="status"
              placeholder="Select project status"
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
            <Divider orientation="left">Company Information</Divider>
            <RenderSelectInput
              col={{ xs: 12 }}
              name="assignFromCompanyId"
              placeholder="Select parent company"
              label="Assign From"
              allowClear={true}
              optionLabel={companyListOption}
              disabled={true}
              rules={[
                {
                  required: true,
                  message: 'Please select parent company'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="assignToCompanyId"
              placeholder="Select company"
              label="Assign To"
              allowClear={true}
              optionLabel={companyListOption}
              rules={[
                {
                  required: true,
                  message: 'Please select company'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="clientId"
              placeholder="Select client"
              label="Client"
              allowClear={true}
              optionLabel={clientListOption}
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
              name="clientCompanyName"
              placeholder="Client company name"
              label="Client Company"
              allowClear={true}
              disabled={true}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="projectManagerId"
              placeholder="Select project manager"
              label="Project Manager"
              allowClear={true}
              optionLabel={projectManagerListOption}
              rules={[
                {
                  required: true,
                  message: 'Please select project manager'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="teamLeaderId"
              placeholder="Select team leader"
              label="Team Leader"
              allowClear={true}
              optionLabel={teamLeaderListOption}
            />
            <RenderCheckBox
              col={{ xs: 12 }}
              name="isInternalProject"
              label="Is Internal Project?"
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e.target.checked);
                form.setFieldsValue({ isInternalProject: e.target.checked });
              }}
            />
            <Divider orientation="left">Project Cost Information</Divider>
            <RenderSelectInput
              col={{ xs: 12 }}
              name="billingType"
              placeholder="Select billing type"
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
            <RenderSelectInput
              col={{ xs: 12 }}
              name="currency"
              placeholder="Select currency"
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
            <RenderTextInput
              col={{ xs: 12 }}
              name="hourlyMonthlyRate"
              placeholder="Enter project hourly rate"
              label="Hourly Rate"
              allowClear="allowClear"
              size="middle"
              onChange={handleHourlyMonthlyRateChange}
              rules={[
                () => ({
                  validator: (_: any, value: string) => {
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
              name="projectCost"
              label="Project Cost"
              allowClear="allowClear"
              size="middle"
              disabled={true}
            />
            {billingType && (
              <>
                <Divider orientation="left">Project Payment Cycle</Divider>
                <RenderTextInput
                  col={{ xs: 12 }}
                  name="paymentTermDays"
                  placeholder="Enter payment term days"
                  label="Payment Term Days"
                  allowClear="allowClear"
                  size="middle"
                  rules={[
                    () => ({
                      validator: (_: any, value: string) => {
                        const regex = /^[0-9]*$/;
                        if (!regex.test(value)) {
                          return Promise.reject(new Error('Please enter valid payment term days'));
                        }
                        if (+value <= 0) {
                          return Promise.reject(
                            new Error('Payment term days must be greater than 0')
                          );
                        }
                        return Promise.resolve();
                      }
                    })
                  ]}
                  onChange={(e: any) => {
                    const intValue = parseInt(e.target.value, 10) || 0;
                    form.setFieldsValue({ paymentTermDays: intValue });
                  }}
                />
              </>
            )}
            {billingType && filteredInvoicePaymentCycle.length > 0 && (
              <RenderSelectInput
                col={{ xs: 12 }}
                name="invoicePaymentCycle"
                placeholder="Select invoice payment cycle"
                label="Invoice Payment Cycle"
                allowClear={true}
                optionLabel={filteredInvoicePaymentCycle}
                rules={[
                  {
                    required: true,
                    message: 'Please select invoice payment cycle'
                  }
                ]}
              />
            )}
          </Row>
          <Row justify={'center'}>
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
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditProject;
