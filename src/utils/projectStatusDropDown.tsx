import { DownOutlined } from '@ant-design/icons';
import { Button, Popover, Select, Tag } from 'antd';
import React, { useState } from 'react';

import { ProjectStatus } from './constants/project-status';
import { renderTagColor } from './renderColor';

const ProjectStatusDropdown: React.FC<{
  status: string;
  projectId: number;
  onStatusChange: (newStatus: string, projectId: number) => void;
}> = ({ status, projectId, onStatusChange }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(status);

  const handleConfirm = () => {
    setVisible(false);
    if (selectedStatus !== status) {
      onStatusChange(selectedStatus, projectId);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedStatus(status);
  };

  return (
    <Popover
      title="Change Project Status"
      trigger="click"
      placement="left"
      visible={visible}
      onVisibleChange={(visible) => setVisible(visible)}
      content={
        <div style={{ width: 200 }}>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: '100%', marginBottom: 10 }}
          >
            {ProjectStatus.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" size="small" onClick={handleConfirm} style={{ marginRight: 8 }}>
              OK
            </Button>
            <Button size="small" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      }
    >
      <Tag className="table-status-tag" color={renderTagColor(status)}>
        {ProjectStatus.find((item) => item.value === status)?.label} <DownOutlined />
      </Tag>
    </Popover>
  );
};

export default ProjectStatusDropdown;
