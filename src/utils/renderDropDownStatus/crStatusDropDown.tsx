import { DownOutlined } from '@ant-design/icons';
import { Button, Popover, Select, Tag } from 'antd';
import React, { useState } from 'react';

import { CrStatus } from 'utils/constants/enum';
import { renderTagColor } from 'utils/renderColor';

const CrStatusDropdown: React.FC<{
  status: string;
  crId: number;
  onStatusChange: (newStatus: string, crId: number) => void;
}> = ({ status, crId, onStatusChange }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(status);

  const handleConfirm = () => {
    setVisible(false);
    if (selectedStatus !== status) {
      onStatusChange(selectedStatus, crId);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedStatus(status);
  };

  return (
    <Popover
      title="Change Cr Status"
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
            {CrStatus.map((item) => (
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
        {CrStatus.find((item) => item.value === status)?.label} <DownOutlined />
      </Tag>
    </Popover>
  );
};

export default CrStatusDropdown;
