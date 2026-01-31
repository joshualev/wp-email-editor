/**
 * block-hubspot-header/index.tsx - HubSpot Header Schema
 *
 * Schema: HubSpotHeaderBlockSchema (from ./schema.ts)
 * - type: 'HubSpotHeader' (discriminator)
 * - data.fullWidth: Boolean edge-to-edge mode
 * - data.backgroundColor: Hex color string
 *
 * @module domain/blocks/block-hubspot-header
 */
import { z } from 'zod';
import { HUBSPOT_HEADER_SCHEMA } from './schema';

export const HubSpotHeaderBlockSchema = HUBSPOT_HEADER_SCHEMA;
export const HubSpotHeaderBlockPropsSchema = HUBSPOT_HEADER_SCHEMA.shape.data;
export type HubSpotHeaderBlockType = z.infer<typeof HubSpotHeaderBlockSchema>;
export type HubSpotHeaderBlockPropsType = z.infer<typeof HubSpotHeaderBlockPropsSchema>;
