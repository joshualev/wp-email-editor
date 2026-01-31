import React, { useState } from 'react';
import { z } from 'zod';
import { EmailLayoutBlockPropsSchema, EmailLayoutBlockPropsType } from '@/domain/blocks/block-email-layout/schema';

import ColorInput from './inputs/color-input';
import { FontFamilyInput } from './inputs/TypographyInput';
import { Stack, Box } from '@mui/material';

type EmailLayoutBlockFormProps = {
  data: EmailLayoutBlockPropsType;
  setData: (v: EmailLayoutBlockPropsType) => void;
};

export default function EmailLayoutBlockForm({ data, setData }: EmailLayoutBlockFormProps) {
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (updates: Partial<EmailLayoutBlockPropsType>) => {
    const newData = { ...data, ...updates };
    const result = EmailLayoutBlockPropsSchema.safeParse(newData);
    
    if (result.success) {
      setData(result.data);
      setErrors(null);
    } else {
      setErrors(result.error);
    }
  };

  return (
    <>
      <ColorInput
        label="Backdrop color"
        defaultValue={data.backdropColor ?? '#F5F5F5'}
        onChange={(backdropColor) => updateData({ backdropColor })}
      />
      <ColorInput
        label="Canvas color"
        defaultValue={data.canvasColor ?? '#FFFFFF'}
        onChange={(canvasColor) => updateData({ canvasColor })}
      />
      <ColorInput
        label="Text color"
        defaultValue={data.textColor ?? '#262626'}
        onChange={(textColor) => updateData({ textColor })}
      />
      <Stack spacing={0.75}>
        <Box sx={{ typography: 'body2', color: 'text.secondary', pl: 0.5 }}>
          Font family
        </Box>
        <FontFamilyInput
          value={data.fontFamily ?? 'MODERN_SANS'}
          onChange={(fontFamily) => updateData({ fontFamily })}
        />
      </Stack>
    </>
  );
}