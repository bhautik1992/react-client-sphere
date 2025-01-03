import { UploadOutlined } from '@ant-design/icons';
import { UseMutateFunction } from '@tanstack/react-query';
import { Button, Upload, UploadFile, UploadProps, message } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import React, { useState } from 'react';

import { IUploadImageRes } from 'services/api/employee/types';
import { UploadFileEnum } from 'services/api/types';

import { IApiError } from 'utils/Types';

interface IProps {
  maxCount?: number;
  setImagePath?: React.Dispatch<React.SetStateAction<string | null>>;
  profileUrl?: string;
  mutate: UseMutateFunction<IUploadImageRes, IApiError, FormData, unknown>;
}

const ImageUpload: React.FC<IProps> = ({ maxCount = 1, setImagePath, profileUrl, mutate }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    setFileList(info?.fileList);

    const formData = new FormData();
    const fileObject: any = info?.file;
    formData.append('file', fileObject);
    formData.append('moduleName', UploadFileEnum.Employee);

    mutate(formData, {
      onSuccess: (res: IUploadImageRes) => {
        setImagePath?.(res?.filename ?? '');
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  const validateImage = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file?.type)) {
      throw new Error('Only JPEG, PNG, and GIF images are allowed');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file?.size > maxSize) {
      throw new Error('File size should be less than 10MB');
    }

    if (fileList?.length >= 1) {
      return false;
    }

    return false;
  };

  return (
    <div>
      <Upload
        listType="picture"
        fileList={
          fileList?.length > 0
            ? fileList
            : profileUrl
            ? ([
                {
                  uid: 0,
                  name: profileUrl?.split('/').pop()?.split('?')?.[0] ?? '',
                  status: 'done',
                  url: profileUrl ?? '',
                  thumbUrl: profileUrl ?? ''
                }
              ] as unknown as UploadFile[])
            : []
        }
        onChange={handleChange}
        maxCount={maxCount}
        beforeUpload={validateImage}
        accept=".jpg,.jpeg,.png"
        showUploadList={{ showRemoveIcon: false }}
        progress={{ strokeLinecap: 'round' }}
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </div>
  );
};

export default ImageUpload;
