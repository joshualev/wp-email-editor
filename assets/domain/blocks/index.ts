/**
 * domain/blocks/index.ts - Block Schemas Export Hub
 *
 * Central export file for all email block schemas, types, and defaults.
 * React render components now live in application/components/blocks.
 *
 * Each block type is self-contained in its own folder with:
 * - index.ts: Zod schema exports, types, and defaults
 * - schema.ts: Zod validation schema definitions
 *
 * Block Categories:
 * -----------------
 *
 * Content Blocks (user-placeable):
 * - Button, Text, Image, Heading, Divider, BlogPost
 *
 * Layout Blocks (structural):
 * - EmailLayout, ColumnsContainer
 *
 * HubSpot Blocks (required for email delivery):
 * - HubSpotHeader, HubSpotFooter
 *
 * @module domain/blocks
 */

// Content Blocks
export { ButtonBlockSchema, type ButtonBlockType, ButtonBlockPropsSchema, type ButtonBlockPropsType, ButtonBlockPropsDefaults } from './block-button';
export { TextBlockSchema, type TextBlockType, TextBlockPropsSchema, type TextBlockPropsType, TextBlockPropsDefaults } from './block-text';
export { ImageBlockSchema, type ImageBlockType, ImageBlockPropsSchema, type ImageBlockPropsType, ImageBlockPropsDefaults } from './block-image';
export { HeadingBlockSchema, type HeadingBlockType, HeadingBlockPropsSchema, type HeadingBlockPropsType, HeadingBlockPropsDefaults } from './block-heading';
export { DividerBlockSchema, type DividerBlockType, DividerBlockPropsSchema, type DividerBlockPropsType, DividerBlockPropsDefaults } from './block-divider';
export { BlogPostBlockSchema, type BlogPostBlockType, BlogPostBlockPropsSchema, type BlogPostBlockPropsType, BlogPostBlockPropsDefaults } from './block-post';

// HubSpot Integration Blocks
export {
  HubSpotHeaderBlockSchema,
  type HubSpotHeaderBlockType,
  HubSpotHeaderBlockPropsSchema,
  type HubSpotHeaderBlockPropsType,
} from './block-hubspot-header';
export {
  HubSpotFooterBlockSchema,
  type HubSpotFooterBlockType,
  HubSpotFooterBlockPropsSchema,
  type HubSpotFooterBlockPropsType,
} from './block-hubspot-footer';

// Layout Blocks
export {
  ColumnsContainerBlockSchema,
  type ColumnsContainerBlockType,
  ColumnsContainerBlockPropsSchema,
  type ColumnsContainerBlockPropsType,
} from './block-columns-container';
export {
  EmailLayoutBlockPropsSchema,
  type EmailLayoutBlockPropsType,
} from '@/domain/blocks/block-email-layout/schema';
