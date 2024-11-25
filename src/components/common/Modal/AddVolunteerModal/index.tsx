import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Modal, ModalProps, Row, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { isPossiblePhoneNumber } from 'react-phone-number-input';

import {
  RenderDatePicker,
  RenderPhoneNumber,
  RenderSelectInput,
  RenderTextInput
} from 'components/common/FormField';

import { IDashboardReq } from 'services/api/dashboard/types';
import { IVolunteerDetail } from 'services/api/incident/type';
import { IAddVolunteerReq, IVolunteer, IVolunteerReq } from 'services/api/volunteer/types';
import { useJsonFile } from 'services/hooks/jsonFile';
import { dashboardKey, volunteerKeys } from 'services/hooks/queryKeys';
import { useAddVolunteer, useEditVolunteer } from 'services/hooks/volunteer';

import { IApiError } from 'utils/Types';
import { JsonFileType } from 'utils/constants';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { STATE_CITY_DATA } from 'utils/constants/stateAndCity';

interface IAddVolunteerModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  volunteerData?: IVolunteer | null;
}

const AddVolunteerModal: React.FC<IAddVolunteerModalProps & ModalProps> = ({
  className,
  isOpen,
  setIsOpen,
  volunteerData
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useAddVolunteer();
  const { mutate: editMutate, isLoading: isEditLoading } = useEditVolunteer();
  const { data: jsonData } = useJsonFile(JsonFileType.responderCategory);

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>(volunteerData?.state ?? '');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);

    setAvailableCities(STATE_CITY_DATA[newState as keyof typeof STATE_CITY_DATA] || []);

    form.setFieldsValue({
      ['city']: null
    });
  };

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'backdropClick') return;

    setOpen(false);

    setIsOpen?.(false);
  };

  const onSubmit = (value: IAddVolunteerReq) => {
    return volunteerData?._id ? editVolunteer(value) : addVolunteer(value);
  };

  const addVolunteer = (value: IAddVolunteerReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate volunteer list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [volunteerKeys.volunteerList({} as IVolunteerReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // invalidate dashboard
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [dashboardKey.dashboardCount({} as IDashboardReq)].some((key) => {
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

  const editVolunteer = (value: IAddVolunteerReq) => {
    const data = {
      ...value,
      _id: volunteerData?._id ?? ''
    };
    editMutate(data, {
      onSuccess: (res) => {
        // invalidate volunteer list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [volunteerKeys.volunteerList({} as IVolunteerReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set detail view
        queryClient.setQueryData<IVolunteerDetail>(
          volunteerKeys.volunteerDetail(volunteerData?._id ?? ''),
          () => {
            return { ...res } as IVolunteerDetail;
          }
        );
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
      title={volunteerData ? 'Edit Responder' : 'Add Responder'}
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
          firstName: volunteerData?.firstName ?? '',
          lastName: volunteerData?.lastName ?? '',
          email: volunteerData?.email ?? '',
          phoneNumber: volunteerData?.phoneNumber ?? null,
          designation: volunteerData?.designation ?? null,
          birthDate: volunteerData?.birthDate ? dayjs(volunteerData?.birthDate) : '',
          gender: volunteerData?.gender ?? null,
          address: volunteerData?.address ?? null,
          country: 'United States of America',
          state: volunteerData?.state ?? null,
          city: volunteerData?.city ?? null,
          zipCode: volunteerData?.zipCode ?? ''
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
            disabled={Boolean(volunteerData?.email)}
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
            name="phoneNumber"
            placeholder="Enter your phone number "
            label="Phone number"
            onChange={(value: any) => setValue(value)}
            value={value}
            rules={[
              () => ({
                validator: (_: any, value: string) => {
                  if (!value || isPossiblePhoneNumber(value)) {
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
            name="designation"
            placeholder="Enter your category"
            label="Categories"
            optionLabel={jsonData}
            rules={[
              {
                required: true,
                message: 'Please enter your Category'
              }
            ]}
          />
          <RenderDatePicker
            col={{ xs: 24 }}
            disabledDate={(currentDate: dayjs.Dayjs) => currentDate.isAfter(new Date())}
            name="birthDate"
            placeholder="Enter your birthdate"
            label="Birthdate"
            allowClear="allowClear"
            size="middle"
            format={DATE_FORMAT}
          />
          <RenderSelectInput
            col={{ xs: 24 }}
            name="gender"
            placeholder="Enter your gender"
            label="Gender"
            allowClear={true}
            optionLabel={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' }
            ]}
          />
          <RenderTextInput
            col={{ xs: 24 }}
            name="address"
            placeholder="Enter your address"
            label="Address"
            allowClear="allowClear"
            size="middle"
          />
          <RenderTextInput
            col={{ xs: 24 }}
            name="country"
            label="Country"
            allowClear="allowClear"
            size="middle"
            disabled={true}
          />
          <RenderSelectInput
            col={{ xs: 24 }}
            name="state"
            placeholder="Enter your state"
            label="State"
            onChange={handleStateChange}
            optionLabel={Object.keys(STATE_CITY_DATA).map((state) => ({
              value: state,
              label: state
            }))}
          />
          <RenderSelectInput
            col={{ xs: 24 }}
            name="city"
            placeholder="Enter your city"
            label="City"
            disabled={!selectedState}
            optionLabel={availableCities.map((city) => ({
              value: city,
              label: city
            }))}
          />

          <RenderTextInput
            col={{ xs: 24 }}
            name="zipCode"
            placeholder="Enter your zip code"
            label="Zip code"
            allowClear="allowClear"
            size="middle"
            type="number"
            maxLength={5}
            rules={[
              () => ({
                validator: (_: any, value: string) => {
                  if (/^(\d{5})?$/.test(value) || !value) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error('Please enter valid zip code'));
                  }
                }
              })
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
            {volunteerData?._id ? 'Update' : 'Create'}
          </Button>
        </ButtonWrapper>
      </Form>
    </Modal>
  );
};

export default AddVolunteerModal;
