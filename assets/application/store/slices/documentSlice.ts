/**
 * documentSlice.ts - Document State Management Slice
 *
 * Manages the newsletter document state and provides all actions for
 * manipulating blocks. This is the core of the editor's state logic.
 *
 * Document Structure:
 * -------------------
 * The document is stored as a flat key-value object for O(1) lookups:
 *
 * ```
 * {
 *   "root": { type: "EmailLayout", data: { childrenIds: ["row-1", "row-2"] } },
 *   "row-1": { type: "ColumnsContainer", data: { childrenIds: [["block-1"], ["block-2"]] } },
 *   "block-1": { type: "Text", data: { text: "Hello" } },
 *   "block-2": { type: "Image", data: { src: "..." } }
 * }
 * ```
 *
 * Parent-Child Relationships:
 * ---------------------------
 * - EmailLayout.childrenIds → array of row IDs
 * - ColumnsContainer.childrenIds → 2D array [column][itemIds]
 *
 * Key Operations:
 * ---------------
 * - CRUD: addItem, addRow, deleteBlock, updateBlock
 * - Movement: moveItem, moveRow
 * - Duplication: cloneItem, cloneRow
 * - WordPress Sync: syncBlogPosts, updateBlogPost
 *
 * Image Resizing:
 * ---------------
 * When blocks are moved or columns are resized, images are automatically
 * resized to fit their container width. This includes images nested
 * inside BlogPost components.
 *
 * @module application/store/slices
 */
import { StateCreator } from 'zustand';
import {
  TEditorStore,
  TDocumentSlice,
} from '../types';
import { TEditorBlock, TEditorConfiguration } from '@/application/components/editor/EditorRegistry';
import { wordpressApi } from '@/infrastructure/wordpress/api';
import { TWordPressPostType } from '@/infrastructure/wordpress/dto';
import { TWordPressPost } from '@/domain/types';
import { BlockNotFoundError } from '@/domain/document/utils';

/*
|--------------------------------------------------------------------------
| Type Definitions for Specific Block Types
|--------------------------------------------------------------------------
|
| These extracted types provide proper typing when working with
| specific block types (e.g., after type guards narrow the type).
|
*/

/** ColumnsContainer block type (row with columns) */
export type TColumnsContainerBlock = Extract<TEditorBlock, { type: 'ColumnsContainer' }>;

/** EmailLayout block type (root container) */
export type TEmailLayoutBlock = Extract<TEditorBlock, { type: 'EmailLayout' }>;

/** Image block type */
export type TImageBlock = Extract<TEditorBlock, { type: 'Image' }>;

/** BlogPost block type (WordPress post embed) */
export type TBlogPostBlock = Extract<TEditorBlock, { type: 'BlogPost' }>;

/*
|--------------------------------------------------------------------------
| Default Empty Document
|--------------------------------------------------------------------------
|
| The initial document structure used when creating a new newsletter
| or when the API returns no data. Includes required HubSpot blocks.
|
*/

export const EMPTY_DOCUMENT: TEditorConfiguration = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F5F5F5',
      canvasColor: '#FFFFFF',
      textColor: '#262626',
      fontFamily: 'MODERN_SANS',
      childrenIds: [],
    },
  },
  'hubspot-header': {
    type: 'HubSpotHeader',
    data: {
      fullWidth: false,
      backgroundColor: '#f5f5f5',
    },
  },
  'hubspot-footer': {
    type: 'HubSpotFooter',
    data: {
      fullWidth: false,
      backgroundColor: '#f5f5f5',
    },
  },
};

/*
|--------------------------------------------------------------------------
| Utility Functions
|--------------------------------------------------------------------------
*/

/**
 * Generates a unique ID for a new block.
 *
 * Format: block-{timestamp}-{random8chars}
 * Example: block-1706547892345-a1b2c3d4
 */
const generateId = (): string => {
  const timestamp = Date.now();
  const randomString = crypto.randomUUID().slice(0, 8);
  return `block-${timestamp}-${randomString}`;
};

/*
|--------------------------------------------------------------------------
| Type Guard Functions
|--------------------------------------------------------------------------
|
| Runtime type checks that narrow block types for TypeScript.
|
*/

/** Type guard: checks if block is a ColumnsContainer */
const isColumnsContainer = (block: TEditorBlock): block is TColumnsContainerBlock =>
  block.type === 'ColumnsContainer';

