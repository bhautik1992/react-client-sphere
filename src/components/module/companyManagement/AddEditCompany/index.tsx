import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Row, message } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { RenderSelectInput, RenderTextArea, RenderTextInput } from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IAddCompanyReq, ICompany, ICompanyReq } from 'services/api/company/types';
import { ICity, ICountry, IState } from 'services/api/country/types';
import { useAddCompany, useCompanyDetail, useEditCompany } from 'services/hooks/company';
import { useCityList, useCountryList, useStateList } from 'services/hooks/country';
import { companyKeys, dashboardKey } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';

const AddEditCompany = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { mutate, isLoading } = useAddCompany();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditCompany();
  const { data: countryOptions } = useCountryList();
  const { data: companyData } = useCompanyDetail(Number(id));

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

  const handleClose = () => {
    form.resetFields();
    navigate(ROUTES.companyManagement);
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

        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardCompany].some((key) => {
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

  React.useEffect(() => {
    if (!companyData) return;
    form.setFieldsValue({
      name: companyData?.name ?? '',
      email: companyData?.email ?? '',
      address: companyData?.address ?? null,
      countryCode: companyData?.countryCode ?? null,
      stateCode: companyData?.stateCode ?? null,
      cityName: companyData?.cityName ?? null,
      comment: companyData?.comment ?? ''
    });
  }, [companyData, form]);

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.companyManagement}>Vendors</Link>
    },
    {
      title: id ? 'Edit Vendor' : 'Add Vendor'
    }
  ];

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Vendor' : 'Add Vendor'}</h2>
        </div>
        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <RenderTextInput
              col={{ xs: 12 }}
              name="name"
              placeholder="Enter name"
              label="Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="email"
              placeholder="Enter email address"
              label="Email"
              allowClear="allowClear"
              size="middle"
              disabled={Boolean(companyData?.email)}
              rules={[
                {
                  required: true,
                  message: 'Please enter email address'
                },
                {
                  type: 'email',
                  message: 'Please enter valid email address'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="address"
              placeholder="Enter address"
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
            <RenderSelectInput
              col={{ xs: 12 }}
              name="countryCode"
              placeholder="Select country"
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
              placeholder="Select state"
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
              placeholder="Select city"
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
            <RenderTextArea
              col={{ xs: 12 }}
              name="comment"
              placeholder="Enter comment"
              label="Comment"
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
              {companyData?.id ? 'Update' : 'Create'}
            </Button>
          </ButtonWrapper>
        </Form>
      </div>
    </>
  );
};

export default AddEditCompany;
