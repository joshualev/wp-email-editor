import React, { useState } from 'react';
import { DividerBlockPropsType, DividerBlockPropsSchema } from '@/domain/blocks/block-divider';
import { z } from 'zod';
import { Minus, StretchVertical, StretchHorizontal } from 'lucide-react'
import ColorInput from './inputs/color-input/ColorInput';
import SliderInput from './inputs/SliderInput';
import PaddingInput from './inputs/PaddingInput';
import RadioGroupInput from './inputs/RadioGroupInput';

type DividerBlockFormProps = {
  data: DividerBlockPropsType;
  setData: (v: DividerBlockPropsType) => void;
};

export default function DividerBlockForm({ data, setData }: DividerBlockFormProps) {
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (updates: Partial<DividerBlockPropsType>) => {
    const newData = { ...data, ...updates };
    const result = DividerBlockPropsSchema.safeParse(newData);

    if (result.success) {
      setData(result.data);
      setErrors(null);
    } else {
      setErrors(result.error);
    }
  };

  return (
    <>
      <RadioGroupInput
        label="Style"
        value={data.divider.style}
        onChange={(style) => updateData({
          divider: { ...data.divider, style: style as 'solid' | 'dashed' | 'dotted' }
        })}
        options={[
          { value: 'solid', label: 'Solid', icon: <Minus /> },
          { value: 'dashed', label: 'Dashed', icon: <Minus /> },
          { value: 'dotted', label: 'Dotted', icon: <Minus /> }
        ]}
      />

      <SliderInput
        label="Thickness"
        defaultValue={data.divider.thickness}
        onChange={(thickness) => updateData({
          divider: { ...data.divider, thickness }
        })}
        step={1}
        min={1}
        max={10}
        units="px"
        iconLabel={<StretchVertical size={16} />}
      />

      <SliderInput
        label="Width"
        defaultValue={data.divider.width === 'full' ? 100 : data.divider.width}
        onChange={(width) => updateData({
          divider: { ...data.divider, width: width === 100 ? 'full' : width }
        })}
        step={1}
        min={1}
        max={100}
        units="%"
        iconLabel={<StretchHorizontal size={16} />}
      />

      <ColorInput
        label="Divider Color"
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