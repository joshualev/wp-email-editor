import React, { useState } from 'react';

import { AddOutlined, CloseOutlined } from '@mui/icons-material';
import { ButtonBase, InputLabel, Menu, Stack } from '@mui/material';

import { styled } from '@mui/material/styles';
import Picker from './Picker';

const ColorButton = styled(ButtonBase)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: `1px solid ${theme.palette.divider}`,
  padding: 0,
  position: 'relative',
  overflow: 'hidden',
  transition: 'border-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.action.active,
  },
}));

type Props = {
  label?: string;
  onChange: (value: string | null) => void;
  defaultValue: string | null;
  nullable: boolean;
};

export default function BaseColorInput({ label, defaultValue, onChange, nullable }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState<string | null>(defaultValue);

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const renderResetButton = () => {
    if (!nullable) {
      return null;
    }
    if (typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }
    return (
      <ButtonBase
        onClick={() => {
          setValue(null);
          onChange(null);
        }}
      >
        <CloseOutlined fontSize="small" sx={{ color: 'grey.600' }} />
      </ButtonBase>
    );
  };

  const renderOpenButton = () => {
    if (value) {
      return <ColorButton onClick={handleClickOpen} sx={{ bgcolor: value }} />;
    }
    return (
      <ColorButton onClick={handleClickOpen}>
        <AddOutlined fontSize="small" />
      </ColorButton>
    );
  };

  const pickerValue = value ?? '#FFFFFF';

  return (
    <Stack alignItems="flex-start">
      {label && <InputLabel sx={{ mb: 0.5 }}>{label}</InputLabel>}
      <Stack direction="row" spacing={1}>
        {renderOpenButton()}
        {renderResetButton()}
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          sx: { height: 'auto', padding: 0 },
        }}
      >
        <Picker
          value={pickerValue}
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        />
      </Menu>
    </Stack>
  );
}
