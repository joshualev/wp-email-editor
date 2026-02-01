import { 
  Stack, 
} from '@mui/material';
import { 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
} from 'lucide-react';

import ToggleButtonGroupInput from './ToggleButtonGroupInput';

interface AlignmentValue {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
}

interface AlignmentInputProps {
  value: AlignmentValue;
  onChange: (value: AlignmentValue) => void;
}


export default function AlignmentInput({ value, onChange }: AlignmentInputProps) {
  const horizontalOptions = [
    { label: <AlignLeft size={18} />, value: 'left' },
    { label: <AlignCenter size={18} />, value: 'center' },
    { label: <AlignRight size={18} />, value: 'right' },
  ];

  const verticalOptions = [
    { label: <AlignVerticalJustifyStart size={18} />, value: 'top' },
    { label: <AlignVerticalJustifyCenter size={18} />, value: 'center' },
    { label: <AlignVerticalJustifyEnd size={18} />, value: 'bottom' },
  ];

  return (
    <Stack spacing={1}>
      <ToggleButtonGroupInput
        label="Horizontal Alignment"
        value={value.horizontal}
        onChange={(newValue) => onChange({ ...value, horizontal: newValue })}
        options={horizontalOptions}
        showLabel
        sx={{ height: 36, width: '100%' }}
      />
      <ToggleButtonGroupInput
        label="Vertical Alignment"
        value={value.vertical}
        onChange={(newValue) => onChange({ ...value, vertical: newValue })}
        options={verticalOptions}
        showLabel
        sx={{ height: 36, width: '100%' }}
      />
    </Stack>
  );
}
