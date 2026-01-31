import React from 'react';
import styled from '@emotion/styled';
import useEditorStore from '@/application/store/editorStore';
import { useCurrentBlockId } from '@/application/components/editor/EditorBlock';

interface Props {
  children: React.ReactNode;
}

const BlockContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  cursor: pointer;
  outline: ${({ isSelected }) => isSelected ? '2px solid rgb(37, 99, 235)' : 'none'};
  outline-offset: -2px;
`;

/**
 * A wrapper for HubSpot Header/Footer blocks that allows selection but prevents
 * dragging, deletion, and reordering. These blocks are always first/last in root.
 */
export default function HubSpotBlockWrapper({ children }: Props) {
  const blockId = useCurrentBlockId();
  const selectedBlockId = useEditorStore(state => state.selectedBlockId);
  const setSelectedBlockId = useEditorStore(state => state.setSelectedBlockId);
  const isBlockBeingDragged = useEditorStore(state => state.isBlockBeingDragged);
  const selectedScreenSize = useEditorStore(state => state.selectedScreenSize);
  const isMobilePreview = selectedScreenSize === 'mobile';

  const isSelected = selectedBlockId === blockId && !isBlockBeingDragged && !isMobilePreview;

  const handleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (!isMobilePreview) {
      setSelectedBlockId(blockId);
    }
  };

  return (
    <BlockContainer 
      isSelected={isSelected}
      onClick={handleClick}
    >
      {children}
    </BlockContainer>
  );
}
