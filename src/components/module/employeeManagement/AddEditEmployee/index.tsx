import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Form, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  RenderDatePicker,
  RenderSelectInput,
  RenderTextArea,
  RenderTextInput
} from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IAddEmployeeReq, IEmployee, IEmployeeReq } from 'services/api/employee/types';
import { useDashboardEmployee } from 'services/hooks/dashboard';
import { useAddEmployee, useEditEmployee, useEmployeeDetail } from 'services/hooks/employee';
import { dashboardKey, employeeKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { Department, EmployeeRole, EmployeeStatus } from 'utils/constants/enum';
import pattern from 'utils/constants/pattern';
import { ROUTES } from 'utils/constants/routes';

const AddEditEmployee = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddEmployee();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditEmployee();
  const { data: employeeData } = useEmployeeDetail(Number(id));

  const { data: employeeList } = useDashboardEmployee();
  const employeeListOption = employeeList?.map((item) => {
    const role = EmployeeRole.find((role) => role.value === item.role)?.label ?? '';
    return {
      label: item.firstName + ' ' + item.lastName + ' (' + role + ')',
      value: item.id
    };
  });

  const handleClose = () => {
    form.resetFields();
    navigate(ROUTES.employeeManagement);
  };

  const onSubmit = (value: IAddEmployeeReq) => {
    return employeeData?.id ? editEmployee(value) : addEmployee(value);
  };

  const addEmployee = (value: IAddEmployeeReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate employee list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [employeeKeys.employeeList({} as IEmployeeReq)].some((key) => {
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
            return [dashboardKey.dashboardEmployee].some((key) => {
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

  const editEmployee = (value: IAddEmployeeReq) => {
    const data = {
      ...value,
      id: employeeData?.id ?? 0
    };
    editMutate(data, {
      onSuccess: (res) => {
        // invalidate employee list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [employeeKeys.employeeList({} as IEmployeeReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set detail view
        queryClient.setQueryData<IEmployee>(
          employeeKeys.employeeDetail(employeeData?.id ?? 0),
          () => {
            return { ...res } as IEmployee;
          }
        );

        // dashboard employee list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardEmployee].some((key) => {
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

  useEffect(() => {
    if (!employeeData) return;
    form.setFieldsValue({
      firstName: employeeData?.firstName ?? null,
      middleName: employeeData?.middleName ?? null,
      lastName: employeeData?.lastName ?? null,
      personalEmail: employeeData?.personalEmail ?? null,
      companyEmail: employeeData?.companyEmail ?? null,
      phone: employeeData?.phone ?? null,
      role: employeeData?.role ?? null,
      department: employeeData?.department ?? null,
      joiningDate: employeeData?.joiningDate ? dayjs(employeeData?.joiningDate) : null,
      dateOfBirth: employeeData?.dateOfBirth ? dayjs(employeeData?.dateOfBirth) : null,
      reportingPersonId: employeeData?.reportingPersonId ?? null,
      PAN: employeeData?.PAN ?? null,
      aadhar: employeeData?.aadhar ?? null,
      status: employeeData?.status ?? null,
      address: employeeData?.address ?? null,
      bankName: employeeData?.bankName ?? null,
      accountNumber: employeeData?.accountNumber ?? null,
      IFSC: employeeData?.IFSC ?? null,
      emergencyContactName: employeeData?.emergencyContactName ?? null,
      emergencyContactNumber: employeeData?.emergencyContactNumber ?? null
    });
  }, [employeeData, form]);

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.employeeManagement}>Employees</Link>
    },
    {
      title: id ? 'Edit Employee' : 'Add Employee'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Employee' : 'Add Employee'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <Divider orientation="left">Personal Details</Divider>
            <RenderTextInput
              col={{ xs: 12 }}
              name="firstName"
              placeholder="Enter first name"
              label="First Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter first name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="middleName"
              placeholder="Enter middle name"
              label="Middle Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter middle name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="lastName"
              placeholder="Enter last name"
              label="Last Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter last name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="personalEmail"
              placeholder="Enter personal email"
              label="Personal Email"
              allowClear="allowClear"
              disabled={!!employeeData?.personalEmail}
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter personal email'
                },
                {
                  type: 'email',
                  message: 'Please enter valid personal email'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="companyEmail"
              placeholder="Enter company email"
              label="Company Email"
              allowClear="allowClear"
              size="middle"
              disabled={!!employeeData?.companyEmail}
              rules={[
                {
                  required: true,
                  message: 'Please enter company email'
                },
                {
                  type: 'email',
                  message: 'Please enter valid company email'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="phone"
              placeholder="Enter phone number"
              label="Phone Number"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter phone number'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="role"
              placeholder="select role"
              label="Role"
              allowClear={true}
              optionLabel={EmployeeRole}
              rules={[
                {
                  required: true,
                  message: 'Please select role'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="department"
              placeholder="select department"
              label="Department"
              allowClear={true}
              optionLabel={Department}
              rules={[
                {
                  required: true,
                  message: 'Please select department'
                }
              ]}
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              name="joiningDate"
              placeholder="select joining date"
              label="Joining Date"
              allowClear="allowClear"
              size="middle"
              format={DATE_FORMAT}
              rules={[
                {
                  required: true,
                  message: 'Please select joining date'
                }
              ]}
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              name="dateOfBirth"
              placeholder="select date of birth"
              label="Date of Birth"
              allowClear={true}
              size="middle"
              format={DATE_FORMAT}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="reportingPersonId"
              placeholder="select reporting person"
              label="Reporting Person"
              allowClear={true}
              showSearch={true}
              optionLabel={employeeListOption}
              rules={[
                {
                  required: true,
                  message: 'Please select reporting person'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="status"
              placeholder="select status"
              label="Status"
              allowClear={true}
              optionLabel={EmployeeStatus}
              rules={[
                {
                  required: true,
                  message: 'Please select status'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="PAN"
              placeholder="Enter PAN number"
              label="PAN Number"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  validator: (_: any, value: string) => {
                    const regex = pattern.PAN;
                    if (value && !regex.test(value)) {
                      return Promise.reject(new Error('Please enter valid PAN number'));
                    }
                    return Promise.resolve();
                  }
                },
                {
                  required: true,
                  whitespace: true,
                  message: 'Please enter PAN number'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="aadhar"
              placeholder="Enter Aadhar number"
              label="Aadhar Number"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please enter Aadhar number'
                },
                {
                  validator: (_: any, value: string) => {
                    const regex = pattern.aadhar; // assuming pattern.aadhar is your regex
                    if (value && !regex.test(value)) {
                      return Promise.reject(new Error('Please enter a valid Aadhar number'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            />
            <RenderTextArea
              col={{ xs: 12 }}
              name="address"
              placeholder="enter address"
              label="Address"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter address'
                }
              ]}
            />
            <Divider orientation="left">Bank Details</Divider>
            <RenderTextInput
              col={{ xs: 12 }}
              name="bankName"
              placeholder="Enter bank name"
              label="Bank Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter bank name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="accountNumber"
              placeholder="Enter account number"
              label="Account Number"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter account number'
                },
                {
                  validator: (_: any, value: string) => {
                    const regex = pattern.accountNumber;
                    if (value && !regex.test(value)) {
                      return Promise.reject(new Error('Please enter a valid account number'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="IFSC"
              placeholder="Enter IFSC code"
              label="IFSC Code"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please enter IFSC code'
                },
                {
                  validator: (_: any, value: string) => {
                    const regex = pattern.IFSC; // assuming pattern.IFSC is your regex
                    if (value && !regex.test(value)) {
                      return Promise.reject(new Error('Please enter a valid IFSC code'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            />
            <Divider orientation="left">Emergency Contact</Divider>
            <RenderTextInput
              col={{ xs: 12 }}
              name="emergencyContactName"
              placeholder="Enter emergency contact name"
              label="Contact Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter emergency contact name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="emergencyContactNumber"
              placeholder="Enter emergency contact number"
              label="Contact Number"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter emergency contact number'
                }
              ]}
            />
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
                {employeeData?.id ? 'Update' : 'Create'}
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditEmployee;
