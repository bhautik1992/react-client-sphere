import { Select } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { Technologies } from 'utils/constants/enum';

const TechnologiesDropdown: React.FC<{
  col?: { xs: number; sm?: number; md?: number; lg?: number };
  name?: string;
  placeholder?: string;
  label?: string;
  allowClear?: boolean;
  selectedTech: string[];
  onTechnologyChange: (selectedTechnologies: string[]) => void;
}> = ({
  placeholder = 'Select technologies',
  label = 'Technologies:',
  allowClear = true,
  selectedTech,
  onTechnologyChange
}) => {
  const [options, setOptions] = useState(Technologies);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const setTechOptions = useCallback((value: string) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      if (!updatedOptions.some((option) => option.value === value)) {
        updatedOptions.push({ value, label: value });
      }
      return updatedOptions;
    });
  }, []);

  const handleAddTechnology = (value: string) => {
    setTechOptions(value);
    setSelectedTechnologies((prevSelected) => {
      const updatedSelected = [...prevSelected];
      if (!updatedSelected.includes(value)) {
        updatedSelected.push(value);
      }
      return updatedSelected;
    });
    onTechnologyChange(selectedTechnologies);
  };

  useEffect(() => {
    if (!selectedTech) return;
    setSelectedTechnologies(selectedTech);
    selectedTech?.map((tech) => {
      setTechOptions(tech);
    });
  }, [selectedTech, setTechOptions]);

  useEffect(() => {
    onTechnologyChange(selectedTechnologies);
  }, [selectedTechnologies, onTechnologyChange]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement | HTMLInputElement | HTMLTextAreaElement>,
    inputValue: string
  ) => {
    if (event.key === 'Enter' && inputValue) {
      handleAddTechnology(inputValue);
    }
  };

  const handleChange = (selectedValues: string[]) => {
    setSelectedTechnologies(selectedValues);
    onTechnologyChange(selectedValues);
  };

  return (
    <div style={{ display: 'flex' }}>
      <label
        style={{
          display: 'block',
          marginRight: '8px',
          marginLeft: '35px',
          fontSize: '14px',
          color: '#343a40'
        }}
      >
        {label}
      </label>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder={placeholder}
        allowClear={allowClear}
        value={selectedTechnologies}
        onInputKeyDown={(event) => handleKeyDown(event, (event.target as HTMLInputElement).value)}
        onChange={handleChange}
        filterOption={(input, option) =>
          typeof option?.label === 'string' &&
          option.label.toLowerCase().includes(input.toLowerCase())
        }
      >
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

TechnologiesDropdown.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  allowClear: PropTypes.bool,
  onTechnologyChange: PropTypes.func.isRequired
};

export default TechnologiesDropdown;
