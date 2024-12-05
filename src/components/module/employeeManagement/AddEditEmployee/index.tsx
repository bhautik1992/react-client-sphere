import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IAddEmployeeReq, IEmployee, IEmployeeReq } from 'services/api/employee/types';
import { useDashboardEmployee } from 'services/hooks/dashboard';
import { useAddEmployee, useEditEmployee, useEmployeeDetail } from 'services/hooks/employee';
import { dashboardKey, employeeKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { Department, Designation, EmployeeRole } from 'utils/constants/enum';
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
    return {
      label: item.firstName + ' ' + item.lastName,
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
      lastName: employeeData?.lastName ?? null,
      personalEmail: employeeData?.personalEmail ?? null,
      companyEmail: employeeData?.companyEmail ?? null,
      phone: employeeData?.phone ?? null,
      role: employeeData?.role ?? null,
      department: employeeData?.department ?? null,
      designation: employeeData?.designation ?? null,
      joiningDate: employeeData?.joiningDate ? dayjs(employeeData?.joiningDate) : null,
      dateOfBirth: employeeData?.dateOfBirth ? dayjs(employeeData?.dateOfBirth) : null,
      reportingPersonId: employeeData?.reportingPersonId ?? null
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
            <RenderTextInput
              col={{ xs: 12 }}
              name="firstName"
              placeholder="Enter your first name"
              label="First Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your first name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="lastName"
              placeholder="Enter your last name"
              label="Last Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your last name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="personalEmail"
              placeholder="Enter your personal email"
              label="Personal Email"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your personal email'
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
              placeholder="Enter your company email"
              label="Company Email"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your company email'
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
              placeholder="Enter your phone number"
              label="Phone Number"
              allowClear="allowClear"
              size="middle"
              rules={[
                () => ({
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(new Error('Please enter your phone number'));
                    } else if (!value || isValidPhoneNumber(value, 'IN')) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error('Please enter valid phone number'));
                    }
                  }
                })
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="role"
              placeholder="Please select your role"
              label="Role"
              allowClear={true}
              optionLabel={EmployeeRole}
              rules={[
                {
                  required: true,
                  message: 'Please select your role'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="department"
              placeholder="Please select your department"
              label="Department"
              allowClear={true}
              optionLabel={Department}
              rules={[
                {
                  required: true,
                  message: 'Please select your department'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="designation"
              placeholder="Select designation"
              label="Designation"
              optionLabel={Designation}
              allowClear={true}
              rules={[
                {
                  required: true,
                  message: 'Please select designation'
                }
              ]}
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              name="joiningDate"
              placeholder="Select your joining date"
              label="Joining Date"
              allowClear="allowClear"
              size="middle"
              format={DATE_FORMAT}
              rules={[
                {
                  required: true,
                  message: 'Please select your joining date'
                }
              ]}
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              name="dateOfBirth"
              placeholder="Select your date of birth"
              label="Date of Birth"
              allowClear={true}
              size="middle"
              format={DATE_FORMAT}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="reportingPersonId"
              placeholder="Select your reporting person"
              label="Reporting Person"
              allowClear={true}
              showSearch={true}
              optionLabel={employeeListOption}
              rules={[
                {
                  required: true,
                  message: 'Please select your reporting person'
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
