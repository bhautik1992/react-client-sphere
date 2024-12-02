import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { RenderSelectInput, RenderTextInput } from 'components/common/FormField';

import { IAddUserReq, IUser, IUserReq } from 'services/api/users/types';
import { dashboardKey, userKeys } from 'services/hooks/queryKeys';
import { useAddUser, useEditUser } from 'services/hooks/user';

import { IApiError } from 'utils/Types';
import { RoleData } from 'utils/constants/role';

interface IAddUserModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  userData?: IUser | null;
}

const AddEditUserModal: React.FC<IAddUserModalProps & ModalProps> = ({
  className,
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
    >
      <Form
        onFinish={onSubmit}
        form={form}
        autoComplete="off"
        className="signInForm"
        initialValues={{
          firstName: userData?.firstName ?? '',
          lastName: userData?.lastName ?? null,
          email: userData?.email ?? '',
          phone: userData?.phone ?? null,
          role: userData?.role ?? null
        }}
      >
        <Row gutter={[0, 30]}>
          <RenderTextInput
            col={{ xs: 24 }}
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
            col={{ xs: 24 }}
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
            col={{ xs: 24 }}
            name="email"
            placeholder="Enter your email address"
            label="Email address"
            allowClear="allowClear"
            size="middle"
            disabled={Boolean(userData?.email)}
            rules={[
              {
                required: true,
                message: 'Please enter your email address'
              },
              {
                type: 'email',
                message: 'Please enter valid email address'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 24 }}
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
            col={{ xs: 24 }}
            name="role"
            placeholder="Please select your role"
            label="Role"
            allowClear={true}
            optionLabel={RoleData}
            rules={[
              {
                required: true,
                message: 'Please select your role'
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
