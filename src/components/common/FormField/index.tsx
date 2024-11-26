import { ArrowDownOutlined } from '@ant-design/icons';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Checkbox, Col, DatePicker, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import PhoneInput from 'react-phone-number-input/input';

import {
  IRenderCheckBox,
  IRenderCheckboxProps,
  IRenderInputProps,
  IRenderSelectProps
} from './types';

export const RenderTextInput = (props: IRenderInputProps) => {
  const {
    // COLUMN
    col,
    colClassName,
    colOffSet,
    offSetPull,
    // FORM_ITEM
    name,
    label,
    rules,
    help,
    // FORM_INPUT
    type,
    placeholder,
    value,
    disabled,
    min,
    max,
    minLength,
    maxLength,
    onChange,
    className,
    addonAfter,
    addonBefore,
    suffix,
    prefix,
    allowClear,
    required,
    size,
    tooltip
  } = props;
  return (
    <Col
      xs={col?.xs}
      sm={col?.sm}
      md={col?.md ? col?.md : col}
      lg={col?.lg}
      xl={col?.xl}
      xxl={col?.xxl}
      className={colClassName ?? ''}
      offset={colOffSet}
      pull={offSetPull}
    >
      <Form.Item
        name={name ?? ''}
        labelCol={{ span: 6 }}
        // wrapperCol={{ span: 24 }}
        label={label}
        rules={rules}
        help={help ?? null}
        required={required}
        tooltip={tooltip}
      >
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          onChange={onChange}
          className={className}
          addonAfter={addonAfter ?? null}
          addonBefore={addonBefore ?? null}
          suffix={suffix}
          prefix={prefix}
          allowClear={allowClear}
          size={size ?? 'middle'}
        />
      </Form.Item>
    </Col>
  );
};

export const RenderPasswordInput = ({
  col,
  colClassName,
  colOffSet,
  name,
  label,
  rules,
  placeholder,
  prefix,
  offSetPull,
  required
}: IRenderInputProps) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  return (
    <Col
      xs={col?.xs}
      sm={col?.sm}
      md={col?.md ? col?.md : col}
      lg={col?.lg}
      xl={col?.xl}
      xxl={col?.xxl}
      className={colClassName ?? ''}
      offset={colOffSet}
      pull={offSetPull}
    >
      <Form.Item
        name={name ?? ''}
        labelCol={{ span: 6 }}
        // wrapperCol={{ span: 24 }}
        label={label}
        rules={rules || null}
        required={required}
      >
        <Input.Password
          placeholder={placeholder}
          size="large"
          prefix={prefix ?? null}
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible
          }}
        />
      </Form.Item>
    </Col>
  );
};

export const RenderCheckBox = ({
  col,
  colClassName,
  colOffSet,
  name,
  label,
  rules,
  required,
  onChange,
  checked,
  className,
  children,
  value,
  initialValue,
  defaultChecked
}: IRenderCheckBox) => {
  return (
    <Col
      xs={col?.xs}
      sm={col?.sm}
      md={col?.md ? col?.md : col}
      lg={col?.lg}
      xl={col?.xl}
      xxl={col?.xxl}
      className={colClassName ?? ''}
      offset={colOffSet}
    >
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name={name}
        label={label}
        rules={rules}
        required={required}
        initialValue={initialValue}
      >
        <Checkbox
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          className={className}
        >
          {children}
        </Checkbox>
      </Form.Item>
    </Col>
  );
};

