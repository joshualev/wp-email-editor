/**
 * types.ts - Editor Store Type Definitions
 *
 * This file contains all TypeScript interfaces and types used by the
 * Zustand store slices. It defines the shape of state and action parameters.
 *
 * Type Hierarchy:
 * ---------------
 * TEditorStore (combined store type)
 * ├── TDocumentSlice (document state + actions)
 * └── TUISlice (UI state + actions)
 *
 * @module application/store
 */
import { TEditorConfiguration, TEditorBlock } from '@/application/components/editor/EditorRegistry';
import { TWordPressPost } from '@/domain/types';

/**
 * Parameters for moving an item (block) within the editor.
 *
 * Items can be moved:
 * - Between columns in the same row
 * - Between different rows
 * - To different positions within the same column
 */
export interface MoveItemParams {
  /** The ID of the block being moved */
  sourceId: string;
  /** The ID of the ColumnsContainer (row) to move to */
  targetRowId: string;
  /** The column index within the target row (0-based) */
  targetColumnIndex: number;
  /** Optional: specific position within the column */
  targetItemIndex?: number;
  /** Optional: whether to insert above or below the target position */
  edge?: 'top' | 'bottom';
}

/**
 * Parameters for moving a row (ColumnsContainer) within the editor.
 *
 * Rows can only be reordered vertically within the EmailLayout.
 */
export interface MoveRowParams {
  /** The ID of the row being moved */
  sourceId: string;
  /** The ID of the row to move relative to */
  targetId: string;
  /** Whether to place above or below the target row */
  edge: 'top' | 'bottom';
}

/**
 * Parameters for adding a new item (block) to the editor.
 *
 * New items are inserted into a specific column at a specific position.
 */
export interface AddItemParams {
  /** The block configuration to add */
  block: TEditorBlock;
  /** The ID of the ColumnsContainer to add the block to */
  columnsContainerId: string;
  /** The column index to insert into (0-based) */
  columnIndex: number;
  /** Optional: the ID of an existing item to position relative to */
  itemIndex?: string;
  /** Optional: whether to insert above or below the reference item */
  position?: 'top' | 'bottom';
}

/**
 * Parameters for adding a new row (ColumnsContainer) to the editor.
 *
 * New rows are inserted into the EmailLayout at a specific position.
 */
export interface AddRowParams {
  /** The ColumnsContainer block configuration to add */
  block: TEditorBlock;
  /** Optional: the position index to insert at */
  position?: number;
}

/**
 * Document Slice Interface
 *
 * Manages the newsletter document state and provides actions for
 * manipulating blocks. The document is stored as a flat key-value
 * structure for efficient lookups and updates.
 *
 * Document Structure:
 * -------------------
 * ```
 * {
 *   "root": { type: "EmailLayout", data: { childrenIds: ["row-1"] } },
 *   "row-1": { type: "ColumnsContainer", data: { childrenIds: [["block-1"]] } },
 *   "block-1": { type: "Text", data: { text: "Hello" } }
 * }
 * ```
 *
 * This flat structure allows O(1) block lookups while maintaining
 * parent-child relationships through ID references.
 */
export interface TDocumentSlice {
  /** The current newsletter document configuration */
  document: TEditorConfiguration;

  /** Replace the entire document (used on initial load) */
  resetDocument: (document: TEditorConfiguration) => void;

  /** Get a block by its ID, returns null if not found */
  getBlockById: (blockId: string) => TEditorBlock | null;

  /** Get the parent block of a given block */
  getParentBlock: (blockId: string) => TEditorBlock | null;

  /** Get the ColumnsContainer ID that contains a given item */
  getItemParentColumnsContainerBlockId: (itemId: string) => string | null;

  /** Move an item (block) to a new position */
  moveItem: (params: MoveItemParams) => void;

  /** Move a row (ColumnsContainer) to a new position */
  moveRow: (params: MoveRowParams) => void;

  /** Delete a block and all its descendants */
  deleteBlock: (blockId: string) => void;

  /** Add a new item (block) to a column */
  addItem: (params: AddItemParams) => void;

  /** Add a new row (ColumnsContainer) to the layout */
  addRow: (params: AddRowParams) => void;

  /** Clone an item and insert the copy adjacent to the original */
  cloneItem: (blockId: string) => void;

  /** Clone a row and insert the copy adjacent to the original */
  cloneRow: (rowId: string) => void;

  /** Update a block's configuration */
  updateBlock: (blockId: string, block: TEditorBlock) => void;

  /** Sync all BlogPost blocks with latest WordPress data */
  syncBlogPosts: () => Promise<void>;

  /** Update a BlogPost block with WordPress post data */
  updateBlogPost: (blockId: string, post: TWordPressPost) => void;
}

/**
 * UI Slice Interface
 *
 * Manages the editor's UI state including selection, sidebar,
 * screen preview mode, and drag-and-drop state.
 */

/** Available sidebar tabs */
export type TSidebarTab = 'block-configuration' | 'styles' | 'json';

/** Screen preview sizes */
export type TScreenSize = 'desktop' | 'mobile';

export interface TUISlice {
  /** Currently selected block ID (null if none selected) */
  selectedBlockId: string | null;

  /** Currently active sidebar tab */
  selectedSidebarTab: TSidebarTab;

  /** Current screen preview size */
  selectedScreenSize: TScreenSize;

  /** Whether the inspector drawer is open */
  isInspectorDrawerOpen: boolean;

  /** Whether a block is currently being dragged */
  isBlockBeingDragged: boolean;

  /** Whether HubSpot HubDB is configured (controls save availability) */
  isHubSpotConfigured: boolean;

  /** Select a block and update related UI state */
  setSelectedBlockId: (selectedBlockId: string | null) => void;

  /** Switch the active sidebar tab */
  setSidebarTab: (tab: TSidebarTab) => void;

  /** Switch between desktop and mobile preview */
  setSelectedScreenSize: (size: TScreenSize) => void;

  /** Toggle the inspector drawer open/closed */
  toggleInspectorDrawer: () => void;

  /** Set the drag state (used for drop zone styling) */
  setBlockDraggingState: (isDragging: boolean) => void;

  /** Set HubSpot configuration status */
  setHubSpotConfigured: (isConfigured: boolean) => void;
}

/**
 * Combined Editor Store Type
 *
 * The complete store type combining both document and UI slices.
 * This is the type used when accessing the store.
 */
export type TEditorStore = TDocumentSlice & TUISlice;
