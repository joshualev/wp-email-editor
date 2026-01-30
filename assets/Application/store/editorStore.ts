/**
 * editorStore.ts - Global State Management
 *
 * This file creates the main Zustand store for the editor application.
 * The store is split into two slices for better organization:
 *
 * Slices:
 * -------
 * 1. documentSlice - Manages the newsletter document state
 *    - Block CRUD operations (add, delete, update, clone)
 *    - Block movement and reordering
 *    - Document reset and synchronization
 *
 * 2. uiSlice - Manages UI state
 *    - Selected block tracking
 *    - Sidebar tab state
 *    - Screen size (desktop/mobile preview)
 *    - Inspector drawer visibility
 *    - Drag and drop state
 *
 * Why Zustand?
 * ------------
 * - Minimal boilerplate
 * - Built-in TypeScript support
 * - Supports slices pattern for code organization
 *
 * Usage:
 * ------
 * ```tsx
 * import useEditorStore from '@/Application/store/editorStore';
 *
 * // In a component:
 * const document = useEditorStore(state => state.document);
 * const addItem = useEditorStore(state => state.addItem);
 * ```
 *
 * @see documentSlice For document operations
 * @see uiSlice For UI state management
 * @module Application/store
 */
import { create } from 'zustand';
import { TEditorStore } from './types';
import { createDocumentSlice } from './slices/documentSlice';
import { createUISlice } from './slices/uiSlice';

/**
 * The main editor store combining document and UI slices.
 *
 * Uses the Zustand slice pattern to compose multiple state slices
 * into a single store while maintaining separation of concerns.
 */
const useEditorStore = create<TEditorStore>()((...args) => ({
  ...createDocumentSlice(...args),
  ...createUISlice(...args)
}));

export default useEditorStore;
