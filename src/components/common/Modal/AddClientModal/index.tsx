import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import React, { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import {
  RenderPhoneNumber,
  RenderSelectInput,
  RenderTextArea,
  RenderTextInput
} from 'components/common/FormField';

import { ISignInRes } from 'services/api/auth/types';
import { IAddClientReq, IClient, IClientReq } from 'services/api/client/types';
import { ICity, ICountry, IState } from 'services/api/country/types';
import { useAddClient, useEditClient } from 'services/hooks/client';
import { useCityList, useCountryList, useStateList } from 'services/hooks/country';
import { useDashboardCompany } from 'services/hooks/dashboard';
import { clientKeys, dashboardKey } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';

interface IAddClientModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  clientData?: IClient | null;
  userData?: ISignInRes | null;
}

const AddClientModal: React.FC<IAddClientModalProps & ModalProps> = ({
  className,
  width = 1300,
  isOpen,
  setIsOpen,
  clientData,
  userData
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useAddClient();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditClient();

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const { data: companyList } = useDashboardCompany();

  const companyListOption = companyList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const { data: countryOptions } = useCountryList();
  // Country changes
  const [countryCode, setCountryCode] = useState<string>(clientData?.countryCode ?? '');
  const [stateOptions, setStateOptions] = useState<IState[]>([]);

  const { data: stateList } = useStateList({
    countryCode: countryCode
  });

  React.useEffect(() => {
    if (stateList) {
      setStateOptions(stateList);
    }
  }, [stateList]);

  const handleCountryChange = (countryCode: string) => {
    setCountryCode(countryCode);
    setStateOptions([]);
  };

  // State changes
  const [stateCode, setStateCode] = useState<string>(clientData?.stateCode ?? '');
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);

  const { data: cityList } = useCityList({
    countryCode: countryCode,
    stateCode: stateCode
  });

  React.useEffect(() => {
    if (cityList) {
      setCityOptions(cityList);
    }
  }, [cityList]);

  const handleStateChange = (stateCode: string) => {
    setStateCode(stateCode);
    setCityOptions([]);
  };

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

        // client list dashboard
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardClient].some((key) => {
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
      width={width}
      footer={[]}
    >
      <Form
        onFinish={onSubmit}
        form={form}
        autoComplete="off"
        className="signInForm"
        initialValues={{
          firstName: clientData?.firstName ?? '',
          lastName: clientData?.lastName ?? '',
          email: clientData?.email ?? '',
          phone: clientData?.phone ?? null,
          designation: clientData?.designation ?? null,
          companyId: clientData?.company?.id ?? null,
          clientCompanyName: clientData?.clientCompanyName ?? null,
          accountManager: clientData?.accountManager
            ? clientData?.accountManager
            : userData?.firstName + ' ' + userData?.lastName,
          webSite: clientData?.webSite ?? null,
          gender: clientData?.gender ?? null,
          address: clientData?.address ?? null,
          countryCode: clientData?.countryCode ?? null,
          stateCode: clientData?.stateCode ?? null,
          cityName: clientData?.cityName ?? null,
          zipCode: clientData?.zipCode ?? null,
          status: clientData?.status ?? null
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
            col={{ xs: 12 }}
            name="phone"
            placeholder="Enter your phone number "
            label="Phone number"
            onChange={(value: any) => setValue(value)}
            value={value}
            rules={[
              () => ({
                validator: (_: any, value: string) => {
                  if (!value || isValidPhoneNumber(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error('Please enter valid phone number'));
                  }
                }
              })
            ]}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="designation"
            placeholder="Enter your designation"
            label="Designation"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter your designation'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 12 }}
            name="companyId"
            placeholder="Please select company"
            label="Company"
            allowClear={true}
            optionLabel={companyListOption}
            disabled={Boolean(clientData?.company.id)}
            rules={[
              {
                required: true,
                message: 'Please select company'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="clientCompanyName"
            placeholder="Enter your client company name"
            label="Client company name"
            allowClear="allowClear"
            size="middle"
            rules={[
              {
                required: true,
                message: 'Please enter your client company name'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="accountManager"
            placeholder="Enter your account manager"
            label="Account manager"
            allowClear="allowClear"
            size="middle"
            disabled={Boolean(
              clientData?.accountManager || userData?.firstName + ' ' + userData?.lastName
            )}
            rules={[
              {
                required: true,
                message: 'Please enter your account manager'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 12 }}
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
          <RenderSelectInput
            col={{ xs: 12 }}
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
          <RenderTextArea
            col={{ xs: 12 }}
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
            col={{ xs: 12 }}
            name="countryCode"
            placeholder="Please select country"
            label="Country"
            allowClear={true}
            showSearch={true}
            optionLabel={countryOptions?.map((country: ICountry) => ({
              label: country.name,
              value: country.isoCode
            }))}
            onSelect={handleCountryChange}
            rules={[
              {
                required: true,
                message: 'Please select country'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 12 }}
            name="stateCode"
            placeholder="Please select state"
            label="State"
            showSearch={true}
            allowClear={true}
            disabled={!stateOptions.length}
            optionLabel={stateOptions?.map((state: IState) => ({
              label: state.name,
              value: state.isoCode
            }))}
            onSelect={handleStateChange}
            rules={[
              {
                required: true,
                message: 'Please select state'
              }
            ]}
          />
          <RenderSelectInput
            col={{ xs: 12 }}
            name="cityName"
            placeholder="Please select city"
            label="City"
            showSearch={true}
            allowClear={true}
            disabled={!cityOptions.length}
            optionLabel={cityOptions?.map((city: ICity) => ({
              label: city.name,
              value: city.name
            }))}
            rules={[
              {
                required: true,
                message: 'Please select city'
              }
            ]}
          />
          <RenderTextInput
            col={{ xs: 12 }}
            name="zipCode"
            placeholder="Enter your zip code"
            label="Zip code"
            allowClear="allowClear"
            size="middle"
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
