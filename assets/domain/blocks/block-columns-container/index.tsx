/**
 * block-columns-container/index.tsx - Columns Container Schema
 *
 * Schema: ColumnsContainerBlockSchema (from ./schema.ts)
 * - type: 'ColumnsContainer' (discriminator)
 * - data.widths: Number array (e.g., [300, 300] for 2 equal columns)
 * - data.childrenIds: Block IDs for each column's content
 * - data.contentAlignment: 'top' | 'middle' | 'baseline'
 * - data.fullWidth: Edge-to-edge background mode
 *
 * @module domain/blocks/block-columns-container
 */
import { z } from 'zod';
import { COLUMNS_CONTAINER_SCHEMA } from './schema';

export const ColumnsContainerBlockSchema = COLUMNS_CONTAINER_SCHEMA;
export const ColumnsContainerBlockPropsSchema = COLUMNS_CONTAINER_SCHEMA.shape.data;
export type ColumnsContainerBlockType = z.infer<typeof ColumnsContainerBlockSchema>;
export type ColumnsContainerBlockPropsType = z.infer<typeof ColumnsContainerBlockPropsSchema>;
