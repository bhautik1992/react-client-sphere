import { DetailWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Col, Divider, Row, message } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IProject, IProjectReq } from 'services/api/project/types';
import { useProjectDetail, useProjectStatus } from 'services/hooks/project';
import { projectKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { DATE_FORMAT } from 'utils/constants/dayjs';
import {
  BillingType,
  ClientStatus,
  InvoicePaymentCycle,
  ProjectStatus,
  ProjectStatusName
} from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import ProjectStatusDropdown from 'utils/renderDropDownStatus/projectStatusDropDown';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.projectManagement}>Project</Link>
  },
  {
    title: 'Project Detail'
  }
];

const ViewProject = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: projectData } = useProjectDetail(Number(id));
  const { mutate } = useProjectStatus();

  const handleConfirm = (newStatus: string, id: number) => {
    const data = {
      status: newStatus,
      projectId: id
    };

    mutate(data, {
      onSuccess: (res) => {
        // invalidate project list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [projectKeys.projectList({} as IProjectReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set status in project detail
        queryClient.setQueryData<IProject>(projectKeys.projectDetail(Number(id)), () => {
          return { ...res } as unknown as IProject;
        });
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
          <h2 className="pageTitle">Project Detail</h2>
          <ProjectStatusDropdown
            status={projectData?.status ?? ProjectStatusName.NotStarted}
            projectId={projectData?.id ?? 0}
            onStatusChange={(newStatus, projectId) => handleConfirm(newStatus, projectId)}
          />
        </div>
        <DetailWrapper>
          <Divider orientation="left">Project Information</Divider>
          <Row className="projectRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{projectData?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Description</h4>
              <p>{projectData?.description ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Status</h4>
              <p>{ProjectStatus.find((item) => item.value == projectData?.status)?.label}</p>
            </Col>
            <Col xs={4}>
              <h4>Start Date</h4>
              <p>
                {projectData?.startDate ? dayjs(projectData?.startDate).format(DATE_FORMAT) : '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>End Date</h4>
              <p>{projectData?.endDate ? dayjs(projectData?.endDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Project Manager</h4>
              <p>
                {projectData?.projectManager
                  ? projectData?.projectManager?.firstName +
                    ' ' +
                    projectData?.projectManager?.lastName
                  : 'Outsourcing PM'}
              </p>
            </Col>
          </Row>
          <Row className="projectRow">
            <Col xs={4}>
              <h4>Team Leader</h4>
              <p>
                {projectData?.teamLeader?.firstName
                  ? `${projectData.teamLeader.firstName} ${projectData.teamLeader.lastName ?? ''}`
                  : '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Developers</h4>
              <p>
                {projectData?.developers?.length
                  ? projectData.developers
                      .map((dev) => `${dev.firstName} ${dev.lastName}`)
                      .join(', ')
                  : '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Technologies</h4>
              <p>{projectData?.technologies?.length ? projectData.technologies.join(', ') : '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Assign From Company</Divider>
          <Row className="projectRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{projectData?.assignFromCompany?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Email</h4>
              <p>{projectData?.assignFromCompany?.email ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Country</h4>
              <p>{projectData?.assignFromCompany?.countryName ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Assign To Company</Divider>
          <Row className="projectRow">
            <Col xs={4}>
              <h4>Name</h4>
              <p>{projectData?.assignToCompany?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Email</h4>
              <p>{projectData?.assignToCompany?.email ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Country</h4>
              <p>{projectData?.assignToCompany?.countryName ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Client Details</Divider>
          <Row className="projectRow">
            <Col xs={4}>
              <h4>First Name</h4>
              <p>{projectData?.client?.firstName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Last Name</h4>
              <p>{projectData?.client?.lastName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Email</h4>
              <p>{projectData?.client?.email}</p>
            </Col>
            <Col xs={4}>
              <h4>Address</h4>
              <p>{projectData?.client?.address ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Phone</h4>
              <p>{projectData?.client?.phone ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Status</h4>
              <p>
                {ClientStatus.find((status) => status.value === projectData?.client?.status)?.label}
              </p>
            </Col>
          </Row>
          <Row className="projectRow">
            <Col xs={4}>
              <h4>Country</h4>
              <p>{projectData?.client?.clientCompanyName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>State</h4>
              <p>{projectData?.client?.stateName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>City</h4>
              <p>{projectData?.client?.cityName ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
          <Divider orientation="left">Project Cost Information</Divider>
          <Row className="projectRow">
            <Col xs={4}>
              <h4>Hourly Rate</h4>
              <p>{projectData?.hourlyMonthlyRate ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Project Hours</h4>
              <p>{projectData?.projectHours ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Total Cost</h4>
              <p>{projectData?.projectCost ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Billing Type</h4>
              <p>
                {BillingType.find((item) => item.value == projectData?.billingType)?.label ?? '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Currency</h4>
              <p>{projectData?.currency ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Payment Term Days</h4>
              <p>{projectData?.paymentTermDays ?? '-'}</p>
            </Col>
          </Row>
          <Row className="projectRow">
            <Col xs={4}>
              <h4>Invoice Payment Cycle</h4>
              <p>
                {projectData?.invoicePaymentCycle
                  ? projectData?.invoicePaymentCycle
                  : InvoicePaymentCycle.find(
                      (item) => item.value == projectData?.invoicePaymentCycle
                    )?.label ?? '-'}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Invoice Day</h4>
              <p>{projectData?.invoiceDay ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewProject;
