import {
  ButtonWrapper,
  TableWrapper,
  TotalAmountInput,
  TotalAmountLabel,
  TotalAmountWrapper
} from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, Divider, Form, Input, InputRef, Row, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  RenderDatePicker,
  RenderSelectInput,
  RenderTextArea,
  RenderTextInput
} from 'components/common/FormField';
import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IInvoice, IInvoiceAmount, IInvoiceReq } from 'services/api/invoice/types';
import { IAddPaymentReq, IPaymentReq } from 'services/api/payment/types';
import { useDashboardCompany, useDashboardProject } from 'services/hooks/dashboard';
import { useInvoiceByProjectId, useMarkAsPaidInvoice } from 'services/hooks/invoice';
import { useAddPayment, useGeneratePaymentNumber, usePaymentDetail } from 'services/hooks/payment';
import { invoiceKeys, paymentKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import { COMPANY_EMAIL, PaymentMethod, ProjectStatusName } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';

const AddEditPayment = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useAddPayment();
  const { data: paymentData } = usePaymentDetail(Number(id));
  const [projectId, setProjectId] = useState<number>();
  const [invoiceListData, setInvoiceListData] = useState<IInvoice[]>([]);
  const { data: invoiceList } = useInvoiceByProjectId(Number(projectId));
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);
  const [invoiceAmount, setInvoiceAmount] = useState<IInvoiceAmount[]>([]);
  const inputRefs = useRef<{ [key: number]: InputRef | null }>({});
  const { data: generatedPaymentNumber } = useGeneratePaymentNumber();
  const { mutate: markAsPaidMutate } = useMarkAsPaidInvoice();

  const { data: companyList } = useDashboardCompany();
  const companyListOption = companyList?.map((item) => {
    return {
      label: item.name,
      value: item.id
    };
  });

  const { data: projectList } = useDashboardProject();
  const projectListOption = projectList
    ?.filter((item) => item.status === ProjectStatusName.Started)
    ?.map((item) => {
      return {
        label: item.name,
        value: item.id
      };
    });

  useEffect(() => {
    if (invoiceList && invoiceList.length > 0) {
      const invoiceListData = invoiceList.filter(
        (item) => item.isPaymentReceived === false && item.markAsPaid === false
      );
      setInvoiceListData(invoiceListData);
    }
  }, [invoiceList]);

  const handleProjectChange = (projectId: number) => {
    setProjectId(projectId);
  };

  const handleClose = () => {
    form.resetFields();
    navigate(ROUTES.paymentManagement);
  };

  const onSubmit = (value: IAddPaymentReq) => {
    if (invoiceListData?.length === 0) {
      message.error('There are no invoices pending.');
      return;
    }
    if (invoiceListData?.length > 0 && selectedInvoiceIds.length === 0) {
      message.error('Please select at least one invoice.');
      return;
    }
    value.invoiceIds = selectedInvoiceIds;
    value.invoiceAmount = invoiceAmount;
    return addPayment(value);
  };

  const setInvoiceAmtChange = (invoice: IInvoice, newAmount: number) => {
    setInvoiceAmount((prevData: IInvoiceAmount[]) => {
      const updatedData = prevData.map((item) => {
        if (item.id === invoice.id) {
          return { ...item, invoicedCost: newAmount };
        }
        return item;
      });
      if (!updatedData.some((item) => item.id === invoice.id)) {
        updatedData.push({ id: invoice.id, invoicedCost: newAmount });
      }
      return updatedData;
    });
  };

  const handleCheckboxChange = (e: any, invoice: IInvoice, paymentAmount: string) => {
    const isChecked = e.target.checked;
    setSelectedInvoiceIds((prevSelectedInvoiceIds) => {
      const updatedCrIds = isChecked
        ? [...prevSelectedInvoiceIds, invoice.id]
        : prevSelectedInvoiceIds.filter((id) => id !== invoice.id);
      return updatedCrIds;
    });
    if (isChecked) {
      setInvoiceAmtChange(invoice, +paymentAmount);
    } else {
      const invoiceAmountUpdate = invoiceAmount.filter((item) => item.id !== invoice.id);
      setInvoiceAmount(invoiceAmountUpdate);
    }
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>, invoice: IInvoice) => {
    const newAmount = +e.target.value;
    if (newAmount > invoice.amount)
      return message.error('Invoice amount cannot be greater than total amount.');
    setInvoiceAmtChange(invoice, newAmount);
  };

  const handleMarkAsPaidChange = (invoice: IInvoice) => {
    markAsPaidMutate(invoice.id, {
      onSuccess: () => {
        // invalidate invoice list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [invoiceKeys.invoiceList({} as IInvoiceReq)].some((key) => {
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

  const addPayment = (value: IAddPaymentReq) => {
    mutate(value, {
      onSuccess: () => {
        // invalidate payment list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [paymentKeys.paymentList({} as IPaymentReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // invalidate dashboard
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [invoiceKeys.invoiceByProjectId(Number(projectId))].some((key) => {
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

  useEffect(() => {
    form.setFieldsValue({
      companyId: companyList?.find((item) => item.email === COMPANY_EMAIL)?.id,
      paymentDate: dayjs(new Date()),
      conversionRate: 1,
      paymentNumber: generatedPaymentNumber
    });
    if (!paymentData) return;
    form.setFieldsValue({
      paymentNumber: paymentData?.paymentNumber ?? '',
      paymentMethod: paymentData?.paymentMethod ?? '',
      paymentDate: paymentData?.paymentDate ? dayjs(paymentData?.paymentDate) : null,
      companyId: paymentData?.companyId ?? null,
      receivedINR: paymentData?.receivedINR ?? null,
      conversionRate: paymentData?.conversionRate ?? null,
      comment: paymentData?.comment ?? null
    });
  }, [paymentData, form, companyList, invoiceAmount, generatedPaymentNumber]);

  const invoiceTableColumns: ColumnsType<IInvoice> = [
    {
      title: 'Select',
      dataIndex: 'select',
      key: 'select',
      render: (_, record: IInvoice) => (
        <Checkbox
          onChange={(e) =>
            handleCheckboxChange(e, record, inputRefs.current[record.id]?.input?.value ?? '0')
          }
          checked={selectedInvoiceIds.includes(record.id)}
        />
      )
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber'
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      render: (_, record: IInvoice) => <>{record?.project?.name ?? '-'}</>
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      render: (_, record: IInvoice) => <>{record?.project?.currency ?? '-'}</>
    },
    {
      title: 'Total Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, record: IInvoice) => <>{record?.amount ?? '-'}</>
    },
    {
      title: 'Other Amount',
      dataIndex: 'additionalAmount',
      key: 'additionalAmount',
      render: (_, record: IInvoice) => <>{record?.additionalAmount ?? '-'}</>
    },
    {
      title: 'Paid Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: false,
      render: (_, record: IInvoice) => <>{record?.paidAmount ?? '-'}</>
    },
    {
      title: 'Due Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: false,
      render: (_, record: IInvoice) => <>{+record?.amount - +record?.paidAmount}</>
    },
    {
      title: 'Received Amount',
      dataIndex: 'receivedAmount',
      key: 'receivedAmount',
      sorter: false,
      render: (_, record: IInvoice) => {
        const isDisabled = !selectedInvoiceIds.includes(record.id);
        return (
          <Input
            defaultValue={+record.amount - +record.paidAmount}
            disabled={isDisabled}
            onChange={(e) => handleInvoiceChange(e, record)}
            ref={(el) => (inputRefs.current[record.id] = el)}
          />
        );
      }
    },
    {
      title: 'Mark As Paid',
      dataIndex: 'markAsPaid',
      key: 'markAsPaid',
      render: (_, record: IInvoice) => {
        const isDisabled = !selectedInvoiceIds.includes(record.id);
        return <Checkbox disabled={isDisabled} onChange={() => handleMarkAsPaidChange(record)} />;
      }
    }
  ];

  const BreadcrumbsPath = [
    {
      title: <Link to={ROUTES.paymentManagement}>Payments</Link>
    },
    {
      title: id ? 'Edit Payment' : 'Add Payment'
    }
  ];
  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">{id ? 'Edit Payment' : 'Add Payment'}</h2>
        </div>

        <Form onFinish={onSubmit} form={form} autoComplete="off" className="signInForm">
          <Row gutter={[0, 30]}>
            <Divider orientation="left">Payment Information</Divider>
            <RenderTextInput
              col={{ xs: 12 }}
              name="paymentNumber"
              placeholder="Payment No."
              label="Payment No."
              allowClear={true}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="paymentMethod"
              placeholder="Select payment method"
              label="Payment Method"
              allowClear={true}
              optionLabel={PaymentMethod}
              rules={[
                {
                  required: true,
                  message: 'Please select payment method'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="companyId"
              placeholder="Select company"
              label="Company"
              allowClear={true}
              optionLabel={companyListOption}
              rules={[
                {
                  required: true,
                  message: 'Please select parent company'
                }
              ]}
            />
            <RenderSelectInput
              col={{ xs: 12 }}
              name="projectId"
              placeholder="Select project"
              label="Select Project"
              optionLabel={projectListOption}
              onChange={handleProjectChange}
              rules={[
                {
                  required: true,
                  message: 'Please select project'
                }
              ]}
            />
            <RenderDatePicker
              col={{ xs: 12 }}
              disabledDate={(currentDate: dayjs.Dayjs) => currentDate.isAfter(new Date())}
              name="paymentDate"
              placeholder="Select payment date"
              label="Payment Date"
              allowClear="allowClear"
              size="middle"
              defaultValue={dayjs(new Date())}
              format={DATE_FORMAT}
              rules={[
                {
                  required: true,
                  message: 'Please select payment date'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="receivedINR"
              placeholder="Enter Received INR"
              label="Received INR"
              allowClear="allowClear"
              size="middle"
              onChange={(e: any) => {
                const amt = parseFloat(e.target.value) || 0;
                form.setFieldsValue({
                  receivedINR: amt
                });
              }}
              rules={[
                {
                  required: true,
                  message: 'Please enter received INR amount'
                }
              ]}
            />
            <RenderTextInput
              col={{ xs: 12 }}
              name="conversionRate"
              placeholder="Enter Conversion Rate"
              label="Conversion Rate"
              allowClear="allowClear"
              size="middle"
              defaultValue="1"
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
          {invoiceListData && invoiceListData.length > 0 && (
            <Row>
              <TableWrapper>
                <Divider orientation="left">Payment</Divider>
                <Table
                  columns={invoiceTableColumns}
                  dataSource={invoiceListData}
                  pagination={false}
                  rowKey="id"
                  footer={() => (
                    <TotalAmountWrapper>
                      <TotalAmountLabel>Total Amount: </TotalAmountLabel>
                      <TotalAmountInput
                        value={invoiceAmount?.reduce(
                          (total: number, current: IInvoiceAmount) => total + current.invoicedCost,
                          0
                        )}
                        disabled={true}
                        size="middle"
                      />
                    </TotalAmountWrapper>
                  )}
                />
              </TableWrapper>
            </Row>
          )}
          <Row justify={'center'}>
            <ButtonWrapper>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                className="submitButton"
                type="primary"
                size="middle"
                htmlType="submit"
                disabled={isLoading}
              >
                {paymentData?.id ? 'Update' : 'Create'}
              </Button>
            </ButtonWrapper>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddEditPayment;
