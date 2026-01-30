export { buildBlockComponent } from '@/Domain/Document/buildBlockComponent';
export { buildBlockConfigurationSchema } from '@/Domain/Document/buildBlockConfigurationSchema';
export { buildBlockConfigurationDictionary } from '@/Domain/Document/buildBlockConfigurationDictionary';

export * from './utils';


/**
 * This module provides a set of utilities and builders for creating and managing
 * document blocks in a flexible, type-safe manner.
 * 
 * Exported functions:
 * - buildBlockComponent: Creates a React component that can render any block configuration.
 * - buildBlockConfigurationSchema: Builds a Zod schema for validating block configurations.
 * - buildBlockConfigurationDictionary: A type-safe identity function for block dictionaries.
 * 
 * Exported types:
 * - BlockConfiguration: Represents the configuration for a single document block.
 * - DocumentBlocksDictionary: A dictionary of document blocks with schemas and components.
 * 
 * These exports work together to provide a robust system for defining, validating,
 * and rendering custom document blocks in a type-safe way.
 */