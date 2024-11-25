import { ButtonWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  RenderRangePicker,
  RenderSelectInput,
  RenderTextArea,
  RenderTextInput
} from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import {
  IAddTrainingReq,
  IEditTrainingReq,
  ITraining,
  ITrainingFormValue,
  ITrainingReq
} from 'services/api/training/types';
import { trainingKeys } from 'services/hooks/queryKeys';
import { useAddTraining, useEditTraining, useTrainingDetail } from 'services/hooks/training';

import { IApiError } from 'utils/Types';
import { designationData } from 'utils/constants/filterData';
import validation from 'utils/constants/pattern';
import { ROUTES } from 'utils/constants/routes';

const AddEditTraining = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useAddTraining();
  const { data: trainingDetail } = useTrainingDetail(id ?? '');
  const { mutate: mutateEditTraining } = useEditTraining();

  useEffect(() => {
    if (!id) return;
    form.setFieldsValue({
      ['title']: trainingDetail?.title ?? '',
      ['description']: trainingDetail?.description ?? '',
      ['additionalNote']: trainingDetail?.additionalNotes ?? '',
      ['trainingSchedule']:
        trainingDetail?.startDate && trainingDetail?.endDate
          ? [dayjs(trainingDetail?.startDate), dayjs(trainingDetail?.endDate)]
          : [],
      ['trainingFor']: trainingDetail?.departments ?? null,
      ['links']: trainingDetail?.links ?? ''
    });
  }, [form, id, trainingDetail]);

  const onSubmit = (value: ITrainingFormValue) => {
    const addValue: IAddTrainingReq = {
      title: value?.title,
      links: value?.links,
      description: value?.description,
      departments: value?.trainingFor,
      additionalNotes: value?.additionalNote,
      startDate: value?.trainingSchedule?.[0],
      endDate: value?.trainingSchedule?.[1]
    };
    const editValue: IEditTrainingReq = {
      ...addValue,
      _id: id ?? ''
    };
    return id ? editTrainingProgramm(editValue) : addTrainingProgramm(addValue);
  };

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.trainingMangement}>Training Management</Link>
    },
    {
      title: id ? 'Edit Training Program' : 'Add Training Program'
    }
  ];
  const addTrainingProgramm = (value: IAddTrainingReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate training list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [trainingKeys.trainingList({} as ITrainingReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        navigate(ROUTES.trainingMangement);
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  const editTrainingProgramm = (value: IEditTrainingReq) => {
    mutateEditTraining(value, {
      onSuccess: (res) => {
        // invalidate training list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [trainingKeys.trainingList({} as ITrainingReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set training program detail
        queryClient.setQueryData<ITraining>(trainingKeys?.trainingDetail(id ?? ''), () => {
          return { ...res } as ITraining;
        });

        navigate(ROUTES.trainingMangement);
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Training Program' : 'Add Training Program'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <RenderTextInput
              col={{ xs: 18 }}
              name="title"
              placeholder="Enter your title"
              label="Add Title"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your title'
                }
              ]}
            />
            <RenderTextArea
              col={{ xs: 18 }}
              name="description"
              placeholder="Enter your description"
              label="Description"
              allowClear="allowClear"
              size="middle"
              rows="8"
              rules={[
                {
                  required: true,
                  message: 'Please enter your description'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 18 }}
              name="additionalNote"
              placeholder="Enter your additional note"
              label="Add Additional Notes"
              allowClear="allowClear"
              size="middle"
              rules={[
                {
                  required: true,
                  message: 'Please enter your additional note'
                }
              ]}
            />
            <RenderRangePicker
              col={{ xs: 18 }}
              name="trainingSchedule"
              placeholder="Enter your training schedule "
              label="Add Training Schedule"
              rules={[
                {
                  required: true,
                  message: 'Please enter your training schedule'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 18 }}
              name="trainingFor"
              placeholder="Enter your Training for"
              label="Training for"
              optionLabel={designationData}
              mode="multiple"
              rules={[
                {
                  required: true,
                  message: 'Please enter your training for'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 18 }}
              name="links"
              placeholder="Enter your link"
              label="Links"
              allowClear="allowClear"
              size="middle"
              rules={[
                () => ({
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(new Error('Please enter your link'));
                    } else if (!validation.url.test(value)) {
                      return Promise.reject(new Error('Enter valid link'));
                    } else {
                      return Promise.resolve();
                    }
                  }
                })
              ]}
            />
          </Row>

          <Row justify={'center'}>
            <ButtonWrapper>
              <Button className="submitButton" type="primary" size="middle" htmlType="submit">
                Submit
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditTraining;
