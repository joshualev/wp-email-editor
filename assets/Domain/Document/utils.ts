/**
 * Document/utils.ts - Document Type Utilities
 *
 * Provides foundational types and utilities for the block-based
 * document system. These types enable type-safe block registration
 * and rendering throughout the application.
 *
 * Type System Overview:
 * ---------------------
 * The document system uses a registry pattern where:
 * 1. Each block type registers a Zod schema and React component
 * 2. The registry generates a discriminated union type
 * 3. Components can render any registered block type
 *
 * This provides full type safety from storage to rendering.
 *
 * @module Domain/Document
 */
import { z } from 'zod';

/**
 * Base type for a dictionary of Zod schemas.
 *
 * Used as a constraint for generic types that work with
 * any set of block schemas.
 *
 * Example:
 * ```ts
 * type MySchemas = {
 *   Text: z.ZodObject<{ text: z.ZodString }>,
 *   Image: z.ZodObject<{ src: z.ZodString }>
 * };
 * ```
 */
export type BaseZodDictionary = { [name: string]: z.AnyZodObject };

/**
 * A dictionary of document blocks with their schemas and components.
 *
 * For each block type key, provides:
 * - schema: Zod schema for validating block data
 * - Component: React component that renders the block
 *
 * The Component props are automatically inferred from the schema,
 * ensuring type-safe prop passing.
 *
 * Example:
 * ```ts
 * const blocks: DocumentBlocksDictionary<MySchemas> = {
 *   Text: {
 *     schema: TextSchema,
 *     Component: (props) => <p>{props.text}</p>
 *   }
 * };
 * ```
 */
export type DocumentBlocksDictionary<T extends BaseZodDictionary> = {
  [K in keyof T]: {
    schema: T[K];
    Component: (props: z.infer<T[K]>) => JSX.Element;
  };
};

/**
 * Configuration for a single block in a document.
 *
 * Uses a discriminated union pattern where:
 * - 'type' identifies the block type
 * - 'data' contains the block-specific properties
 *
 * This type is automatically generated from the block dictionary,
 * creating a union of all possible block configurations.
 *
 * Example (for a Text/Image dictionary):
 * ```ts
 * type Config = 
 *   | { type: 'Text'; data: { text: string } }
 *   | { type: 'Image'; data: { src: string } };
 * ```
 */
export type BlockConfiguration<T extends BaseZodDictionary> = {
  [TType in keyof T]: {
    type: TType;
    data: z.infer<T[TType]>;
  };
}[keyof T];

/**
 * Error thrown when a block is not found in the document.
 *
 * Includes the blockId for debugging purposes.
 */
export class BlockNotFoundError extends Error {
  blockId: string;

  constructor(blockId: string) {
    super('Could not find a block with the given blockId');
    this.blockId = blockId;
  }
}



