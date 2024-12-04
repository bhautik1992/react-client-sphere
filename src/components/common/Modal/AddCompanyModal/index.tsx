import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import React, { useState } from 'react';

import { RenderSelectInput, RenderTextInput } from 'components/common/FormField';

import { IAddCompanyReq, ICompany, ICompanyReq } from 'services/api/company/types';
import { ICity, ICountry, IState } from 'services/api/country/types';
import { useAddCompany, useEditCompany } from 'services/hooks/company';
import { useCityList, useCountryList, useStateList } from 'services/hooks/country';
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
  const { data: countryOptions } = useCountryList();

  // Country changes
  const [countryCode, setCountryCode] = useState<string>(companyData?.countryCode ?? '');
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
  const [stateCode, setStateCode] = useState<string>(companyData?.stateCode ?? '');
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
          countryCode: companyData?.countryCode ?? null,
          stateCode: companyData?.stateCode ?? null,
          cityName: companyData?.cityName ?? null
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
            label="Email"
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
          <RenderSelectInput
            col={{ xs: 24 }}
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
            col={{ xs: 24 }}
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
            col={{ xs: 24 }}
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
