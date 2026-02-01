import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';

import { once } from '@atlaskit/pragmatic-drag-and-drop/once';

import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';

import useEditorStore from '@/application/store/editorStore';

import { useCurrentBlockId } from '@/application/components/editor/EditorBlock';
import BlockBuilderLayer from './block-builder-layer/BlockBuilderLayer';

// Types
type ValidEdge = 'top' | 'bottom';

// State
type State =
  | { type: 'idle' }
  | { type: 'isOver'; }
  | { type: 'preview'; container: HTMLElement };

// preventing re-renders with stable state objects
const idle: State = { type: 'idle' };

interface Props {
  children: JSX.Element;
}

// Constants
const BLOCK_TYPES_MAP = {
  ROW: ['ColumnsContainer'],
  EMPTY_COLUMN: ['Column'],
  COMPONENT: [
    'BlogPost',
    'Heading',
    'Button',
    'Spacer',
    'Divider',
    'Image',
    'Text',
  ],
};

// Type Guards
function isValidEdge(edge: Edge): edge is ValidEdge {
  return edge === 'top' || edge === 'bottom';
}

// Styled Components
const BlockContainer = styled.div<{
  isHighlighted: boolean;
  isDragging: boolean;
}>`
  position: relative;
  max-width: 100%;
  transition: background 0.2s;
  background-color: ${({ isHighlighted }) =>
    isHighlighted ? 'rgba(37, 99, 235, 0.25)' : 'transparent'};
  opacity: ${({ isDragging }) => isDragging ? 0.4 : 1};
  min-height: 16px;
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    bottom: -8px;
    z-index: 1;
    pointer-events: auto;
  }
`;

const DropIndicator = styled.div<{ edge: ValidEdge }>`
  position: absolute;
  left: 0;
  right: 0;
  ${({ edge }) => edge === 'top' ? 'top: 0;' : 'bottom: 0;'}
  height: 2px;
  background-color: rgb(37, 99, 235);
  z-index: 1;
`;

const PreviewContainer = styled.div`
  padding: 10px 14px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PreviewIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #f3f4f6;
  border-radius: 4px;
  color: #6b7280;
  font-size: 14px;
`;

const PreviewLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
`;

// Block type display names and icons
const BLOCK_DISPLAY_INFO: Record<string, { label: string; icon: string }> = {
  'ColumnsContainer': { label: 'Row', icon: '☰' },
  'BlogPost': { label: 'Blog Post', icon: '📰' },
  'Text': { label: 'Text', icon: 'T' },
  'Heading': { label: 'Heading', icon: 'H' },
  'Image': { label: 'Image', icon: '🖼' },
  'Button': { label: 'Button', icon: '▢' },
  'Divider': { label: 'Divider', icon: '—' },
};

// Main Component
export default function EditorBlockWrapper({ children }: Props) {
  // State and refs
  const blockRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [closestEdge, setClosestEdge] = useState<ValidEdge | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Store values
  const blockId = useCurrentBlockId();
  const document = useEditorStore(state => state.document);
  const blockData = document[blockId];

  const selectedBlockId = useEditorStore(state => state.selectedBlockId);
  const setSelectedBlockId = useEditorStore(state => state.setSelectedBlockId);
  const isBlockBeingDragged = useEditorStore(state => state.isBlockBeingDragged);
  const selectedScreenSize = useEditorStore(state => state.selectedScreenSize);
  const isMobilePreview = selectedScreenSize === 'mobile';

  const isSelected = selectedBlockId === blockId && !isBlockBeingDragged && !isMobilePreview;
  const hasSelectedBlock = Boolean(selectedBlockId) && !isMobilePreview;

  // Drag and drop setup
  useEffect(() => {
    if (!blockRef.current || !dragHandleRef.current || !blockData) return;

    return combine(
      draggable({
        element: blockRef.current,
        dragHandle: dragHandleRef.current,
        getInitialData: once(() => blockData.type === 'ColumnsContainer' ? {
          id: blockId,
          type: blockData.type,
          childrenIds: blockData.data.childrenIds
        } : {
          id: blockId,
          type: blockData.type
        }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
            render: ({ container }) => {
              setState({ type: 'preview', container });
              return () => setIsDragging(true);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),

      dropTargetForElements({
        element: blockRef.current,
        getIsSticky: () => true,
        canDrop: ({ source, element }) => true,
        getData: ({ element, input }) => {
          if (!blockData) return {};

          // Create base data object
          const baseData = blockData.type === 'ColumnsContainer'
            ? {
              id: blockId,
              type: blockData.type,
              childrenIds: blockData.data.childrenIds
            }
            : {
              id: blockId,
              type: blockData.type
            };

          // Attach closest edge data
          return attachClosestEdge(
            baseData,
            { element, input, allowedEdges: ['top', 'bottom'] }
          );
        },
        onDrag: ({ self, source }) => {
          if (source?.data?.id === blockId) return;

          const edge = extractClosestEdge(self.data);
          if (edge && isValidEdge(edge)) setClosestEdge(edge);
        },
        onDropTargetChange({ source, location }) {
          if (!location?.current?.dropTargets || location.current.dropTargets.length === 0) {
            setState(idle);
            return;
          }

          const dropTarget = location.current.dropTargets[0]?.data;
          if (!dropTarget) {
            setState(idle);
            return;
          }

          const sourceType = source?.data?.type;
          const targetType = dropTarget.type;

          const isSourceColumnsContainer = sourceType === 'ColumnsContainer';
          const isTargetColumnsContainer = targetType === 'ColumnsContainer';
          const isBlockTypeColumnsContainer = blockData.type === 'ColumnsContainer';

          // Only show drop target if:
          // Case 1: Both are ColumnsContainer
          // Case 2: Neither are ColumnsContainer
          if (
            (isSourceColumnsContainer && isTargetColumnsContainer && isBlockTypeColumnsContainer) ||
            (!isSourceColumnsContainer && !isTargetColumnsContainer && !isBlockTypeColumnsContainer)
          ) {
            setState({ type: 'isOver' });
          } else {
            setState(idle);
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
          setState(idle);
        },
        onDrop: () => {
          setClosestEdge(null);
          setState(idle);
        },
      })
    );
  }, [blockId, blockData]);

  const isHighlighted = state.type === 'isOver' && blockData?.type !== 'ColumnsContainer';

  return (
    <BlockContainer
      ref={blockRef}
      isHighlighted={isHighlighted && !isMobilePreview}
      isDragging={isDragging}
      onMouseEnter={() => !isMobilePreview && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(ev) => {
        if (isMobilePreview) return;
        setSelectedBlockId(blockId);
        ev.stopPropagation();
        ev.preventDefault();
      }}
      style={{ cursor: isMobilePreview ? 'default' : undefined }}
    >
      {!isMobilePreview && (
        <BlockBuilderLayer
          blockId={blockId}
          isSelected={isSelected}
          hasSelectedBlock={hasSelectedBlock}
          isHovered={isHovered}
          blockType={blockData?.type}
          ref={dragHandleRef}
        />
      )}
      {state.type === 'isOver' && closestEdge && !isMobilePreview && (
        <DropIndicator edge={closestEdge} />
      )}
      {children}
      {state.type === 'preview' && state.container && !isMobilePreview && createPortal(
        <PreviewContainer>
          <PreviewIcon>
            {BLOCK_DISPLAY_INFO[blockData?.type]?.icon || '◼'}
          </PreviewIcon>
          <PreviewLabel>
            {BLOCK_DISPLAY_INFO[blockData?.type]?.label || blockData?.type || 'Block'}
          </PreviewLabel>
        </PreviewContainer>,
        state.container
      )}
    </BlockContainer>
  );
}
