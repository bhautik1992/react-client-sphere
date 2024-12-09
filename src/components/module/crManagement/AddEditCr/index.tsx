import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Form, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  RenderCheckBox,
  RenderDatePicker,
  RenderSelectInput,
  RenderTextInput
} from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IAddCrReq, ICr, ICrReq } from 'services/api/cr/types';
import { IProject } from 'services/api/project/types';
import { useAddCr, useCrDetail, useEditCr } from 'services/hooks/cr';
import {
  useDashboardClient,
  useDashboardCompany,
  useDashboardProject
} from 'services/hooks/dashboard';
import { crKeys, dashboardKey } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import {
  BillingType,
  BillingTypeName,
  COMPANY_EMAIL,
  CrStatus,
  CurrencyType,
  InvoicePaymentCycle,
  InvoicePaymentCycleName
} from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const AddEditCr = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const location = useLocation();
  const { project } = (location.state as { project: IProject }) || {};
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddCr();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditCr();
  const { data: crData } = useCrDetail(Number(id));
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [billingType, setBillingType] = useState<string>('');
  const [filteredInvoicePaymentCycle, setFilteredInvoicePaymentCycle] = useState<
    { value: string; label: string }[]
  >([]);

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

  const { data: projectList } = useDashboardProject();
  const projectListOption = projectList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const handleProjectChange = (projectId: number) => {
    form.setFieldsValue({
      clientId: projectList?.find((item) => item.id === projectId)?.client?.id,
      clientCompanyName: projectList?.find((item) => item.id === projectId)?.client
        ?.clientCompanyName
    });
  };

  const handleBillingTypeChange = (value: string) => {
    setBillingType(value);
    form.setFieldsValue({
      hourlyMonthlyRate: '',
      crHours: '',
      crCost: ''
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
      crCost: String(+e.target.value * (form.getFieldValue('crHours') || 0))
    });
  };

  const handleCrHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const intValue = parseFloat(e.target.value) || 0;
    form.setFieldsValue({
      crCost: String(+e.target.value * (form.getFieldValue('hourlyMonthlyRate') || 0)),
      crHours: intValue
    });
  };

  const handleClose = () => {
    form.resetFields();
    navigate(ROUTES.crManagement);
  };

  const onSubmit = (value: IAddCrReq) => {
    return crData?.id ? editCr(value) : addCr(value);
  };

  const addCr = (value: IAddCrReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate cr list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [crKeys.crList({} as ICrReq)].some((key) => {
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

  const editCr = (value: IAddCrReq) => {
    const data = {
      ...value,
      id: crData?.id ?? 0
    };
    editMutate(data, {
      onSuccess: (res) => {
        // invalidate cr list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [crKeys.crList({} as ICrReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set detail view
        queryClient.setQueryData<ICr>(crKeys.crDetail(crData?.id ?? 0), () => {
          return { ...res } as ICr;
        });
        handleClose();
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  useEffect(() => {
    setIsChecked(crData?.isInternalCr ?? false);
    form.setFieldsValue({ isInternalCr: crData?.isInternalCr ?? false });
  }, [crData, form]);

  useEffect(() => {
    if (!project) return;
    form.setFieldsValue({
      projectId: project?.id,
      clientId: project?.clientId,
      clientCompanyName: project?.client.clientCompanyName,
      currency: project?.currency
    });
  });

  useEffect(() => {
    form.setFieldsValue({
      assignFromCompanyId: companyList?.find((item) => item.email === COMPANY_EMAIL)?.id
    });
    if (!crData) return;
    setBillingType(crData?.billingType ?? '');
    form.setFieldsValue({
      name: crData?.name ?? '',
      description: crData?.description ?? '',
      status: crData?.status ?? null,
      startDate: crData?.startDate ? dayjs(crData?.startDate) : null,
      endDate: crData?.endDate ? dayjs(crData?.endDate) : null,
      assignFromCompanyId: crData?.assignFromCompanyId ?? null,
      projectId: crData?.projectId ?? null,
      clientId: crData?.clientId ?? null,
      clientCompanyName: crData?.client.clientCompanyName ?? null,
      isInternalCr: crData?.isInternalCr ?? false,
      billingType: crData?.billingType ?? null,
      hourlyMonthlyRate: crData?.hourlyMonthlyRate ?? null,
      crHours: crData?.crHours ?? null,
      currency: crData?.currency ?? null,
      crCost: crData?.crCost ?? null,
      paymentTermDays: crData?.paymentTermDays ?? null,
      invoicePaymentCycle: crData?.invoicePaymentCycle ?? null
    });
  }, [crData, form, companyList]);

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.crManagement}>Crs</Link>
    },
    {
      title: id ? 'Edit Cr' : 'Add Cr'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Cr' : 'Add Cr'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <Divider orientation="left">Cr Information</Divider>
            <RenderTextInput
              col={{ xs: 12 }}
              name="name"
              placeholder="Enter cr name"
              label="Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter cr name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="description"
              placeholder="Enter cr description"
              label="Description"
              allowClear="allowClear"
              size="middle"
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              disabledDate={(currentDate: dayjs.Dayjs) =>
                currentDate.isBefore(new Date(project?.startDate))
              }
              name="startDate"
              placeholder="Enter cr start date"
              label="Start Date"
              allowClear="allowClear"
              size="middle"
              format={DATE_FORMAT}
              rules={[
                {
                  required: true,
                  message: 'Please select cr start date'
                }
              ]}
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              // disabledDate={(currentDate: dayjs.Dayjs) => currentDate.isBefore(new Date())}
              name="endDate"
              placeholder="Enter cr end date"
              label="End Date"
              allowClear="allowClear"
              size="middle"
              format={DATE_FORMAT}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="status"
              placeholder="Select cr status"
              label="Status"
              allowClear={true}
              optionLabel={CrStatus}
              rules={[
                {
                  required: true,
                  message: 'Please select cr status'
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
              name="projectId"
              placeholder="Select project"
              label="Project"
              allowClear={true}
              disabled={!!project?.id}
              onSelect={handleProjectChange}
              optionLabel={projectListOption}
              rules={[
                {
                  required: true,
                  message: 'Please select cr manager'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="clientId"
              placeholder="Select client"
              label="Client"
              allowClear={true}
              disabled={true}
              optionLabel={clientListOption}
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
            <RenderCheckBox
              col={{ xs: 12 }}
              name="isInternalCr"
              label="Is Internal Cr?"
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e.target.checked);
                form.setFieldsValue({ isInternalCr: e.target.checked });
              }}
            />
            <Divider orientation="left">Cr Cost Information</Divider>
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
              disabled={true}
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
              placeholder="Enter cr hourly rate"
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
              name="crHours"
              placeholder="Enter cr hours"
              label="Cr Hours"
              allowClear="allowClear"
              size="middle"
              onChange={handleCrHoursChange}
              rules={[
                () => ({
                  validator: (_: any, value: string) => {
                    const regex = /^[0-9]*$/;
                    if (!regex.test(value)) {
                      return Promise.reject(new Error('Please enter valid cr hours'));
                    }
                    if (+value <= 0) {
                      return Promise.reject(new Error('Cr hours must be greater than 0'));
                    }
                    return Promise.resolve();
                  }
                })
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="crCost"
              label="Cr Cost"
              allowClear="allowClear"
              size="middle"
              disabled={true}
            />
            {billingType && (
              <>
                <Divider orientation="left">Cr Payment Cycle</Divider>
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
                {crData?.id ? 'Update' : 'Create'}
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditCr;