/** Type guard: checks if block is an EmailLayout */
const isEmailLayout = (block: TEditorBlock): block is TEmailLayoutBlock =>
  block.type === 'EmailLayout';

/** Type guard: checks if block is a BlogPost */
const isBlogPost = (block: TEditorBlock): block is TBlogPostBlock => block.type === 'BlogPost';

/*
|--------------------------------------------------------------------------
| Image Resizing Logic
|--------------------------------------------------------------------------
|
| Automatically resizes images to fit their column container.
| Handles both standalone Image blocks and Images nested in BlogPosts.
|
*/

/**
 * Resizes image blocks to fit their parent column width.
 *
 * Accounts for padding when calculating maximum width.
 * Works with both Image blocks and Images inside BlogPost blocks.
 *
 * @param block The block to potentially resize
 * @param blockId The block's ID
 * @param document The current document state
 * @returns The block with updated image dimensions (or unchanged)
 */
const resizeImageBlock = (
  block: TEditorBlock,
  blockId: string,
  document: { [key: string]: TEditorBlock },
): TEditorBlock => {
  if (block.type !== 'BlogPost' && block.type !== 'Image') return block;

  const MIN_IMAGE_WIDTH = 50;

  // Find the ColumnsContainer and column index
  const parentInfo = getParentBlockInfo(document, blockId);
  if (parentInfo && parentInfo.parentBlock.type === 'ColumnsContainer') {
    const { parentBlock } = parentInfo;
    const columnIndex = parentBlock.data.childrenIds.findIndex((column) =>
      column.includes(blockId)
    );
    if (columnIndex !== -1) {
      const columnWidth = parentBlock.data.widths[columnIndex];

      if (block.type === 'Image') {
        const { padding } = block.data.layout;
        const imagePadding = padding.left + padding.right;
        const maxWidth = columnWidth - imagePadding;
        const currentWidth = block.data.image.width;
        const nextWidth = Math.max(
          MIN_IMAGE_WIDTH,
          Math.min(currentWidth, maxWidth)
        );

        if (nextWidth === currentWidth) {
          return block;
        }

        return {
          ...block,
          data: {
            ...block.data,
            image: {
              ...block.data.image,
              width: nextWidth,
            },
          },
        };
      } else if (block.type === 'BlogPost') {
        const { components } = block.data;
        const imageComponentIndex = components.findIndex(
          (component) => component.type === 'Image'
        );
        if (imageComponentIndex !== -1) {
          const image = components[imageComponentIndex] as TImageBlock;
          const { padding } = image.data.layout;
          const imagePadding = padding.left + padding.right;
          const maxWidth = columnWidth - imagePadding;
          const currentWidth = image.data.image.width;
          const nextWidth = Math.max(
            MIN_IMAGE_WIDTH,
            Math.min(currentWidth, maxWidth)
          );

          if (nextWidth === currentWidth) {
            return block;
          }

          const resizedImage: TImageBlock = {
            ...image,
            data: {
              ...image.data,
              image: {
                ...image.data.image,
                width: nextWidth,
              },
            },
          };

          const updatedComponents = [...components];
          updatedComponents[imageComponentIndex] = resizedImage;

          return {
            ...block,
            data: {
              ...block.data,
              components: updatedComponents,
            },
          };
        }
      }
    }
  }

  // If ColumnsContainer not found or no resizing needed, return block as is
  return block;
};

/** Resizes any Image/BlogPost blocks within a ColumnsContainer's columns. */
const resizeImagesInColumnsContainer = (
  container: TColumnsContainerBlock,
  document: { [key: string]: TEditorBlock },
): { [key: string]: TEditorBlock } => {
  const updatedDocument = { ...document };

  container.data.childrenIds.forEach((column) => {
    column.forEach((childId) => {
      const childBlock = updatedDocument[childId];
      if (!childBlock) return;
      updatedDocument[childId] = resizeImageBlock(childBlock, childId, updatedDocument);
    });
  });

  return updatedDocument;
};

