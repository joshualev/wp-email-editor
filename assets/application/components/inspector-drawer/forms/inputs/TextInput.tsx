import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom wrapper to maintain spacing
const InputWrapper = styled('div')({
  width: '100%',
  marginTop: '10px',
});

// Custom styling for the TextField
const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    minHeight: '30px',
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  '& .MuiInputBase-input': {
    padding: '4px 8px',
    '&, &[type="text"], &[type="number"], &[type="email"], &[type="tel"], &[type="url"], &[type="password"], &[type="search"], &[type="date"], &[type="datetime-local"], &[type="month"], &[type="time"], &[type="week"]': {
      boxShadow: 'none',
      borderRadius: 0,
      border: 'none',
      backgroundColor: 'transparent',
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    backgroundColor: '#fff',
    padding: '0 4px',
    zIndex: 1,
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    paddingTop: '0',
    borderColor: '#e0e0e0',
    legend: {
      maxWidth: '100%',
    }
  },
  '& .MuiInputBase-multiline': {
    padding: 0,
    paddingTop: '6px',
    '& .MuiInputBase-input': {
      padding: '4px 8px',
    }
  },
});

interface TextInputProps {
  label: string;
  defaultValue: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

export default function TextInput({ 
  label, 
  defaultValue, 
  onChange,
  multiline = false,
  rows = 1,
  placeholder
}: TextInputProps) {
  return (
    <InputWrapper>
      <StyledTextField
        fullWidth
        size="small"
        label={label}
        value={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        multiline={multiline}
        rows={rows}
        placeholder={placeholder}
        variant="outlined"
      />
    </InputWrapper>
  );
}