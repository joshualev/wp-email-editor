import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Stack, 
  ToggleButton,
  TextField,
  Box,
} from '@mui/material';
import { 
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { 
  TEXT_SIZE_VALUES,
  HEADING_SIZE_VALUES,
  TypographyValue,
  FontFamilyValue,
  FontWeightValue,
  FontSizeValue,
  ResponsiveTextAlignValue,
} from '@/domain/blocks/helpers/typography';
import { FONT_FAMILIES } from '@/domain/blocks/helpers/constants/fontFamily';
import ColorInput from './color-input/ColorInput';
import SelectInput from './SelectInput';
import ToggleButtonGroupInput, { StyledToggleButtonGroup } from './ToggleButtonGroupInput';
import ResponsiveAlignmentInput from './ResponsiveAlignmentInput';

interface TypographyInputProps {
  defaultValue: TypographyValue;
  onChange: (value: TypographyValue) => void;
  isHeading?: boolean;
}

const WeightToggleGroup = styled(StyledToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    minWidth: 72,
    textTransform: 'none',
  },
}));

interface FontSizeInputProps {
  value: FontSizeValue | number;
  isCustom: boolean;
  isHeading?: boolean;
  onSizeChange: (value: FontSizeValue | 'custom') => void;
  onCustomSizeChange: (value: number) => void;
}

interface FontFamilyInputProps {
  value: FontFamilyValue;
  onChange: (value: FontFamilyValue) => void;
}

interface FontWeightInputProps {
  value: FontWeightValue;
  onChange: (value: FontWeightValue) => void;
}

export function FontSizeInput({ 
  value, 
  isCustom, 
  isHeading, 
  onSizeChange, 
  onCustomSizeChange 
}: FontSizeInputProps) {
  const sizeOptions = [
    ...Object.entries(isHeading ? HEADING_SIZE_VALUES : TEXT_SIZE_VALUES).map(([key, value]) => ({
      label: `${value}px`,
      value: key
    })),
    { label: 'Custom', value: 'custom' }
  ];

  return (
    <>
      <SelectInput
        value={isCustom ? 'custom' : value}
        onChange={(value) => onSizeChange(value as FontSizeValue | 'custom')}
        options={sizeOptions}
        sx={{ width: 90 }}
      />
      {isCustom && (
        <TextField
          type="number"
          size="small"
          value={typeof value === 'number' ? value : TEXT_SIZE_VALUES.m}
          onChange={(e) => onCustomSizeChange(Number(e.target.value))}
          inputProps={{ min: 12, max: 60 }}
          sx={{ width: 90 }}
        />
      )}
    </>
  );
}

export function FontFamilyInput({ value, onChange }: FontFamilyInputProps) {
  const fontOptions = FONT_FAMILIES.map((family) => ({
    label: family.label,
    value: family.key,
    sx: { fontFamily: family.value, fontSize: '0.875rem', py: 1 }
  }));

  return (
    <SelectInput
      value={value}
      onChange={(value) => onChange(value as FontFamilyValue)}
      options={fontOptions}
      fullWidth={true}
    />
  );
}

export function FontWeightInput({ value, onChange }: FontWeightInputProps) {
  const weightOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Regular', value: 'normal' },
    { label: 'Bold', value: 'bold' },
  ];

  return (
    <WeightToggleGroup
      size="small"
      value={value}
      exclusive
      onChange={(_, newValue) => newValue && onChange(newValue as FontWeightValue)}
    >
      {weightOptions.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </WeightToggleGroup>
  );
}

export default function TypographyInput({ 
  defaultValue, 
  onChange, 
  isHeading = false 
}: TypographyInputProps) {
  const [isCustomFontSize, setIsCustomFontSize] = useState(
    typeof defaultValue.fontSize === 'number'
  );

  const handleChange = <K extends keyof TypographyValue>(
    key: K,
    value: TypographyValue[K]
  ) => {
    onChange({
      ...defaultValue,
      [key]: value
    });
  };

  const handleFontSizeChange = (value: FontSizeValue | 'custom') => {
    if (value === 'custom') {
      setIsCustomFontSize(true);
      handleChange('fontSize', TEXT_SIZE_VALUES.m);
    } else {
      setIsCustomFontSize(false);
      handleChange('fontSize', value);
    }
  };

  const handleCustomFontSizeChange = (value: number) => {
    if (value >= 12 && value <= 60) {
      handleChange('fontSize', value);
    }
  };

  return (
    <Stack spacing={1.5}>
      <ResponsiveAlignmentInput
        label="Alignment"
        value={defaultValue.textAlign}
        onChange={(value) => handleChange('textAlign', value)}
      />

      <Stack spacing={0.75} sx={{ mt: 3 }}>
        <Box sx={{ typography: 'body2', color: 'text.secondary', pl: 0.5 }}>
          Font
        </Box>
        <Stack direction="row" spacing={1}>
          <FontSizeInput
            value={defaultValue.fontSize}
            isCustom={isCustomFontSize}
            isHeading={isHeading}
            onSizeChange={handleFontSizeChange}
            onCustomSizeChange={handleCustomFontSizeChange}
          />
          <FontFamilyInput
            value={defaultValue.fontFamily}
            onChange={(value) => handleChange('fontFamily', value)}
          />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <ColorInput
          defaultValue={defaultValue.color}
          onChange={(value) => handleChange('color', value)}
        />
        <FontWeightInput
          value={defaultValue.fontWeight}
          onChange={(value) => handleChange('fontWeight', value)}
        />
      </Stack>
    </Stack>
  );
}