/** Deletes a block and its descendants from the document. */
const deleteBlockAndDescendants = (
  document: { [key: string]: TEditorBlock },
  blockId: string
): void => {
  const block = document[blockId];
  if (!block) return;

  // Collect IDs to delete
  const idsToDelete = [blockId];

  const collectChildIds = (blockToDelete: TEditorBlock) => {
    if (isColumnsContainer(blockToDelete) || isEmailLayout(blockToDelete)) {
      blockToDelete.data.childrenIds.flat().forEach((childId) => {
        const childBlock = document[childId];
        if (childBlock) {
          idsToDelete.push(childId);
          collectChildIds(childBlock);
        }
      });
    }
  };

  collectChildIds(block);

  // Delete collected IDs
  idsToDelete.forEach((id) => {
    delete document[id];
  });
};

/** Clones a block and its descendants, assigning new IDs. */
const cloneBlockAndDescendants = (
  originalId: string,
  document: { [key: string]: TEditorBlock },
  idMap: { [key: string]: string }
): { [key: string]: TEditorBlock } => {
  const originalBlock = document[originalId];
  if (!originalBlock) throw new BlockNotFoundError(originalId);

  const newId = generateId();
  idMap[originalId] = newId;

  const clonedData = JSON.parse(JSON.stringify(originalBlock.data));

  const newBlocks: { [key: string]: TEditorBlock } = {};

  if (isColumnsContainer(originalBlock) || isEmailLayout(originalBlock)) {
    clonedData.childrenIds = clonedData.childrenIds.map((children: any) => {
      if (Array.isArray(children)) {
        return children.map((childId: string) => {
          const childBlocks = cloneBlockAndDescendants(childId, document, idMap);
          Object.assign(newBlocks, childBlocks);
          return idMap[childId];
        });
      } else {
        const childBlocks = cloneBlockAndDescendants(children, document, idMap);
        Object.assign(newBlocks, childBlocks);
        return idMap[children];
      }
    });
  }

  if (isBlogPost(originalBlock)) {
    // Deep clone the components
    clonedData.components = clonedData.components.map((component: TEditorBlock) =>
      JSON.parse(JSON.stringify(component))
    );
  }

  newBlocks[newId] = {
    type: originalBlock.type,
    data: clonedData,
  };

  return newBlocks;
};

/** Finds the parent block and its ID of a given block. */
const getParentBlockInfo = (
  blocks: Record<string, TEditorBlock>,
  blockId: string
): { parentId: string; parentBlock: TEditorBlock } | null => {
  const rootBlock = blocks.root as TEmailLayoutBlock;

  // Check if the block is a direct child of the root
  if (rootBlock.data.childrenIds.includes(blockId)) {
    return { parentId: 'root', parentBlock: rootBlock };
  }

  // Find the container that includes the blockId
  const parentContainerId = rootBlock.data.childrenIds.find((containerId) => {
    const container = blocks[containerId] as TColumnsContainerBlock;
    return container.data.childrenIds.some((column) => column.includes(blockId));
  });

  if (parentContainerId) {
    const parentContainer = blocks[parentContainerId] as TColumnsContainerBlock;
    return { parentId: parentContainerId, parentBlock: parentContainer };
  }

  // If no parent is found
  return null;
};

export const createDocumentSlice: StateCreator<
  TEditorStore,
  [],
  [],
  TDocumentSlice
