import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import React, { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { RenderPhoneNumber, RenderSelectInput, RenderTextInput } from 'components/common/FormField';

import { IAddClientReq, IClient, IClientReq } from 'services/api/client/types';
import { useAddClient, useEditClient } from 'services/hooks/client';
import { useCountryList } from 'services/hooks/country';
import { clientKeys, dashboardKey } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';

interface IAddClientModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  clientData?: IClient | null;
}

const AddClientModal: React.FC<IAddClientModalProps & ModalProps> = ({
  className,
  isOpen,
  setIsOpen,
  clientData
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useAddClient();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditClient();

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const { data: countryList } = useCountryList();
  const countryOptions = countryList?.map((item) => {
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

  const onSubmit = (value: IAddClientReq) => {
    return clientData?.id ? editClient(value) : addClient(value);
  };

  const addClient = (value: IAddClientReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [clientKeys.clientList({} as IClientReq)].some((key) => {
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

  const editClient = (value: IAddClientReq) => {
    const data = {
      ...value,
      id: clientData?.id ?? 0
    };
    editMutate(data, {
      onSuccess: (res) => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [clientKeys.clientList({} as IClientReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set detail view
        queryClient.setQueryData<IClient>(clientKeys.clientDetail(clientData?.id ?? 0), () => {
          return { ...res } as IClient;
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
      title={clientData ? 'Edit Client' : 'Add Client'}
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
          name: clientData?.name ?? '',
          email: clientData?.email ?? '',
          phone: clientData?.phone ?? null,
          gender: clientData?.gender ?? null,
          address: clientData?.address ?? null,
          countryId: clientData?.country?.id ?? null,
          status: clientData?.status ?? null
        }}
      >
        <Row gutter={[0, 30]}>
          <RenderTextInput
            col={{ xs: 24 }}
            name="name"
            placeholder="Enter your name"
            label="Name"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter your name'
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
            disabled={Boolean(clientData?.email)}
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
          <RenderPhoneNumber
            col={{ xs: 24 }}
            name="phone"
            placeholder="Enter your phone number "
            label="Phone number"
            onChange={(value: any) => setValue(value)}
            value={value}
            rules={[
              () => ({
                validator: (_: any, value: string) => {
                  if (!value) {
                    return Promise.reject(new Error('Please enter your phone number'));
                  } else if (!value || isValidPhoneNumber(value)) {
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
            name="gender"
            placeholder="Please select your gender"
            label="Gender"
            allowClear={true}
            optionLabel={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' }
            ]}
            rules={[
              {
                required: true,
                message: 'Please select your gender'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 24 }}
            name="address"
            placeholder="Enter your address"
            label="Address"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter your address'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 24 }}
            name="countryId"
            placeholder="Please select country"
            label="Country"
            allowClear={true}
            optionLabel={countryOptions}
            rules={[
              {
                required: true,
                message: 'Please select country'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 24 }}
            name="status"
            placeholder="Please select your status"
            label="Status"
            allowClear={true}
            optionLabel={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]}
            rules={[
              {
                required: true,
                message: 'Please select your status'
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
            {clientData?.id ? 'Update' : 'Create'}
          </Button>
        </ButtonWrapper>
      </Form>
    </Modal>
  );
};

export default AddClientModal;
