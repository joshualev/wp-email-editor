import React, { useState } from 'react';
import { HeadingBlockPropsType, HeadingBlockPropsSchema } from '@/Domain/Blocks/block-heading';
import { z } from 'zod';

import TextInput from './inputs/TextInput';
import ColorInput from './inputs/ColorInput';
import PaddingInput from './inputs/PaddingInput';
import TypographyInput from './inputs/TypographyInput';

type HeadingBlockFormProps = {
  data: HeadingBlockPropsType;
  setData: (v: HeadingBlockPropsType) => void;
};

export default function HeadingBlockForm({ data, setData }: HeadingBlockFormProps) {
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (updates: Partial<HeadingBlockPropsType>) => {
    const newData = { ...data, ...updates };
    const result = HeadingBlockPropsSchema.safeParse(newData);
    
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
      />
      
      <TypographyInput
        defaultValue={data.typography}
        onChange={(typography) => updateData({ typography })}
        isHeading
      />

      <ColorInput
        label="Background Color"
        defaultValue={data.layout.background.color}
        onChange={(color) => updateData({ 
          layout: { 
            ...data.layout, 
            background: { ...data.layout.background, color } 
          } 
        })}
      />

      <PaddingInput
        label="Padding"
        defaultValue={data.layout.padding}
        onChange={(padding) => updateData({ 
          layout: { ...data.layout, padding } 
        })}
      />
    </>
  );
}