> = (set, get) => ({
  document: EMPTY_DOCUMENT,

  /** Resets the document to a new configuration, ensuring HubSpot blocks exist. */
  resetDocument: (document) => {
    const withHubSpotBlocks = {
      ...document,
      'hubspot-header': document['hubspot-header'] ?? {
        type: 'HubSpotHeader' as const,
        data: { fullWidth: false, backgroundColor: '#f5f5f5' },
      },
      'hubspot-footer': document['hubspot-footer'] ?? {
        type: 'HubSpotFooter' as const,
        data: { fullWidth: false, backgroundColor: '#f5f5f5' },
      },
    };
    set({ document: withHubSpotBlocks });
  },

  /** Retrieves a block by its ID. */
  getBlockById: (blockId) => get().document[blockId] || null,

  /** Finds the parent block of a given block. */
  getParentBlock: (blockId) => {
    const parentInfo = getParentBlockInfo(get().document, blockId);
    return parentInfo ? parentInfo.parentBlock : null;
  },

  /** Retrieves the ColumnsContainer ID that contains a given item. */
  getItemParentColumnsContainerBlockId: (itemId) => {
    const document = get().document;
    const rootBlock = document['root'] as TEmailLayoutBlock;

    for (const containerId of rootBlock.data.childrenIds) {
      const container = document[containerId];
      if (container && isColumnsContainer(container)) {
        for (const column of container.data.childrenIds) {
          if (column.includes(itemId)) {
            return containerId;
          }
        }
      }
    }

    return null;
  },

  /** Updates a block's data and resizes images within it if necessary. */
  updateBlock: (blockId, block) => {
    set((state) => {
      let document = { ...state.document };

      if (block.type === 'ColumnsContainer') {
        document[blockId] = block;
        document = resizeImagesInColumnsContainer(block, document);
      } else {
        // Resize images within the block if necessary
        const resizedBlock = resizeImageBlock(block, blockId, document);
        document[blockId] = resizedBlock;
      }

      return { ...state, document };
    });

    // Set the selected block ID after the state has been updated
    get().setSelectedBlockId(blockId);
  },

  /** 
   * Moves an item to a target column.
   * If `targetItemIndex` and `edge` are provided, it inserts relative to the target item.
   * Otherwise, it inserts the item at index 0 of the target column.
   */
  moveItem: ({
    sourceId,
    targetRowId,
    targetColumnIndex,
    targetItemIndex,
    edge,
  }) => {
    set((state) => {
      const document = { ...state.document };

      const sourceBlock = document[sourceId];
      const targetContainer = document[targetRowId] as TColumnsContainerBlock;

      // Remove sourceId from its current container
      const sourceContainerId = get().getItemParentColumnsContainerBlockId(sourceId);
      if (!sourceContainerId) throw new Error('Source container not found');

      const sourceContainer = document[sourceContainerId] as TColumnsContainerBlock;

      // Remove the sourceId from its current column
      sourceContainer.data.childrenIds = sourceContainer.data.childrenIds.map((column) =>
        column.filter((id) => id !== sourceId)
      );
      document[sourceContainerId] = sourceContainer;

      // Determine the target column based on targetColumnIndex
      const targetColumn = [...targetContainer.data.childrenIds[targetColumnIndex]];

      let insertIndex: number;

      if (targetItemIndex !== undefined && edge) {
        // Insert relative to the target item
        insertIndex = edge === 'bottom' ? targetItemIndex + 1 : targetItemIndex;
      } else {
        // Insert at the beginning of the column
        insertIndex = 0;
      }

      // Insert the sourceId into the target column
      targetColumn.splice(insertIndex, 0, sourceId);
      targetContainer.data.childrenIds[targetColumnIndex] = targetColumn;
      document[targetRowId] = targetContainer;

      // Resize the source block after moving
      const resizedBlock = resizeImageBlock(sourceBlock, sourceId, document);
      document[sourceId] = resizedBlock;

      return { ...state, document };
    });

    // Set the selected block ID after the state has been updated
    get().setSelectedBlockId(sourceId);
  },

  /** Reorders a row within the EmailLayout. */
  moveRow: ({ sourceId, targetId, edge }) => {
    set((state) => {
      const document = { ...state.document };
      const emailLayout = document['root'] as TEmailLayoutBlock;

      const childrenIds = emailLayout.data.childrenIds.filter((id) => id !== sourceId);
      const targetIndex = childrenIds.indexOf(targetId);
      const insertIndex = edge === 'bottom' ? targetIndex + 1 : targetIndex;

      childrenIds.splice(insertIndex, 0, sourceId);
      emailLayout.data.childrenIds = childrenIds;
      document['root'] = emailLayout;

      return { ...state, document };
    });

    // Set the selected block ID after the state has been updated
    get().setSelectedBlockId(sourceId);
  },

  /** Deletes a block and its descendants from the document. */
  deleteBlock: (blockId) => {
    set((state) => {
      const document = { ...state.document };

      const parentInfo = getParentBlockInfo(document, blockId);
      if (parentInfo) {
        const { parentId, parentBlock } = parentInfo;
        if (isColumnsContainer(parentBlock)) {
          parentBlock.data.childrenIds = parentBlock.data.childrenIds.map((column) =>
            column.filter((id) => id !== blockId)
          );
        } else if (isEmailLayout(parentBlock)) {
          parentBlock.data.childrenIds = parentBlock.data.childrenIds.filter((id) => id !== blockId);
        }
        document[parentId] = parentBlock;
      }

      deleteBlockAndDescendants(document, blockId);

      return { ...state, document };
    });

    get().setSelectedBlockId(null);
  },

  /** Adds an item to a specific column in a ColumnsContainer. */
  addItem: ({ block, columnsContainerId, columnIndex, itemIndex, position }) => {
    const newBlockId = generateId();

    set((state) => {
      const document = { ...state.document };
      const container = document[columnsContainerId] as TColumnsContainerBlock;
      const targetColumn = [...container.data.childrenIds[columnIndex]];

      let insertIndex = targetColumn.length;
      if (itemIndex && position) {
        const itemPosition = targetColumn.indexOf(itemIndex);
        insertIndex = position === 'bottom' ? itemPosition + 1 : itemPosition;
      }

      // Add the new block to the document
      document[newBlockId] = block;

      // Insert the new block into the column
      targetColumn.splice(insertIndex, 0, newBlockId);
      container.data.childrenIds[columnIndex] = targetColumn;
      document[columnsContainerId] = container;

      // Resize the new block after adding
      const resizedBlock = resizeImageBlock(block, newBlockId, document);
      document[newBlockId] = resizedBlock;

      return { ...state, document };
    });

    // Set the selected block ID after the state has been updated
    get().setSelectedBlockId(newBlockId);
  },

  /** Adds a new row (ColumnsContainer) to the EmailLayout. */
  addRow: ({ block, position }) => {
    const newBlockId = generateId();

    set((state) => {
      const document = { ...state.document };
      const emailLayout = document['root'] as TEmailLayoutBlock;
      const childrenIds = [...emailLayout.data.childrenIds];

      const insertIndex = position !== undefined ? position : childrenIds.length;
      childrenIds.splice(insertIndex, 0, newBlockId);
      emailLayout.data.childrenIds = childrenIds;
      document['root'] = emailLayout;

      document[newBlockId] = block;

      // Resize images within the new row if needed
      const resizedBlock = resizeImageBlock(block, newBlockId, document);
      document[newBlockId] = resizedBlock;

      return { ...state, document };
    });

    // Set the selected block ID after the state has been updated
    get().setSelectedBlockId(newBlockId);
  },


  /** Clones a block and its descendants. */
  cloneItem: (blockId) => {
    // Generate new IDs and clone blocks outside of set()
    const document = get().document;
    const idMap: Record<string, string> = {};

    const newBlocks = cloneBlockAndDescendants(blockId, document, idMap);
    const newClonedId = idMap[blockId];

    set((state) => {
      const documentCopy = { ...state.document };
      Object.assign(documentCopy, newBlocks);

      const parentInfo = getParentBlockInfo(documentCopy, blockId);
      if (parentInfo) {
        const { parentId, parentBlock } = parentInfo;
        if (parentBlock.type === 'ColumnsContainer') {
          parentBlock.data.childrenIds = parentBlock.data.childrenIds.map((column) => {
            if (column.includes(blockId)) {
              const index = column.indexOf(blockId);
              return [
                ...column.slice(0, index + 1),
                newClonedId,
                ...column.slice(index + 1),
              ];
            }
            return column;
          });
        } else if (isEmailLayout(parentBlock)) {
          const index = parentBlock.data.childrenIds.indexOf(blockId);
          parentBlock.data.childrenIds.splice(index + 1, 0, newClonedId);
        }
        documentCopy[parentId] = parentBlock;
      }

      // Resize images within the cloned block
      const resizedBlock = resizeImageBlock(
        documentCopy[newClonedId],
        newClonedId,
        documentCopy
      );
      documentCopy[newClonedId] = resizedBlock;

      return { document: documentCopy };
    });

    // Set the selected block ID after the state has been updated
    get().setSelectedBlockId(newClonedId);
  },

  /** Clones a row (ColumnsContainer) and its descendants. */
  cloneRow: (rowId) => {
    // Generate new IDs and clone blocks outside of set()
    const document = get().document;
    const idMap: Record<string, string> = {};

    const newBlocks = cloneBlockAndDescendants(rowId, document, idMap);
    const newClonedRowId = idMap[rowId];

    set((state) => {
      const documentCopy = { ...state.document };
      Object.assign(documentCopy, newBlocks);

      const emailLayout = documentCopy['root'] as TEmailLayoutBlock;
      const childrenIds = [...emailLayout.data.childrenIds];
      const index = childrenIds.indexOf(rowId);
      childrenIds.splice(index + 1, 0, newClonedRowId);
      emailLayout.data.childrenIds = childrenIds;
      documentCopy['root'] = emailLayout;

      // Resize images within the cloned row
      const resizedRowBlock = resizeImageBlock(
        documentCopy[newClonedRowId],
        newClonedRowId,
        documentCopy
      );
      documentCopy[newClonedRowId] = resizedRowBlock;

      return { document: documentCopy };
    });

    // Set the selected block ID after the state has been updated
    get().setSelectedBlockId(newClonedRowId);
  },


  /** Synchronizes all BlogPost blocks with the latest data from WordPress. */
  syncBlogPosts: async () => {
    const { document, updateBlogPost } = get();

    // Step 1: Retrieve all BlogPost blocks with their IDs
    const blogPostBlocks = Object.entries(document)
      .filter(([_, block]) => block.type === 'BlogPost') as [string, TBlogPostBlock][];

    if (blogPostBlocks.length === 0) return;

    // Step 2: Extract wordpressIds and group by postType
    const postTypeMap: Record<string, number[]> = {};

    blogPostBlocks.forEach(([blockId, block]) => {
      let { wordpressId, postType } = block.data;

      // Normalize postType to ensure it's plural
      if (postType === 'post') {
        postType = 'posts';
      }

      if (wordpressId && postType) {
        if (!postTypeMap[postType]) {
          postTypeMap[postType] = [];
        }
        postTypeMap[postType].push(Number(wordpressId));
      }
    });

    // Step 3: Fetch latest posts from WordPress
    try {
      const fetchPromises = Object.entries(postTypeMap).map(async ([postType, ids]) => {
        const posts = await wordpressApi.fetchAllPosts(ids, postType as TWordPressPostType);
        return { postType, posts };
      });

      const fetchedResults = await Promise.all(fetchPromises);

      // Step 4: Update BlogPost blocks if there are changes
      fetchedResults.forEach(({ postType, posts }) => {
        posts.forEach(post => {
          // Find the blockId corresponding to this post
          const [blockId] = blogPostBlocks.find(([_, block]) => {
            // Normalize both postTypes for comparison
            const normalizedBlockType = block.data.postType === 'post' ? 'posts' : block.data.postType;
            const normalizedPostType = post.postType === 'post' ? 'posts' : post.postType;

            return String(block.data.wordpressId) === String(post.wordpressId) &&
              normalizedBlockType === normalizedPostType;
          }) || [null, null];

          if (blockId) {
            updateBlogPost(blockId, post);
          }
        });
      });
    } catch (error) {
      console.error('Error syncing blog posts:', error);
      // Handle error accordingly
    }
  },
  /**
    * Updates a BlogPost block with new data from a WordPress post.
    * This method can be used both by the form and the sync function.
    */
  updateBlogPost: (blockId: string, post: TWordPressPost) => {
    set((state) => {
      const document = { ...state.document };
      const block = document[blockId] as TBlogPostBlock | undefined;

      if (!block) {
        console.error(`Block with ID ${blockId} not found.`);
        return state;
      }

      // Update the block's data with the new post information
      const updatedComponents = block.data.components.map((component) => {
        switch (component.type) {
          case 'Image':
            return {
              ...component,
              data: {
                ...component.data,
                image: {
                  ...component.data.image,
                  url: post.image || component.data.image.url,
                  alt: post.title || component.data.image.alt,
                },
                hidden: !post.image,
              },
            };
          case 'Heading':
            return {
              ...component,
              data: {
                ...component.data,
                content: post.title || component.data.content,
                hidden: !post.title,
              },
            };
          case 'Text':
            return {
              ...component,
              data: {
                ...component.data,
                content: post.excerpt || component.data.content,
                hidden: !post.excerpt,
              },
            };
          case 'Button':
            return {
              ...component,
              data: {
                ...component.data,
                content: 'Read More',
                button: {
                  ...component.data.button,
                  url: post.permalink || component.data.button.url,
                  hidden: !post.permalink,
                },
              },
            };
          default:
            return component;
        }
      });

      // Update the block with new components and post metadata
      document[blockId] = {
        ...block,
        data: {
          ...block.data,
          wordpressId: post.wordpressId,
          postType: post.postType,
          components: updatedComponents,
        },
      };

      return { ...state, document };
    });
  },

});
