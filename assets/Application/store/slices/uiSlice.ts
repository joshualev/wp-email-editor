/**
 * uiSlice.ts - UI State Management Slice
 *
 * Manages all user interface state that is independent of the document
 * content. This includes selection, sidebar visibility, preview mode,
 * and drag-and-drop state.
 *
 * State Properties:
 * -----------------
 * - selectedBlockId: Currently selected block for editing
 * - selectedSidebarTab: Active tab in the inspector drawer
 * - selectedScreenSize: Preview mode (desktop/mobile)
 * - isInspectorDrawerOpen: Whether the right sidebar is visible
 * - isBlockBeingDragged: Whether a drag operation is in progress
 *
 * Smart Selection Behavior:
 * -------------------------
 * When a block is selected:
 * - Root selection → Shows 'styles' tab (global settings)
 * - Other blocks → Shows 'block-configuration' tab
 * - Selection automatically opens the inspector drawer
 *
 * @module Application/store/slices
 */
import { StateCreator } from 'zustand';
import { TEditorStore, TUISlice, TSidebarTab, TScreenSize } from '../types';

/**
 * Creates the UI slice for the Zustand store.
 *
 * Uses Zustand's StateCreator pattern to integrate with the combined store.
 */
export const createUISlice: StateCreator<TEditorStore, [], [], TUISlice> = (set, get) => ({
  // Initial state
  selectedBlockId: 'root',
  selectedSidebarTab: 'styles',
  selectedScreenSize: 'desktop',
  isInspectorDrawerOpen: true,
  isBlockBeingDragged: false,
  isHubSpotConfigured: false,

  /**
   * Sets the selected block ID and updates related UI states.
   *
   * Smart behavior:
   * - Selecting 'root' or null → stays on 'styles' tab
   * - Selecting other blocks → switches to 'block-configuration'
   * - Any selection opens the inspector drawer
   *
   * @param selectedBlockId - The ID of the selected block (null to deselect)
   */
  setSelectedBlockId: (selectedBlockId) => {
    const newTab = (!selectedBlockId || selectedBlockId === 'root')
      ? 'styles'
      : 'block-configuration';

    set({
      selectedBlockId,
      selectedSidebarTab: newTab,
      isInspectorDrawerOpen: selectedBlockId ? true : get().isInspectorDrawerOpen,
    });
  },

  /**
   * Sets the current sidebar tab.
   * @param selectedSidebarTab - The sidebar tab to select
   */
  setSidebarTab: (selectedSidebarTab: TSidebarTab) => set({ selectedSidebarTab }),

  /**
   * Sets the current screen preview size.
   *
   * When switching to mobile preview, automatically closes the
   * inspector drawer to maximize canvas space.
   *
   * @param selectedScreenSize - The screen size to preview
   */
  setSelectedScreenSize: (selectedScreenSize: TScreenSize) => {
    if (selectedScreenSize === 'mobile') {
      set({ selectedScreenSize, isInspectorDrawerOpen: false });
    } else {
      set({ selectedScreenSize });
    }
  },

  /**
   * Toggles the inspector drawer open/closed.
   */
  toggleInspectorDrawer: () =>
    set((state) => ({ isInspectorDrawerOpen: !state.isInspectorDrawerOpen })),

  /**
   * Sets the dragging state for blocks.
   *
   * Used to update UI during drag operations (e.g., showing drop zones).
   *
   * @param isDragging - Whether a block is currently being dragged
   */
  setBlockDraggingState: (isDragging: boolean) => set({ isBlockBeingDragged: isDragging }),

  /**
   * Sets whether HubSpot HubDB is configured (controls save availability).
   */
  setHubSpotConfigured: (isConfigured: boolean) => set({ isHubSpotConfigured: isConfigured }),
});
