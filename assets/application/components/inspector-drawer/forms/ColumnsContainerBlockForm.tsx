import React, { useState } from 'react';
import { ColumnsContainerBlockPropsType, ColumnsContainerBlockPropsSchema } from '@/domain/blocks/block-columns-container';
import { z } from 'zod';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Box,
  FormControlLabel,
  Switch,
  styled
} from '@mui/material';
import { AlignVerticalTop, AlignVerticalCenter, AlignVerticalBottom } from '@mui/icons-material';

import { NullableColorInput } from './inputs/color-input/ColorInput';
import { ColumnControl } from './inputs/ColumnControl';
import PaddingInput from './inputs/PaddingInput';

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: theme.palette.primary.main,
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 0.7,
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#bdbdbd',
    opacity: 1,
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
}));

type ColumnsContainerBlockFormProps = {
  data: ColumnsContainerBlockPropsType;
  setData: (v: ColumnsContainerBlockPropsType) => void;
};

export default function ColumnsContainerBlockForm({ data, setData }: ColumnsContainerBlockFormProps) {
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (updates: Partial<ColumnsContainerBlockPropsType>) => {
    const newData = { ...data, ...updates };

    if (updates.widths) {
      const currentColumns = data.childrenIds.length;
      const newColumns = updates.widths.length;

      if (newColumns < currentColumns) {
        const remainingColumns = [...data.childrenIds.slice(0, newColumns)];
        const removedColumns = data.childrenIds.slice(newColumns, currentColumns);
        
        const itemsToMove = removedColumns.flat();
        
        if (itemsToMove.length > 0) {
          remainingColumns[newColumns - 1] = [
            ...remainingColumns[newColumns - 1],
            ...itemsToMove
          ];
        }

        newData.childrenIds = [
          ...remainingColumns,
          ...Array(4 - newColumns).fill([])
        ];
      } else if (newColumns > currentColumns) {
        newData.childrenIds = [
          ...data.childrenIds.slice(0, currentColumns),
          ...Array(newColumns - currentColumns).fill([]),
          ...Array(4 - newColumns).fill([])
        ];
      }
    }

    const result = ColumnsContainerBlockPropsSchema.safeParse(newData);
    
    if (result.success) {
      setData(result.data);
      setErrors(null);
    } else {
      setErrors(result.error);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <StyledSwitch
              checked={data.fullWidth ?? false}
              onChange={(e) => updateData({ fullWidth: e.target.checked })}
            />
          }
          label={
            <Typography variant="body2">
              Full Width Background
            </Typography>
          }
        />
      </Box>

      <ColumnControl
        value={{
          count: data.widths.length,
          widths: data.widths,
        }}
        onChange={(value) => updateData({
            ...data,
            widths: value.widths.slice(0, value.count),
        })}
      />

      {data.widths.length > 1 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Content Alignment
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={data.contentAlignment}
              onChange={(e) => updateData({ contentAlignment: e.target.value as 'top' | 'middle' | 'baseline' })}
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value="top">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlignVerticalTop fontSize="small" />
                  Top
                </Box>
              </MenuItem>
              <MenuItem value="middle">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlignVerticalCenter fontSize="small" />
                  Middle
                </Box>
              </MenuItem>
              <MenuItem value="baseline">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlignVerticalBottom fontSize="small" />
                  Bottom
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      <NullableColorInput
        label="Background Color (optional)"
        defaultValue={data.layout.background.color === 'transparent' ? null : data.layout.background.color}
        onChange={(color) => updateData({
          layout: {
            ...data.layout,
            background: { ...data.layout.background, color: color ?? 'transparent' },
          },
        })}
      />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Clear to use the canvas background.
      </Typography>

    <PaddingInput
        label="Vertical Padding"
        defaultValue={{
          top: data.layout.padding.top,
          bottom: data.layout.padding.bottom,
          left: 0,
          right: 0,
        }}
        onChange={(padding) => updateData({
          layout: {
            ...data.layout,
            padding: {
              ...data.layout.padding,
              top: padding.top,
              bottom: padding.bottom,
            },
          },
        })}
        inputType="vertical"
      />
    </>
  );
}
