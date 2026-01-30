import React, { useState } from 'react';
import { TextBlockPropsType, TextBlockPropsSchema } from '@/Domain/Blocks/block-text';
import { z } from 'zod';

import TextInput from './inputs/TextInput';
import ColorInput from './inputs/ColorInput';
import PaddingInput from './inputs/PaddingInput';
import TypographyInput from './inputs/TypographyInput';

type TextBlockFormProps = {
  data: TextBlockPropsType;
  setData: (v: TextBlockPropsType) => void;
};

export default function TextBlockForm({ data, setData }: TextBlockFormProps) {
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (updates: Partial<TextBlockPropsType>) => {
    const newData = { ...data, ...updates };
    const result = TextBlockPropsSchema.safeParse(newData);
    
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
        label="Content"
        defaultValue={data.content}
        onChange={(content) => updateData({ content })}
        multiline
        rows={3}
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