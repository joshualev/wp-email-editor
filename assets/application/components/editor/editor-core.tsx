/**
 * editor-core.tsx - Editor Block Registry
 *
 * This is the central configuration file for the block-based editor.
 * It registers all available block types, their validation schemas,
 * and their React rendering components.
 *
 * Architecture:
 * -------------
 * The editor uses a registry pattern:
 *
 *   EDITOR_DICTIONARY
 *   ├── EmailLayout      → Root container block
 *   ├── ColumnsContainer → Row with columns
 *   ├── Text            → Rich text content
 *   ├── Image           → Image with sizing/alignment
 *   ├── Heading         → H1-H6 headings
 *   ├── Button          → Call-to-action buttons
 *   ├── Divider         → Visual separators
 *   ├── BlogPost        → WordPress post embed
 *   ├── HubSpotHeader   → HubSpot email header
 *   └── HubSpotFooter   → HubSpot email footer
 *
 * Each entry contains:
 * - schema: Zod schema for validating block data
 * - Component: React component wrapped with EditorBlockWrapper
 *
 * Mobile-Responsive Blocks:
 * -------------------------
 * Some blocks receive an `isMobile` prop to adjust rendering
 * based on the current preview mode (desktop/mobile).
 *
 * Exports:
 * --------
 * - EditorBlock: Component that renders any block by type
 * - EditorBlockSchema: Zod schema for any block
 * - EditorConfigurationSchema: Zod schema for the full document
 * - TEditorBlock: TypeScript type for any block
 * - TEditorConfiguration: TypeScript type for the document
 *
 * @module application/components/editor
 */
import React from 'react';
import { z } from 'zod';
import {
  BlogPostBlock,
  ButtonBlock,
  DividerBlock,
  HeadingBlock,
  HubSpotFooterBlock,
  HubSpotHeaderBlock,
  ImageBlock,
  TextBlock,
} from '@/application/components/blocks';
import {
  BlogPostBlockPropsSchema,
  ButtonBlockPropsSchema,
  ColumnsContainerBlockPropsSchema,
  DividerBlockPropsSchema,
  EmailLayoutBlockPropsSchema,
  HeadingBlockPropsSchema,
  HubSpotFooterBlockPropsSchema,
  HubSpotHeaderBlockPropsSchema,
  ImageBlockPropsSchema,
  TextBlockPropsSchema,
} from '@/domain/blocks';

import useEditorStore from '@/application/store/editorStore';
import { buildBlockComponent } from '@/application/components/editor/buildBlockComponent';
import { buildBlockConfigurationDictionary } from '@/domain/document/buildBlockConfigurationDictionary';
import { buildBlockConfigurationSchema } from '@/domain/document/buildBlockConfigurationSchema';

import ColumnsContainerEditor from '@/application/components/editor/editor-block-columns-container/ColumnsContainerEditor';
import EmailLayoutEditor from '@/application/components/editor/editor-block-email-layout/EmailLayoutEditor';

import EditorBlockWrapper from '@/application/components/editor/editor-block-wrapper/EditorBlockWrapper';
import HubSpotBlockWrapper from '@/application/components/editor/editor-block-wrapper/HubSpotBlockWrapper';

/*
|--------------------------------------------------------------------------
| Mobile-Responsive Block Wrappers
|--------------------------------------------------------------------------
|
| These wrapper components inject the isMobile prop based on the current
| screen size selection in the store. This allows blocks to render
| differently for mobile preview.
|
*/

/** BlogPost block with mobile responsiveness */
function BlogPostBlockWithMobile(props: React.ComponentProps<typeof BlogPostBlock>) {
  const isMobile = useEditorStore(state => state.selectedScreenSize === 'mobile');
  return <BlogPostBlock {...props} isMobile={isMobile} />;
}

/** Button block with mobile responsiveness */
function ButtonBlockWithMobile(props: React.ComponentProps<typeof ButtonBlock>) {
  const isMobile = useEditorStore(state => state.selectedScreenSize === 'mobile');
  return <ButtonBlock {...props} isMobile={isMobile} />;
}

/** Heading block with mobile responsiveness */
function HeadingBlockWithMobile(props: React.ComponentProps<typeof HeadingBlock>) {
  const isMobile = useEditorStore(state => state.selectedScreenSize === 'mobile');
  return <HeadingBlock {...props} isMobile={isMobile} />;
}

/** Image block with mobile responsiveness */
function ImageBlockWithMobile(props: React.ComponentProps<typeof ImageBlock>) {
  const isMobile = useEditorStore(state => state.selectedScreenSize === 'mobile');
  return <ImageBlock {...props} isMobile={isMobile} />;
}

/** Text block with mobile responsiveness */
function TextBlockWithMobile(props: React.ComponentProps<typeof TextBlock>) {
  const isMobile = useEditorStore(state => state.selectedScreenSize === 'mobile');
  return <TextBlock {...props} isMobile={isMobile} />;
}

/*
|--------------------------------------------------------------------------
| Block Registry (EDITOR_DICTIONARY)
|--------------------------------------------------------------------------
|
| The central registry of all available block types. Each block type
| is mapped to its validation schema and rendering component.
|
| To add a new block type:
| 1. Create the schema + defaults in domain/blocks/block-{name}/
| 2. Create the render component in application/components/blocks
| 3. Export schema from domain/blocks and component from application/components/blocks
| 4. Add entry here with schema and wrapped Component
|
*/

const EDITOR_DICTIONARY = buildBlockConfigurationDictionary({
  EmailLayout: {
    schema: EmailLayoutBlockPropsSchema,
    Component: (props) => <EmailLayoutEditor {...props} />,
  },
  ColumnsContainer: {
    schema: ColumnsContainerBlockPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ColumnsContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  BlogPost: {
    schema: BlogPostBlockPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <BlogPostBlockWithMobile {...props} />
      </EditorBlockWrapper>
    ),
  },
  Button: {
    schema: ButtonBlockPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ButtonBlockWithMobile {...props} />
      </EditorBlockWrapper>
    ),
  },
  Heading: {
    schema: HeadingBlockPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <HeadingBlockWithMobile {...props} />
      </EditorBlockWrapper>
    ),
  },
  Image: {
    schema: ImageBlockPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ImageBlockWithMobile {...props} />
      </EditorBlockWrapper>
    ),
  },
  Text: {
    schema: TextBlockPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <TextBlockWithMobile {...props} />
      </EditorBlockWrapper>
    ),
  },
  Divider: {
    schema: DividerBlockPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <DividerBlock {...props} />
      </EditorBlockWrapper>
    ),
  },
  HubSpotHeader: {
    schema: HubSpotHeaderBlockPropsSchema,
    Component: (props) => (
      <HubSpotBlockWrapper>
        <HubSpotHeaderBlock {...props} />
      </HubSpotBlockWrapper>
    ),
  },
  HubSpotFooter: {
    schema: HubSpotFooterBlockPropsSchema,
    Component: (props) => (
      <HubSpotBlockWrapper>
        <HubSpotFooterBlock {...props} />
      </HubSpotBlockWrapper>
    ),
  },
});

export const EditorBlock = buildBlockComponent(EDITOR_DICTIONARY);
export const EditorBlockSchema = buildBlockConfigurationSchema(EDITOR_DICTIONARY);
export const EditorConfigurationSchema = z.record(z.string(), EditorBlockSchema);

export type TEditorBlock = z.infer<typeof EditorBlockSchema>;
export type TEditorConfiguration = Record<string, TEditorBlock>;
