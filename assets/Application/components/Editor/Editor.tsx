/**
 * Editor.tsx - Main Editor Canvas Component
 *
 * The primary editing surface where users build their email newsletter.
 * Handles drag-and-drop interactions, responsive preview, and renders
 * the block tree starting from the root EmailLayout.
 *
 * Drag and Drop System:
 * ---------------------
 * Uses Atlassian's Pragmatic Drag and Drop library which provides:
 * - Native browser drag-and-drop (better performance)
 * - Auto-scrolling during drag operations
 * - Edge detection for precise drop positioning
 *
 * Drop Handling:
 * - ColumnsContainer (rows): Can be reordered vertically
 * - Component blocks: Can move between columns and rows
 * - Edge detection determines if item drops above/below target
 *
 * Screen Size Preview:
 * --------------------
 * The editor supports desktop and mobile preview modes.
 * - Desktop: Full-width rendering
 * - Mobile: 370px width centered container with shadow
 *
 * @module Application/components/Editor
 */
import React, { useEffect } from 'react';

import { autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import { Box, SxProps } from '@mui/material';
import useEditorStore from '../../store/editorStore';
import EditorBlock from '@/Application/components/Editor/EditorBlock';
import Toolbar from '../Toolbar';

/** Edge type for drop positioning */
type Edge = 'top' | 'bottom';

/** Block types that can be dragged within columns */
const componentTypes = ['Image', 'Text', 'Heading', 'Button', 'Divider', 'BlogPost'];

/**
 * Main editor canvas component.
 *
 * Responsibilities:
 * - Set up drag-and-drop monitoring
 * - Handle drop events and delegate to store actions
 * - Render the editor with responsive preview support
 */
export default function Editor() {
  const selectedScreenSize = useEditorStore((state) => state.selectedScreenSize);
  const moveItem = useEditorStore(state => state.moveItem);
  const moveRow = useEditorStore(state => state.moveRow);
  const setBlockDraggingState = useEditorStore(state => state.setBlockDraggingState);

  useEffect(() => {
    return autoScrollWindowForElements({});
  }, []);

  useEffect(() => {
    return monitorForElements({
      onDragStart: () => setBlockDraggingState(true),
      onDrop: ({ source, location }: any) => {
        setBlockDraggingState(false);

        const draggedItem = source.data;
        const dropTargets = location?.current?.dropTargets;
        const dropTarget = dropTargets[0]?.data;
        const currentEdge = extractClosestEdge(dropTarget) as Edge | undefined;

        if (!dropTarget) return;

        if (draggedItem.type === 'ColumnsContainer') {

          if (!currentEdge) return;

          return moveRow({
            sourceId: draggedItem.id,
            targetId: dropTarget.id,
            edge: currentEdge,
          });
        }

        if (componentTypes.includes(draggedItem.type)) {

          if (dropTarget.type === 'Column') {

            return moveItem({
              sourceId: draggedItem.id,
              targetRowId: dropTarget.id,
              targetColumnIndex: dropTarget.columnIndex,
            });
          } else {
            if (!currentEdge) return;
            const columns = dropTargets[1].data.childrenIds as string[][];
            const targetColumnIndex = columns.findIndex(colIds => colIds.includes(dropTarget.id));
            const targetItemIndex = columns[targetColumnIndex].findIndex(childId => childId === dropTarget.id);

            return moveItem({
              sourceId: draggedItem.id,
              targetRowId: dropTargets[1].data.id,
              targetColumnIndex: targetColumnIndex,
              targetItemIndex: targetItemIndex,
              edge: currentEdge,
            });
          }
        }
      },
    });
  }, [moveItem, moveRow, setBlockDraggingState]);


  let mainBoxSx: SxProps = { minHeight: '100%' };

  if (selectedScreenSize === 'mobile') {
    mainBoxSx = {
      ...mainBoxSx,
      margin: '32px auto',
      width: 370,
      minHeight: 800,
      boxShadow:
        'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
    };
  }

  return (
    <>
      <Toolbar />
      <Box sx={{ height: 'calc(100vh - 81px)', overflow: 'auto', minWidth: 370 }}>
        <Box sx={mainBoxSx}>
          <EditorBlock id="root" />
        </Box>
      </Box>
    </>
  );
}
