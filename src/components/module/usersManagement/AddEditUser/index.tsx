import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IAddUserReq, IUser, IUserReq } from 'services/api/users/types';
import { dashboardKey, userKeys } from 'services/hooks/queryKeys';
import { useAddUser, useEditUser, useUserDetail } from 'services/hooks/user';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { Department, UserRole } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const AddEditUser = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddUser();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditUser();
  const { data: userData } = useUserDetail(Number(id));

  const handleClose = () => {
    form.resetFields();
    navigate(ROUTES.clientManagement);
  };

  const onSubmit = (value: IAddUserReq) => {
    return userData?.id ? editUser(value) : addUser(value);
  };

  const addUser = (value: IAddUserReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate user list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [userKeys.userList({} as IUserReq)].some((key) => {
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

  const editUser = (value: IAddUserReq) => {
    const data = {
      ...value,
      id: userData?.id ?? 0
    };
    editMutate(data, {
      onSuccess: (res) => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [userKeys.userList({} as IUserReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set detail view
        queryClient.setQueryData<IUser>(userKeys.userDetail(userData?.id ?? 0), () => {
          return { ...res } as IUser;
        });
        handleClose();
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  useEffect(() => {
    if (!userData) return;
    form.setFieldsValue({
      firstName: userData?.firstName ?? null,
      lastName: userData?.lastName ?? null,
      personalEmail: userData?.personalEmail ?? null,
      companyEmail: userData?.companyEmail ?? null,
      phone: userData?.phone ?? null,
      role: userData?.role ?? null,
      department: userData?.department ?? null,
      designation: userData?.designation ?? null,
      joiningDate: userData?.joiningDate ? dayjs(userData?.joiningDate) : null,
      dateOfBirth: userData?.dateOfBirth ? dayjs(userData?.dateOfBirth) : null,
      reportingPerson: userData?.reportingPerson ?? null
    });
  }, [userData, form]);

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.usersManagement}>Users</Link>
    },
    {
      title: id ? 'Edit User' : 'Add User'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit User' : 'Add User'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <RenderTextInput
              col={{ xs: 18 }}
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
              col={{ xs: 18 }}
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
              col={{ xs: 18 }}
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
              col={{ xs: 18 }}
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
              col={{ xs: 18 }}
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
              col={{ xs: 18 }}
              name="role"
              placeholder="Please select your role"
              label="Role"
              allowClear={true}
              optionLabel={UserRole}
              rules={[
                {
                  required: true,
                  message: 'Please select your role'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 18 }}
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
            <RenderTextInput
              col={{ xs: 18 }}
              name="designation"
              placeholder="Please enter your designation"
              label="Designation"
              allowClear={true}
              rules={[
                {
                  required: true,
                  message: 'Please enter your designation'
                }
              ]}
            />
            <RenderDatePicker
              col={{ xs: 18 }}
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
              col={{ xs: 18 }}
              name="dateOfBirth"
              placeholder="Select your date of birth"
              label="Date of Birth"
              allowClear={true}
              size="middle"
              format={DATE_FORMAT}
            />
            <RenderTextInput
              col={{ xs: 18 }}
              name="reportingPerson"
              placeholder="Please enter your reporting person"
              label="Reporting Person"
              allowClear={true}
              rules={[
                {
                  required: true,
                  message: 'Please enter your reporting person'
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
                {userData?.id ? 'Update' : 'Create'}
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditUser;
