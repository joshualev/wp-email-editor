/**
 * Domain/Blocks/index.tsx - Block Components Export Hub
 *
 * Central export file for all email block components and their schemas.
 * Each block type is self-contained in its own folder with:
 * - index.tsx: React component implementation
 * - schema.ts: Zod validation schema and TypeScript types
 *
 * Block Categories:
 * -----------------
 *
 * Content Blocks (user-placeable):
 * - Button: Call-to-action links
 * - Text: Rich text content
 * - Image: Responsive images
 * - Heading: H1-H6 typography
 * - Divider: Visual separators
 * - BlogPost: WordPress post embed
 *
 * Layout Blocks (structural):
 * - EmailLayout: Root container (one per document)
 * - ColumnsContainer: Row with 1-4 columns
 *
 * HubSpot Blocks (required for email delivery):
 * - HubSpotHeader: Email preheader and browser link
 * - HubSpotFooter: Unsubscribe and company info
 *
 * Naming Convention:
 * ------------------
 * Each block exports:
 * - {Name}Block: React component
 * - {Name}BlockSchema: Zod schema for storage format
 * - {Name}BlockPropsSchema: Zod schema for component props
 * - {Name}BlockType: TypeScript type (inferred from schema)
 * - {Name}BlockPropsType: TypeScript props type
 *
 * @module Domain/Blocks
 */

// Content Blocks
export { ButtonBlockSchema, ButtonBlock, type ButtonBlockType, ButtonBlockPropsSchema, type ButtonBlockPropsType } from './block-button';
export { TextBlockSchema, TextBlock, type TextBlockType, TextBlockPropsSchema, type TextBlockPropsType } from './block-text';
export { ImageBlockSchema, ImageBlock, type ImageBlockType, ImageBlockPropsSchema, type ImageBlockPropsType } from './block-image';
export { HeadingBlockSchema, HeadingBlock, type HeadingBlockType, HeadingBlockPropsSchema, type HeadingBlockPropsType } from './block-heading';
export { DividerBlockSchema, DividerBlock, type DividerBlockType, DividerBlockPropsSchema, type DividerBlockPropsType } from './block-divider';
export { BlogPostBlockSchema, BlogPostBlock, type BlogPostBlockType, BlogPostBlockPropsSchema, type BlogPostBlockPropsType } from './block-post';

// HubSpot Integration Blocks
export {
    HubSpotHeaderBlockSchema,
    HubSpotHeaderBlock,
    type HubSpotHeaderBlockType,
    HubSpotHeaderBlockPropsSchema,
    type HubSpotHeaderBlockPropsType
} from './block-hubspot-header';
export {
    HubSpotFooterBlockSchema,
    HubSpotFooterBlock,
    type HubSpotFooterBlockType,
    HubSpotFooterBlockPropsSchema,
    type HubSpotFooterBlockPropsType
} from './block-hubspot-footer';

// Layout Blocks
export {
    ColumnsContainerBlock,
    ColumnsContainerBlockSchema,
    type ColumnsContainerBlockType,
    ColumnsContainerBlockPropsSchema,
    type ColumnsContainerBlockPropsType
} from './block-columns-container';
export {
    EmailLayoutBlockPropsSchema,
    type EmailLayoutBlockPropsType
} from '@/Domain/Blocks/block-email-layout/schema';
