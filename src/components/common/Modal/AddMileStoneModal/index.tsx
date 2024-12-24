import { ButtonWrapper, RemoveWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Col, Divider, Form, Modal, ModalProps, Row, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { RenderDatePicker, RenderTextInput } from 'components/common/FormField';

import { IAddMileStoneReq, IMileStone } from 'services/api/mileStone/types';
import { useDeleteMilestone } from 'services/hooks/milestone';
import { projectKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import pattern from 'utils/constants/pattern';

interface IAddMileStoneModalProps {
  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
  mileStoneData?: IMileStone[] | [];
  projectStartDate?: string;
  projectId: number;
  onSubmitSuccess?: (values: IAddMileStoneReq[]) => void;
}

const AddEditMileStoneModal: React.FC<IAddMileStoneModalProps & ModalProps> = ({
  className,
  isOpen,
  setIsOpen,
  mileStoneData,
  projectStartDate,
  projectId,
  onSubmitSuccess
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: deleteMutate } = useDeleteMilestone();

  useEffect(() => {
    if (mileStoneData?.length) {
      form.setFieldsValue({
        milestones: mileStoneData?.map((mileStone) => ({
          id: mileStone?.id ?? null,
          name: mileStone?.name ?? '',
          details: mileStone?.details ?? '',
          PISHours: mileStone?.PISHours ?? 0,
          PMSHours: mileStone?.PMSHours ?? 0,
          cost: mileStone?.cost ?? 0,
          startDate: mileStone?.startDate ? dayjs(mileStone?.startDate) : null,
          endDate: mileStone?.endDate ? dayjs(mileStone?.endDate) : null
        }))
      });
    }
  }, [mileStoneData, form]);

  const handleDeleteModal = (id?: number) => {
    if (!id) return;
    deleteMutate(id, {
      onSuccess: () => {
        message.success('Milestone deleted successfully');
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [projectKeys.projectDetail(projectId)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'backdropClick') return;
    setOpen(false);
    setIsOpen?.(false);
  };

  const onSubmit = (values: { milestones: IAddMileStoneReq[] }) => {
    if (onSubmitSuccess) {
      onSubmitSuccess(values.milestones);
    }
    handleClose();
  };

  return (
    <Modal
      open={Boolean(open || isOpen)}
      className={className}
      title={mileStoneData?.length ? 'Edit Milestone' : 'Add Milestones'}
      onCancel={handleClose}
      destroyOnClose={true}
      centered
      width={800}
      footer={[]}
    >
      <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
        <Form.List name="milestones">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Row key={key} gutter={[0, 30]}>
                  <RenderTextInput
                    col={{ xs: 12 }}
                    placeholder="Milestone Name"
                    label="Name"
                    name={[name, 'name']}
                    allowClear="allowClear"
                    size="middle"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter milestone name'
                      }
                    ]}
                  />
                  <RenderTextInput
                    col={{ xs: 12 }}
                    placeholder="Milestone Details"
                    label="Details"
                    name={[name, 'details']}
                    allowClear="allowClear"
                    size="middle"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter milestone details'
                      }
                    ]}
                  />
                  <RenderTextInput
                    col={{ xs: 12 }}
                    name={[name, 'PISHours']}
                    placeholder="Enter PIS Hours"
                    label="PIS Hours"
                    allowClear="allowClear"
                    size="middle"
                    rules={[
                      () => ({
                        validator: (_: any, value: string) => {
                          const regex = pattern.regex;
                          if (!regex.test(value)) {
                            return Promise.reject(new Error('Please enter valid PIS hours'));
                          }
                          if (+value <= 0) {
                            return Promise.reject(new Error('PIS hours must be greater than 0'));
                          }
                          return Promise.resolve();
                        }
                      })
                    ]}
                  />
                  <RenderTextInput
                    col={{ xs: 12 }}
                    name={[name, 'PMSHours']}
                    placeholder="Enter PMS hours"
                    label="PMS Hours"
                    allowClear="allowClear"
                    size="middle"
                    rules={[
                      () => ({
                        validator: (_: any, value: string) => {
                          const regex = pattern.regex;
                          if (!regex.test(value)) {
                            return Promise.reject(new Error('Please enter valid PMS hours'));
                          }
                          if (+value <= 0) {
                            return Promise.reject(new Error('PMS hours must be greater than 0'));
                          }
                          return Promise.resolve();
                        }
                      })
                    ]}
                  />
                  <RenderTextInput
                    col={{ xs: 12 }}
                    name={[name, 'cost']}
                    placeholder="Enter cost"
                    label="Cost"
                    allowClear="allowClear"
                    size="middle"
                    rules={[
                      () => ({
                        validator: (_: any, value: string) => {
                          const regex = pattern.regex;
                          if (!regex.test(value)) {
                            return Promise.reject(new Error('Please enter valid cost'));
                          }
                          if (+value <= 0) {
                            return Promise.reject(new Error('Cost must be greater than 0'));
                          }
                          return Promise.resolve();
                        }
                      })
                    ]}
                  />
                  <RenderDatePicker
                    col={{ xs: 12 }}
                    label="Start Date"
                    disabledDate={(currentDate: dayjs.Dayjs) =>
                      currentDate.isBefore(projectStartDate)
                    }
                    allowClear="allowClear"
                    size="middle"
                    placeholder="Select start date"
                    format={DATE_FORMAT}
                    name={[name, 'startDate']}
                    rules={[{ required: true, message: 'Please select start date' }]}
                  />
                  <RenderDatePicker
                    col={{ xs: 12 }}
                    label="End Date"
                    disabledDate={(currentDate: dayjs.Dayjs) =>
                      currentDate.isBefore(form.getFieldValue('startDate'))
                    }
                    name={[name, 'endDate']}
                    allowClear="allowClear"
                    size="middle"
                    placeholder="Select end date"
                    format={DATE_FORMAT}
                  />
                  <Col span={12}>
                    <RemoveWrapper>
                      <Button
                        className="removeBtn"
                        type="primary"
                        onClick={() => {
                          remove(name);
                          handleDeleteModal(mileStoneData?.[name]?.id);
                        }}
                      >
                        Remove Milestone
                      </Button>
                    </RemoveWrapper>
                  </Col>
                  <Divider></Divider>
                </Row>
              ))}
              <Button type="primary" onClick={() => add()} block>
                Add Milestone
              </Button>
            </>
          )}
        </Form.List>

        <ButtonWrapper>
          <Button onClick={handleClose}>Cancel</Button>
          <Button className="submitButton" type="primary" size="middle" htmlType="submit">
            Add
          </Button>
        </ButtonWrapper>
      </Form>
    </Modal>
  );
};

export default AddEditMileStoneModal;