export const RenderCheckboxGroup = ({
  col,
  colClassName,
  colOffSet,
  name,
  label,
  rules,
  required,
  checkboxName,
  onChange,
  value,
  className,
  optionLabel,
  disabled,
  defaultValues
}: IRenderCheckboxProps) => {
  return (
    <Col
      xs={col?.xs}
      sm={col?.sm}
      md={col?.md ? col?.md : col}
      lg={col?.lg}
      xl={col?.xl}
      xxl={col?.xxl}
      className={colClassName ?? ''}
      offset={colOffSet}
    >
      <Form.Item
        name={name}
        label={label}
        rules={rules}
        required={required}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Checkbox.Group
          defaultValue={defaultValues}
          name={checkboxName}
          onChange={onChange}
          value={value}
          className={className}
          disabled={disabled}
        >
          {optionLabel?.map((item: any) => (
            <Checkbox value={item.value} key={item._id}>
              {item.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
    </Col>
  );
};

export const RenderSelectInput = ({
  col,
  colClassName,
  colOffSet,
  name,
  label,
  rules,
  required,
  onChange,
  value,
  className = '',
  optionLabel,
  disabled,
  onSelect,
  showSearch,
  mode,
  placeholder,
  allowClear,
  prefixIcon = '',
  suffixIcon
}: IRenderSelectProps) => {
  return (
    <Col
      xs={col?.xs}
      sm={col?.sm}
      md={col?.md ? col?.md : col}
      lg={col?.lg}
      xl={col?.xl}
      xxl={col?.xxl}
      className={colClassName ?? ''}
      offset={colOffSet}
    >
      <div className={`customSelect ${prefixIcon && 'selectWithIcon'} ${className ?? className}`}>
        <Form.Item
          name={name}
          label={label}
          rules={rules}
          required={required}
          labelCol={{ span: 6 }}
          // wrapperCol={{ span: 24 }}
        >
          <Select
            value={value ?? null}
            onSelect={onSelect}
            showSearch={showSearch}
            mode={mode}
            placeholder={placeholder}
            disabled={disabled}
            allowClear={allowClear}
            onChange={onChange}
            optionFilterProp="children"
            suffixIcon={
              <div className="selectIcons">
                {prefixIcon ? (
                  <>
                    <span className="prefixIcon">{prefixIcon}</span>
                    <span className="selectArrowIcon">{suffixIcon || <ArrowDownOutlined />}</span>
                  </>
                ) : (
                  <span className="selectArrowIcon">{suffixIcon || <ArrowDownOutlined />}</span>
                )}
              </div>
            }
          >
            {optionLabel?.map((item: any) => (
              <Select.Option key={item.value} value={item.value} label={item.label}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Col>
  );
};

export const RenderTextArea = (props: any) => {
  return (
    <Col {...props.col}>
      <Form.Item
        name={props.name}
        labelCol={{ span: 6 }}
        // wrapperCol={{ span: 24 }}
        label={props.label}
        rules={props.rules}
        tooltip={props.tooltip}
      >
        <TextArea
          showCount={props.showCount}
          disabled={props.disabled}
          className={props.className}
          cols={props.cols}
          rows={props.rows}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          allowClear={props.allowClear}
        />
      </Form.Item>
    </Col>
  );
};

export const RenderRangePicker = (props: any) => {
  const { RangePicker } = DatePicker;
  return (
    <Col
      xs={props?.col?.xs}
      sm={props?.col?.sm}
      md={props?.col?.md ? props?.col?.md : props?.col}
      lg={props?.col?.lg}
      xl={props?.col?.xl}
      xxl={props?.col?.xxl}
      className={props?.colClassName ?? ''}
      offset={props?.colOffSet}
    >
      <Form.Item
        name={props.name}
        labelCol={{ span: 6 }}
        // wrapperCol={{ span: 24 }}
        label={props.label}
        rules={props.rules}
        tooltip={props.tooltip}
      >
        <RangePicker
          width={'100%'}
          disabled={props.disabled}
          className={props.className}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          allowClear={props.allowClear}
          onChange={props.onChange}
        />
      </Form.Item>
    </Col>
  );
};

export const RenderDatePicker = (props: any) => {
  return (
    <Col
      xs={props?.col?.xs}
      sm={props?.col?.sm}
      md={props?.col?.md ? props?.col?.md : props?.col}
      lg={props?.col?.lg}
      xl={props?.col?.xl}
      xxl={props?.col?.xxl}
      className={props?.colClassName ?? ''}
      offset={props?.colOffSet}
    >
      <Form.Item
        name={props.name}
        labelCol={{ span: 6 }}
        // wrapperCol={{ span: 24 }}
        label={props.label}
        rules={props.rules}
        tooltip={props.tooltip}
      >
        <DatePicker
          width={'100%'}
          size={props.size ?? 'middle'}
          disabled={props.disabled}
          className={props.className}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          allowClear={props.allowClear}
          picker={props.picker}
          format={props.format}
          defaultValue={props.defaultValue}
          onChange={props.onChange}
          value={props.value}
          disabledDate={props.disabledDate}
        />
      </Form.Item>
    </Col>
  );
};

export const RenderPhoneNumber = (props: any) => {
  return (
    <Col
      xs={props?.col?.xs}
      sm={props?.col?.sm}
      md={props?.col?.md ? props?.col?.md : props?.col}
      lg={props?.col?.lg}
      xl={props?.col?.xl}
      xxl={props?.col?.xxl}
      className={props?.colClassName ?? ''}
      offset={props?.colOffSet}
    >
      <Form.Item
        name={props.name}
        labelCol={{ span: 6 }}
        // wrapperCol={{ span: 24 }}
        label={props.label}
        rules={props.rules}
        tooltip={props.tooltip}
      >
        <PhoneInput
          className="phoneInput"
          placeholder={props.placeholder}
          onChange={props.onChange}
          value={props.value}
          international
          withCountryCallingCode
        />
      </Form.Item>
    </Col>
  );
};

export const RenderCKEditor = (props: any) => {
  return (
    <Col
      xs={props?.col?.xs}
      sm={props?.col?.sm}
      md={props?.col?.md ? props?.col?.md : props?.col}
      lg={props?.col?.lg}
      xl={props?.col?.xl}
      xxl={props?.col?.xxl}
      className={props?.colClassName ?? ''}
      offset={props?.colOffSet}
    >
      <Form.Item
        name={props.name}
        labelCol={{ span: 6 }}
        // wrapperCol={{ span: 24 }}
        label={props.label}
        rules={props.rules}
        tooltip={props.tooltip}
      >
        <CKEditor editor={ClassicEditor} data={props.data} onChange={props.onChange} />
      </Form.Item>
    </Col>
  );
};
