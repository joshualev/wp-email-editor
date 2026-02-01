// src/components/helpers/inputs/RadioGroupInput.tsx

import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

// Define the structure of each option
export type RadioOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

// Define the props for RadioGroupInput
export type RadioGroupInputProps = {
  label: string | JSX.Element;
  options?: RadioOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function RadioGroupInput({
  label,
  options = [],
  value,
  onChange,
}: RadioGroupInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        row
        aria-label={typeof label === 'string' ? label : 'radio-group'}
        name={typeof label === 'string' ? label : 'radio-group'}
        value={value}
        onChange={handleChange}
      >
        {options?.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={
              option.icon ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {option.icon}
                  {option.label}
                </span>
              ) : (
                option.label
              )
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
