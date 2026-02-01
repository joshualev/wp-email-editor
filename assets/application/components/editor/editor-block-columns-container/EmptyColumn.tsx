import React, { useState, useRef, useEffect } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { TEditorBlock } from '@/application/components/editor/EditorRegistry';
import useEditorStore from '@/application/store/editorStore';

import { AddComponentBlockMenu } from '@/application/components/editor/editor-block-wrapper/block-builder-layer/add-block-menu/AddBlockMenu';

import { Box, Typography } from '@mui/material';


type EmptyColumnProps = {
  parentId: string;
  columnIndex?: number;
};

export default function EmptyColumn({ parentId, columnIndex }: EmptyColumnProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clickAreaRef = useRef<HTMLDivElement>(null);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const addItem = useEditorStore((state) => state.addItem);
  const isMobileView = useEditorStore((state) => state.selectedScreenSize === 'mobile');

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(clickAreaRef.current);
  };

  const handleBlockSelect = (block: TEditorBlock) => {
    addItem({
      block,
      columnsContainerId: parentId,
      columnIndex: columnIndex ?? 0,
    });
    setMenuAnchorEl(null);
  };

  useEffect(() => {
    if (containerRef.current) {
      return dropTargetForElements({
        element: containerRef.current,
        getIsSticky: () => false,
        canDrop: ({ source }) => {
          if (source.data.type !== 'ColumnsContainer') {
            setIsDropTarget(true);
            return true;
          }
          return false;
        },
        getData: () => {
          return { id: parentId, columnIndex, index: 0, type: 'Column' };
        },
        onDragLeave: () => {
          setIsDropTarget(false);
        },
        onDrop: () => {
          setIsDropTarget(false);
        },
      });
    }
  }, [parentId, columnIndex]);

  return (
    <>
      <Box
        data-block-id={parentId}
        data-column-index={columnIndex}
        data-block-type="column"
        ref={containerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80px',
          height: '100%',
          width: '100%',
          position: 'relative',
          zIndex: 100,
          border: '1px dashed',
          borderColor: isDropTarget
            ? 'rgba(37, 99, 235, 0.3)'
            : 'rgba(0, 0, 0, 0.08)',
          borderRadius: 0,
          backgroundColor: isDropTarget
            ? 'rgba(37, 99, 235, 0.04)'
            : 'transparent',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {!isMobileView && (
          <Box
            ref={clickAreaRef}
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 8px',
              margin: '0 8px', // Add margin instead of container padding
              minWidth: 'auto',
              maxWidth: 'calc(100% - 16px)', // Account for margins
              borderRadius: '6px',
              backgroundColor: isDropTarget
                ? 'rgba(37, 99, 235, 0.08)'
                : 'rgba(0, 0, 0, 0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: isDropTarget
                  ? 'rgba(37, 99, 235, 0.12)'
                  : 'rgba(0, 0, 0, 0.06)'
              }
            }}
          >
            <Typography
              variant="caption"
              sx={{
                textAlign: 'center',
                color: isDropTarget
                  ? 'rgba(37, 99, 235, 0.9)'
                  : 'rgba(0, 0, 0, 0.5)',
                fontSize: '0.8125rem',
                fontWeight: isDropTarget ? 500 : 400,
                userSelect: 'none',
                transition: 'all 0.2s ease-in-out',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isDropTarget ? "Drop here" : "Add component"}
            </Typography>
          </Box>
        )}
      </Box>

      {!isMobileView && (
        <AddComponentBlockMenu
          anchorEl={menuAnchorEl}
          setAnchorEl={setMenuAnchorEl}
          onSelect={handleBlockSelect}
        />
      )}
    </>
  );
}
