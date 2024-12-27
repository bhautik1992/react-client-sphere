import { DownOutlined } from '@ant-design/icons';
import { Button, Popover, Select, Tag } from 'antd';
import React, { useState } from 'react';

import { ClientStatus } from 'utils/constants/enum';
import { renderTagColor } from 'utils/renderColor';

const ClientStatusDropdown: React.FC<{
  status: string;
  clientId: number;
  onStatusChange: (newStatus: string, crId: number) => void;
}> = ({ status, clientId, onStatusChange }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(status);

  const handleConfirm = () => {
    setVisible(false);
    if (selectedStatus !== status) {
      onStatusChange(selectedStatus, clientId);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedStatus(status);
  };

  return (
    <Popover
      title="Change Client Status"
      trigger="click"
      placement="left"
      open={visible}
      onOpenChange={(visible) => setVisible(visible)}
      content={
        <div style={{ width: 200 }}>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: '100%', marginBottom: 10 }}
          >
            {ClientStatus.map((item) => (
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
        {ClientStatus.find((item) => item.value === status)?.label} <DownOutlined />
      </Tag>
    </Popover>
  );
};

export default ClientStatusDropdown;
