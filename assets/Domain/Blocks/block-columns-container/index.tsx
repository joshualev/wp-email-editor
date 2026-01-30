/**
 * block-columns-container/index.tsx - Multi-Column Layout Block
 *
 * Container block that arranges child blocks in a horizontal column layout.
 * Supports 1-4 columns with configurable widths (total must equal 600px).
 *
 * Features:
 * - Configurable column widths array (must sum to 600)
 * - Full-width background support
 * - Vertical content alignment (top/middle/baseline)
 * - Responsive stacking on mobile (columns stack vertically)
 * - Padding and background color controls
 *
 * Column Layout:
 * - Desktop: Columns display side-by-side with specified widths
 * - Mobile: Columns stack vertically at 100% width each
 *
 * Schema: ColumnsContainerBlockSchema (from ./schema.ts)
 * - type: 'ColumnsContainer' (discriminator)
 * - data.widths: Number array (e.g., [300, 300] for 2 equal columns)
 * - data.childrenIds: Block IDs for each column's content
 * - data.contentAlignment: 'top' | 'middle' | 'baseline'
 * - data.fullWidth: Edge-to-edge background mode
 *
 * @module Domain/Blocks/block-columns-container
 */
import React, { CSSProperties } from 'react';
import { z } from 'zod';
import { COLUMNS_CONTAINER_SCHEMA } from './schema';
import { getPadding } from '../helpers/utils';

export const ColumnsContainerBlockSchema = COLUMNS_CONTAINER_SCHEMA;
export const ColumnsContainerBlockPropsSchema = COLUMNS_CONTAINER_SCHEMA.shape.data;
export type ColumnsContainerBlockType = z.infer<typeof ColumnsContainerBlockSchema>;
export type ColumnsContainerBlockPropsType = z.infer<typeof ColumnsContainerBlockPropsSchema>;

// Map contentAlignment values to CSS justifyContent values
function getJustifyContent(alignment: 'top' | 'middle' | 'baseline'): CSSProperties['justifyContent'] {
  switch (alignment) {
    case 'top': return 'flex-start';
    case 'middle': return 'center';
    case 'baseline': return 'flex-end';
    default: return 'flex-start';
  }
}

export function ColumnsContainerBlock({
  widths,
  layout,
  contentAlignment,
  fullWidth,
  children,
  isMobile = false,
}: ColumnsContainerBlockPropsType & { children: React.ReactNode[]; isMobile?: boolean }) {
  const wrapperStyle: CSSProperties = fullWidth ? {
    backgroundColor: layout.background.color,
    width: '100%',
  } : {};

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    padding: getPadding(layout.padding),
    backgroundColor: fullWidth ? 'transparent' : layout.background.color,
    width: isMobile ? '100%' : '600px',
    margin: '0 auto',
  };

  const content = (
    <div style={containerStyle} className="section">
      {children.map((columnContent, index) => (
        widths[index] > 0 ? (
          <div
            key={index}
            style={{
              width: isMobile ? '100%' : `${widths[index]}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: getJustifyContent(contentAlignment),
              minHeight: '100px',
            }}
          >
            {columnContent}
          </div>
        ) : null
      ))}
    </div>
  );

  if (fullWidth) {
    return <div style={wrapperStyle}>{content}</div>;
  }

  return content;
}