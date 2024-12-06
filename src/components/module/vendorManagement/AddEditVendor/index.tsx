import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  RenderPhoneNumber,
  RenderSelectInput,
  RenderTextArea,
  RenderTextInput
} from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { ICity, ICountry, IState } from 'services/api/country/types';
import { IAddVendorReq, IVendor, IVendorReq } from 'services/api/vendor/types';
import { useCityList, useCountryList, useStateList } from 'services/hooks/country';
import { useDashboardCompany } from 'services/hooks/dashboard';
import { dashboardKey, vendorKeys } from 'services/hooks/queryKeys';
import { useAddVendor, useEditVendor, useVendorDetail } from 'services/hooks/vendor';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { Designation } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const AddEditVendor = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddVendor();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditVendor();
  const { data: vendorData } = useVendorDetail(Number(id));
  const [value, setValue] = useState<string>('');
  const { employeeData } = authStore((state) => state);

  const { data: companyList } = useDashboardCompany();
  const companyListOption = companyList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const { data: countryOptions } = useCountryList();
  const [countryCode, setCountryCode] = useState<string>(vendorData?.countryCode ?? '');
  const [stateOptions, setStateOptions] = useState<IState[]>([]);

  const { data: stateList } = useStateList({
    countryCode: countryCode
  });

  useEffect(() => {
    if (stateList) {
      setStateOptions(stateList);
    }
  }, [stateList]);

  const handleCountryChange = (countryCode: string) => {
    setCountryCode(countryCode);
    setStateOptions([]);
  };

  // State changes
  const [stateCode, setStateCode] = useState<string>(vendorData?.stateCode ?? '');
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);

  const { data: cityList } = useCityList({
    countryCode: countryCode,
    stateCode: stateCode
  });

  useEffect(() => {
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
    navigate(ROUTES.vendorManagement);
  };

  const onSubmit = (value: IAddVendorReq) => {
    return vendorData?.id ? editVendor(value) : addVendor(value);
  };

  const addVendor = (value: IAddVendorReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate vendor list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [vendorKeys.vendorList({} as IVendorReq)].some((key) => {
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

  const editVendor = (value: IAddVendorReq) => {
    const data = {
      ...value,
      id: vendorData?.id ?? 0
    };
    editMutate(data, {
      onSuccess: (res) => {
        // invalidate vendor list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [vendorKeys.vendorList({} as IVendorReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set detail view
        queryClient.setQueryData<IVendor>(vendorKeys.vendorDetail(vendorData?.id ?? 0), () => {
          return { ...res } as IVendor;
        });
        handleClose();
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  useEffect(() => {
    if (employeeData) {
      form.setFieldsValue({
        accountManager: employeeData?.firstName + ' ' + employeeData?.lastName
      });
    }
    if (!vendorData) return;
    form.setFieldsValue({
      firstName: vendorData?.firstName ?? null,
      lastName: vendorData?.lastName ?? null,
      email: vendorData?.email ?? null,
      phone: vendorData?.phone ?? null,
      designation: vendorData?.designation ?? null,
      companyId: vendorData?.company?.id ?? null,
      vendorCompanyName: vendorData?.vendorCompanyName ?? null,
      accountManager: vendorData?.accountManager ?? null,
      website: vendorData?.website ?? null,
      address: vendorData?.address ?? null,
      countryCode: vendorData?.countryCode ?? null,
      stateCode: vendorData?.stateCode ?? null,
      cityName: vendorData?.cityName ?? null,
      skypeId: vendorData?.skypeId ?? null
    });
  }, [vendorData, form, employeeData]);

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.vendorManagement}>Vendors</Link>
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
              name="email"
              placeholder="Enter your email address"
              label="Email"
              allowClear="allowClear"
              size="middle"
              disabled={Boolean(vendorData?.email)}
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
              col={{ xs: 18 }}
              name="phone"
              placeholder="Enter your phone number "
              label="Phone Number"
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
            <RenderTextArea
              col={{ xs: 18 }}
              name="address"
              placeholder="Enter your address"
              label="Address"
              allowClear="allowClear"
              size="middle"
            />
            <RenderSelectInput
              col={{ xs: 18 }}
              name="designation"
              placeholder="Select your designation"
              label="Designation"
              optionLabel={Designation}
              rules={[
                {
                  required: true,
                  message: 'Please select your designation'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 18 }}
              name="companyId"
              placeholder="Select company"
              label="Company"
              allowClear={true}
              optionLabel={companyListOption}
              disabled={Boolean(vendorData?.company.id)}
              rules={[
                {
                  required: true,
                  message: 'Please select company'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 18 }}
              name="vendorCompanyName"
              placeholder="Enter your vendor company name"
              label="Vendor Company Name"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your vendor company name'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 18 }}
              name="accountManager"
              placeholder="Enter your account manager"
              label="Account Manager"
              allowClear="allowClear"
              size="middle"
              disabled={Boolean(
                vendorData?.accountManager ?? employeeData?.firstName + ' ' + employeeData?.lastName
              )}
              rules={[
                {
                  required: true,
                  message: 'Please enter your account manager'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 18 }}
              name="website"
              placeholder="Enter your vendor website"
              label="Website"
              allowClear="allowClear"
              size="middle"
            />
            <RenderSelectInput
              col={{ xs: 18 }}
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
              col={{ xs: 18 }}
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
            />
            <RenderSelectInput
              col={{ xs: 18 }}
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
            />
            <RenderTextInput
              col={{ xs: 18 }}
              name="skypeId"
              placeholder="Enter your Skype Id"
              label="Skype Id"
              allowClear="allowClear"
              size="middle"
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
                {vendorData?.id ? 'Update' : 'Create'}
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditVendor;
