import React, { CSSProperties } from 'react';

import { TextBlockPropsType } from '@/Domain/Blocks/block-text';
import { TEXT_SIZE_VALUES, getResponsiveTextAlign } from '@/Domain/Blocks/helpers/typography';
import { getPadding, getFontFamily } from '@/Domain/Blocks/helpers/utils';

function getTextSize(size: TextBlockPropsType['typography']['fontSize']): number {
  if (typeof size === 'number') return size;
  return TEXT_SIZE_VALUES[size];
}

interface TextBlockRenderProps extends TextBlockPropsType {
  isMobile?: boolean;
}

export function TextBlock({ content, typography, layout, isMobile = false }: TextBlockRenderProps) {
  const outerPadding = getPadding(layout.padding);
  const textAlign = getResponsiveTextAlign(typography.textAlign, isMobile);

  const textStyle: CSSProperties = {
    color: typography.color,
    fontSize: getTextSize(typography.fontSize),
    fontFamily: getFontFamily(typography.fontFamily),
    fontWeight: typography.fontWeight,
    textAlign,
    margin: 0,
  };

  const containerStyle: CSSProperties = {
    padding: outerPadding,
    backgroundColor: layout.background.color,
  };

  return (
    <div style={containerStyle}>
      <p style={textStyle}>{content}</p>
    </div>
  );
}
