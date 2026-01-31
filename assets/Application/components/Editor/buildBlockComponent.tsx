/**
 * buildBlockComponent.tsx - Dynamic Block Renderer Factory
 *
 * Creates a React component that can render any registered block type.
 * This is the runtime component resolution mechanism that powers the editor.
 *
 * @module Application/components/Editor
 */
import React from 'react';
import { BaseZodDictionary, BlockConfiguration, DocumentBlocksDictionary } from '@/Domain/Document/utils';

/**
 * Creates a React component that can render any block configuration.
 *
 * Usage:
 * ```tsx
 * const BlockRenderer = buildBlockComponent(blockDictionary);
 *
 * // Later in JSX:
 * <BlockRenderer type="Text" data={{ text: "Hello" }} />
 * ```
 *
 * @param blocks A dictionary of document blocks with schemas and components
 * @returns A React component that renders blocks based on their type
 */
export function buildBlockComponent<T extends BaseZodDictionary>(blocks: DocumentBlocksDictionary<T>) {
  /**
   * Block rendering component.
   *
   * @param type The block type to render
   * @param data The block's data/props
   */
  return function BlockComponent({ type, data }: BlockConfiguration<T>) {
    const Component = blocks[type].Component;
    return <Component {...data} />;
  };
}
