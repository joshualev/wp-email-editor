import React, { CSSProperties } from 'react';

import { DividerBlockPropsType } from '@/Domain/Blocks/block-divider';
import { getPadding } from '@/Domain/Blocks/helpers/utils';

export function DividerBlock({ divider, layout, hidden }: DividerBlockPropsType) {
  if (hidden) return null;

  const padding = getPadding(layout.padding);

  const containerStyle: CSSProperties = {
    padding,
  };

  const dividerStyle: CSSProperties = {
    width: divider.width === 'full' ? '100%' : `${divider.width}%`,
    height: 0,
    border: 'none',
    borderTop: `${divider.thickness}px ${divider.style} ${layout.background.color}`,
    margin: '0 auto',
  };

  return (
    <div style={containerStyle}>
      <hr style={dividerStyle} />
    </div>
  );
}
