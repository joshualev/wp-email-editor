/**
 * block-divider/index.tsx - Divider Block Component
 *
 * Renders horizontal rule dividers with configurable styling.
 * Used to create visual separation between content sections.
 *
 * Features:
 * - Three line styles: solid, dashed, dotted
 * - Configurable thickness (1-10px)
 * - Width control: full (100%) or percentage
 * - Custom line color via layout.background.color
 * - Padding for spacing control
 *
 * Rendering:
 * - Uses CSS border-top on an <hr> element
 * - Automatically centers partial-width dividers
 *
 * Schema: DividerBlockSchema (from ./schema.ts)
 * - type: 'Divider' (discriminator)
 * - data.divider: style, thickness, width
 * - data.layout: Padding and color (background.color = line color)
 *
 * @module Domain/Blocks/block-divider
 */
import React, { CSSProperties } from 'react';
import { z } from 'zod';
import { DIVIDER_BLOCK_SCHEMA } from './schema';
import { getPadding } from '../helpers/utils';

export const DividerBlockSchema = DIVIDER_BLOCK_SCHEMA;
export const DividerBlockPropsSchema = DIVIDER_BLOCK_SCHEMA.shape.data;
export type DividerBlockType = z.infer<typeof DividerBlockSchema>;
export type DividerBlockPropsType = z.infer<typeof DividerBlockPropsSchema>;


export const DividerBlockPropsDefaults: DividerBlockPropsType = {
  divider: {
    style: "solid",
    thickness: 1,
    width: "full",
  },
  layout: {
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    background: { color: '#000000' }
  },
  hidden: false,
};


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