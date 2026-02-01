import React, { useState } from 'react';
import { ButtonBlockPropsType, ButtonBlockPropsSchema } from '@/domain/blocks/block-button';
import { z } from 'zod';

import TextInput from './inputs/TextInput';
import ColorInput from './inputs/color-input/ColorInput';
import PaddingInput from './inputs/PaddingInput';
import TypographyInput from './inputs/TypographyInput';
import SelectInput from './inputs/SelectInput';
import BooleanInput from './inputs/BooleanInput';

type ButtonBlockFormProps = {
  data: ButtonBlockPropsType;
  setData: (v: ButtonBlockPropsType) => void;
};

export default function ButtonBlockForm({ data, setData }: ButtonBlockFormProps) {
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (updates: Partial<ButtonBlockPropsType>) => {
    const newData = { ...data, ...updates };
    const result = ButtonBlockPropsSchema.safeParse(newData);
    
    if (result.success) {
      setData(result.data);
      setErrors(null);
    } else {
      setErrors(result.error);
    }
  };

  return (
    <>
      <TextInput
        label="Button Text"
        defaultValue={data.content}
        onChange={(content) => updateData({ content })}
        multiline
        rows={3}
        placeholder="Enter button text..."
      />

      <TextInput
        label="Button URL"
        defaultValue={data.button.url}
        onChange={(url) => updateData({
          button: { ...data.button, url },
        })}
        placeholder="https://example.com"
      />
      <SelectInput
        label="Button Style"
        options={[
          { value: 'rectangle', label: 'Rectangle' },
          { value: 'rounded', label: 'Rounded' },
          { value: 'pill', label: 'Pill' },
        ]}
        value={data.button.variant}
        onChange={(variant) => updateData({
          button: { ...data.button, variant: variant as "rectangle" | "pill" | "rounded" },
        })}
      />

      <BooleanInput
        label="Full Width"
        defaultValue={data.button.fullWidth}
        onChange={(fullWidth) => updateData({
          button: { ...data.button, fullWidth },
        })}
      />

      <TypographyInput
        defaultValue={data.typography}
        onChange={(typography) => updateData({ typography })}
      />

      <ColorInput
        label="Background Color"
        defaultValue={data.layout.background.color}
        onChange={(color) => updateData({
          layout: {
            ...data.layout,
            background: { ...data.layout.background, color },
          },
        })}
      />

      <PaddingInput
        label="Padding"
        defaultValue={data.layout.padding}
        onChange={(padding) => updateData({
          layout: { ...data.layout, padding },
        })}
      />
    </>
  );
}