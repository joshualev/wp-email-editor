import React, { CSSProperties } from 'react';

import { HeadingBlockPropsType } from '@/domain/blocks/block-heading';
import { HEADING_SIZE_VALUES, getResponsiveTextAlign } from '@/domain/blocks/helpers/typography';
import { getPadding, getFontFamily } from '@/domain/blocks/helpers/utils';

function getHeadingSize(size: HeadingBlockPropsType['typography']['fontSize']): number {
  if (typeof size === 'number') return size;
  return HEADING_SIZE_VALUES[size];
}

interface HeadingBlockRenderProps extends HeadingBlockPropsType {
  isMobile?: boolean;
}

export function HeadingBlock({ content, headingType, typography, layout, isMobile = false }: HeadingBlockRenderProps) {
  const outerPadding = getPadding(layout.padding);
  const textAlign = getResponsiveTextAlign(typography.textAlign, isMobile);

  const headingStyle: CSSProperties = {
    color: typography.color,
    fontSize: getHeadingSize(typography.fontSize),
    fontFamily: getFontFamily(typography.fontFamily),
    fontWeight: typography.fontWeight,
    textAlign,
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    margin: 0,
  };

  const containerStyle: CSSProperties = {
    padding: outerPadding,
    backgroundColor: layout.background.color,
  };

  const Component = headingType;
  return (
    <div style={containerStyle}>
      <Component style={headingStyle}>{content}</Component>
    </div>
  );
}
