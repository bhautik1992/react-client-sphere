import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import React, { useState } from 'react';

import { RenderTextInput } from 'components/common/FormField';

import { IAddCompanyReq, ICompany, ICompanyReq } from 'services/api/company/types';
import { useAddCompany, useEditCompany } from 'services/hooks/company';
import { companyKeys, dashboardKey } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';

interface IAddCompanyModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  companyData?: ICompany | null;
}

const AddEditCompanyModal: React.FC<IAddCompanyModalProps & ModalProps> = ({
  className,
  isOpen,
  setIsOpen,
  companyData
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useAddCompany();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditCompany();

  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'backdropClick') return;
    setOpen(false);
    setIsOpen?.(false);
  };

  const onSubmit = (value: IAddCompanyReq) => {
    return companyData?.id ? editCompany(value) : addCompany(value);
  };

  const addCompany = (value: IAddCompanyReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate company list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [companyKeys.companyList({} as ICompanyReq)].some((key) => {
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

  const editCompany = (value: IAddCompanyReq) => {
    const data = {
      ...value,
      id: companyData?.id ?? 0
    };
    editMutate(data, {
      onSuccess: (res) => {
        // invalidate company list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [companyKeys.companyList({} as ICompanyReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set detail view
        queryClient.setQueryData<ICompany>(companyKeys.companyDetail(companyData?.id ?? 0), () => {
          return { ...res } as ICompany;
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
      title={companyData ? 'Edit Company' : 'Add Company'}
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
          name: companyData?.name ?? '',
          email: companyData?.email ?? '',
          address: companyData?.address ?? null,
          country: companyData?.country ?? null
        }}
      >
        <Row gutter={[0, 30]}>
          <RenderTextInput
            col={{ xs: 24 }}
            name="name"
            placeholder="Enter company name"
            label="Name"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter company name'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 24 }}
            name="email"
            placeholder="Enter company email address"
            label="Email address"
            allowClear="allowClear"
            size="middle"
            disabled={Boolean(companyData?.email)}
            rules={[
              {
                required: true,
                message: 'Please enter company email address'
              },
              {
                type: 'email',
                message: 'Please enter valid email address'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 24 }}
            name="address"
            placeholder="Enter company address"
            label="Address"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter company address'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 24 }}
            name="country"
            placeholder="Enter country"
            label="Country"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter country'
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
            {companyData?.id ? 'Update' : 'Create'}
          </Button>
        </ButtonWrapper>
      </Form>
    </Modal>
  );
};

export default AddEditCompanyModal;
