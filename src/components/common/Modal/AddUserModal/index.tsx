import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { RenderDatePicker, RenderSelectInput, RenderTextInput } from 'components/common/FormField';

import { IAddUserReq, IUser, IUserReq } from 'services/api/users/types';
import { dashboardKey, userKeys } from 'services/hooks/queryKeys';
import { useAddUser, useEditUser } from 'services/hooks/user';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { Department, UserRole } from 'utils/constants/enum';

interface IAddUserModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  userData?: IUser | null;
}

const AddEditUserModal: React.FC<IAddUserModalProps & ModalProps> = ({
  className,
  width = 1100,
  isOpen,
  setIsOpen,
  userData
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useAddUser();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditUser();
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'backdropClick') return;
    setOpen(false);
    setIsOpen?.(false);
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

  return (
    <Modal
      open={Boolean(open || isOpen)}
      className={className}
      title={userData ? 'Edit User' : 'Add User'}
      onCancel={handleClose}
      destroyOnClose={true}
      centered
      footer={[]}
      width={width}
    >
      <Form
        onFinish={onSubmit}
        form={form}
        autoComplete="off"
        className="signInForm"
        initialValues={{
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
        }}
      >
        <Row gutter={[16, 30]}>
          <RenderTextInput
            col={{ xs: 12 }}
            name="firstName"
            placeholder="Enter your first name"
            label="First name"
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
            label="Last name"
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
            label="Phone number"
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
            optionLabel={UserRole}
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
          <RenderTextInput
            col={{ xs: 12 }}
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
          <RenderTextInput
            col={{ xs: 12 }}
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
      </Form>
    </Modal>
  );
};

export default AddEditUserModal;
