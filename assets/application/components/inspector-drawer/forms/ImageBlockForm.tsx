import React, { useState } from 'react';
import { ImageBlockPropsType, ImageBlockPropsSchema } from '@/domain/blocks/block-image';
import { z } from 'zod';
import { Divider } from '@mui/material';
import {
  Image,
  LayoutTemplate,
} from 'lucide-react';

import {
  ImageAspectRatioType,
  ImageBorderRadiusType,
} from '@/domain/blocks/block-image/schema';
import { ResponsiveHorizontalAlignValue } from '@/domain/blocks/helpers/layout';

import RadioGroupInput from './inputs/RadioGroupInput';
import TextInput from './inputs/TextInput';
import ColorInput from './inputs/color-input';
import PaddingInput from './inputs/PaddingInput';
import TextDimensionInput from './inputs/TextDimensionInput';
import ResponsiveAlignmentInput from './inputs/ResponsiveAlignmentInput';

type ImageBlockFormProps = {
  data: ImageBlockPropsType;
  setData: (v: ImageBlockPropsType) => void;
};

export default function ImageBlockForm({ data, setData }: ImageBlockFormProps) {
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (updates: Partial<ImageBlockPropsType>) => {
    const newData = { ...data, ...updates };
    const result = ImageBlockPropsSchema.safeParse(newData);

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
        label="Image URL"
        defaultValue={data.image.url}
        onChange={(url) =>
          updateData({
            image: { ...data.image, url },
          })
        }
      />

      <TextInput
        label="Alt Text"
        defaultValue={data.image.alt}
        onChange={(alt) =>
          updateData({
            image: { ...data.image, alt },
          })
        }
      />

      <TextInput
        label="Link URL"
        defaultValue={data.image.linkUrl || ''}
        onChange={(linkUrl) =>
          updateData({
            image: { ...data.image, linkUrl },
          })
        }
      />

      <Divider />

      <TextDimensionInput
        label="Width"
        defaultValue={data.image.width}
        onChange={(width) =>
          updateData({
            image: { ...data.image, width: width ?? data.image.width },
          })
        }
      />

      <RadioGroupInput
        label="Aspect Ratio"
        value={String(data.image.aspectRatio)}
        onChange={(aspectRatio) => {
          const numericValue = parseFloat(aspectRatio);
          const newValue = isNaN(numericValue) ? aspectRatio : numericValue;
          if (
            typeof newValue === 'number' ||
            ['square', 'landscape', 'portrait', 'wide'].includes(newValue as string)
          ) {
            updateData({
              image: { ...data.image, aspectRatio: newValue as ImageAspectRatioType },
            });
          }
        }}
        options={[
          { value: 'square', label: 'Square', icon: <Image size={16} /> },
          { value: 'landscape', label: 'Landscape', icon: <LayoutTemplate size={16} /> },
          { value: 'portrait', label: 'Portrait', icon: <LayoutTemplate size={16} /> },
          { value: 'wide', label: 'Wide', icon: <LayoutTemplate size={16} /> },
        ]}
      />

      <Divider />

      <ResponsiveAlignmentInput
        label="Horizontal Alignment"
        value={data.image.alignment.horizontal}
        onChange={(horizontal: ResponsiveHorizontalAlignValue) =>
          updateData({
            image: {
              ...data.image,
              alignment: {
                ...data.image.alignment,
                horizontal,
              },
            },
          })
        }
      />

      <Divider />

      <RadioGroupInput
        label="Border Radius"
        value={data.image.borderRadius}
        onChange={(borderRadius) => {
          if (['none', 'small', 'medium', 'large', 'full'].includes(borderRadius)) {
            updateData({
              image: {
                ...data.image,
                borderRadius: borderRadius as ImageBorderRadiusType,
              },
            });
          }
        }}
        options={[
          { value: 'none', label: 'None' },
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
          { value: 'full', label: 'Full' },
        ]}
      />

      <ColorInput
        label="Background Color"
        defaultValue={data.layout.background.color}
        onChange={(color) =>
          updateData({
            layout: {
              ...data.layout,
              background: { ...data.layout.background, color },
            },
          })
        }
      />

      <PaddingInput
        label="Padding"
        defaultValue={data.layout.padding}
        onChange={(padding) =>
          updateData({
            layout: { ...data.layout, padding },
          })
        }
      />
    </>
  );
}
