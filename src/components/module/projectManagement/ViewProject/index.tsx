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
import { ProjectStatus } from 'utils/constants/project-status';
import { ROUTES } from 'utils/constants/routes';
import ProjectStatusDropdown from 'utils/projectStatusDropDown';

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
            status={projectData?.status ?? 'not_started'}
            projectId={projectData?.id ?? 0}
            onStatusChange={(newStatus, projectId) => handleConfirm(newStatus, projectId)}
          />
        </div>
        <DetailWrapper>
          <Row className="projectRow">
            <Col xs={6}>
              <h4>Name</h4>
              <p>{projectData?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Description</h4>
              <p>{projectData?.description ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Amount</h4>
              <p>{projectData?.amount ? `₹ ${projectData?.amount}` : '-'}</p>
            </Col>
          </Row>
          <Row className="projectRow">
            <Col xs={6}>
              <h4>Start Date</h4>
              <p>
                {projectData?.startDate ? dayjs(projectData?.startDate).format(DATE_FORMAT) : '-'}
              </p>
            </Col>
            <Col xs={6}>
              <h4>End Date</h4>
              <p>{projectData?.endDate ? dayjs(projectData?.endDate).format(DATE_FORMAT) : '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Status</h4>
              <p>{ProjectStatus.find((item) => item.value == projectData?.status)?.label}</p>
            </Col>
          </Row>
          <Divider orientation="left">Client Details</Divider>
          <Row className="projectRow">
            <Col xs={6}>
              <h4>Name</h4>
              <p>{projectData?.client?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email</h4>
              <p>{projectData?.client?.email}</p>
            </Col>
            <Col xs={6}>
              <h4>Address</h4>
              <p>{projectData?.client?.address ?? '-'}</p>
            </Col>
          </Row>
          <Row className="projectRow">
            <Col xs={6}>
              <h4>Phone</h4>
              <p>{projectData?.client?.phone ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Country</h4>
              <p>{projectData?.client?.country?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Status</h4>
              <p>{projectData?.client?.status === 'active' ? 'Active' : 'Inactive'}</p>
            </Col>
          </Row>
          <Divider orientation="left">Company Details</Divider>
          <Row className="projectRow">
            <Col xs={6}>
              <h4>Name</h4>
              <p>{projectData?.company?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email</h4>
              <p>{projectData?.company?.email ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Address</h4>
              <p>{projectData?.company?.address ?? '-'}</p>
            </Col>
          </Row>
          <Row className="projectRow">
            <Col xs={6}>
              <h4>Country</h4>
              <p>{projectData?.company?.country?.name ?? '-'}</p>
            </Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewProject;
