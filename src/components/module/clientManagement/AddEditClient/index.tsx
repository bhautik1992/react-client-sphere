import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  RenderPhoneNumber,
  RenderSelectInput,
  RenderTextArea,
  RenderTextInput
} from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IAddClientReq, IClient, IClientReq } from 'services/api/client/types';
import { ICity, ICountry, IState } from 'services/api/country/types';
import { useAddClient, useClientDetail, useEditClient } from 'services/hooks/client';
import { useCityList, useCountryList, useStateList } from 'services/hooks/country';
import { useDashboardCompany, useDashboardEmployee } from 'services/hooks/dashboard';
import { clientKeys, dashboardKey } from 'services/hooks/queryKeys';
import { authStore } from 'services/store/auth';

import { IApiError } from 'utils/Types';
import { ClientStatus } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const AddEditClient = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddClient();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditClient();
  const { data: clientData } = useClientDetail(Number(id));
  const [value, setValue] = useState<string>('');
  const { employeeData } = authStore((state) => state);

  const { data: employeeList } = useDashboardEmployee();
  const employeeListOption = employeeList?.map((item) => {
    return {
      label: `${item.firstName} ${item.lastName}`,
      value: item.id
    };
  });

  const { data: companyList } = useDashboardCompany();
  const companyListOption = companyList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const { data: countryOptions } = useCountryList();
  const [countryCode, setCountryCode] = useState<string>(clientData?.countryCode ?? '');
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
    form.setFieldsValue({ stateCode: '' });
  };

  // State changes
  const [stateCode, setStateCode] = useState<string>(clientData?.stateCode ?? '');
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
    form.setFieldsValue({ cityCode: '' });
  };

  const handleClose = () => {
    form.resetFields();
    navigate(ROUTES.clientManagement);
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

  useEffect(() => {
    if (employeeData) {
      form.setFieldsValue({
        accountManager: employeeData?.firstName + ' ' + employeeData?.lastName
      });
    }
    if (!clientData) return;
    form.setFieldsValue({
      firstName: clientData?.firstName ?? null,
      lastName: clientData?.lastName ?? null,
      nickName: clientData?.nickName ?? null,
      email: clientData?.email ?? null,
      phone: clientData?.phone ?? null,
      companyId: clientData?.company?.id ?? null,
      clientCompanyName: clientData?.clientCompanyName ?? null,
      accountManagerId: clientData?.accountManager?.id ?? null,
      website: clientData?.website ?? null,
      gender: clientData?.gender ?? null,
      address: clientData?.address ?? null,
      countryCode: clientData?.countryCode ?? null,
      stateCode: clientData?.stateCode ?? null,
      cityName: clientData?.cityName ?? null,
      zipCode: clientData?.zipCode ?? null,
      status: clientData?.status ?? null,
      comment: clientData?.comment ?? null
    });
  }, [clientData, form, employeeData]);

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.clientManagement}>Clients</Link>
    },
    {
      title: id ? 'Edit Client' : 'Add Client'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Client' : 'Add Client'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <RenderTextInput
              col={{ xs: 12 }}
              name="firstName"
              placeholder="Enter first name"
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
              placeholder="Enter last name"
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
              name="nickName"
              placeholder="Enter nick name"
              label="Nick Name"
              allowClear="allowClear"
              size="middle"
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="email"
              placeholder="Enter email address"
              label="Email"
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
              placeholder="Enter phone number "
              label="Phone Number"
              onChange={(value: any) => setValue(value)}
              value={value}
              rules={[
                {
                  required: true,
                  message: 'Please enter phone number'
                }
              ]}
            />
            <RenderTextArea
              col={{ xs: 12 }}
              name="address"
              placeholder="Enter address"
              label="Address"
              allowClear="allowClear"
              size="middle"
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="companyId"
              placeholder="Select company"
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
              placeholder="Enter client company name"
              label="Client Company"
              allowClear="allowClear"
              size="middle"
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="accountManagerId"
              placeholder="Select account manager"
              label="Account Manager"
              optionLabel={employeeListOption}
              rules={[
                {
                  required: true,
                  message: 'Please select account manager'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="gender"
              placeholder="Select your gender"
              label="Gender"
              allowClear={true}
              optionLabel={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' }
              ]}
              rules={[
                {
                  required: true,
                  message: 'Please select gender'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="website"
              placeholder="Enter client website"
              label="Website"
              allowClear="allowClear"
              size="middle"
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="status"
              placeholder="Select your status"
              label="Status"
              allowClear={true}
              optionLabel={ClientStatus}
              rules={[
                {
                  required: true,
                  message: 'Please select status'
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
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="zipCode"
              placeholder="Enter zip code"
              label="Zip Code"
              allowClear="allowClear"
              size="middle"
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
                {clientData?.id ? 'Update' : 'Create'}
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditClient;
