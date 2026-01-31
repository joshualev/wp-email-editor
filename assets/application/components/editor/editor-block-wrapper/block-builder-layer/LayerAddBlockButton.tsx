import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Plus } from 'lucide-react';
import { LayerProps } from './types';
import { AddRowBlockMenu, AddComponentBlockMenu } from './add-block-menu/AddBlockMenu';
import { TEditorBlock } from '@/application/components/editor/editor-core';
import useEditorStore from '@/application/store/editorStore';

interface LayerAddBlockButtonProps extends Partial<LayerProps> {
  blockId: string;
  position: 'top' | 'bottom';
  blockType: string;
  isHovered?: boolean;
}

const LayerAddBlockButton: React.FC<LayerAddBlockButtonProps> = ({
  blockId,
  isSelected,
  isHovered,
  position,
  blockType
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const addRow = useEditorStore((state) => state.addRow);
  const addItem = useEditorStore((state) => state.addItem);
  const getParentBlock = useEditorStore((state) => state.getParentBlock);
  const getItemParentColumnsContainerBlockId = useEditorStore((state) => state.getItemParentColumnsContainerBlockId);
  const isColumnsContainer = blockType === 'ColumnsContainer';

  const getButtonColor = () => {
    const selectedPurple = 'rgb(123, 82, 174)';
    const selectedBlue = 'rgb(72, 170, 245)';
    const hoverPurple = 'rgb(229, 202, 255)';
    const hoverBlue = 'rgb(213, 236, 251)';
    if (isSelected) return isColumnsContainer ? selectedPurple : selectedBlue;
    if (isHovered) return isColumnsContainer ? hoverPurple : hoverBlue;
    return 'transparent';
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handler for when a block is selected from either menu
  const handleBlockSelect = (newBlock: TEditorBlock) => {
    if (isColumnsContainer) {
      // Handle row insertion
      const parent = getParentBlock(blockId);
      if (!parent || parent.type !== 'EmailLayout') return;

      const childrenIds = parent.data.childrenIds;
      const currentIndex = childrenIds.indexOf(blockId);
      const insertPosition = position === 'bottom' ? currentIndex + 1 : currentIndex;

      addRow({
        block: newBlock,
        position: insertPosition
      });
    } else {
      // Get the correct columns container ID for the item
      const columnsContainerId = getItemParentColumnsContainerBlockId(blockId);
      if (!columnsContainerId) return;

      const parent = getParentBlock(blockId);
      if (!parent || parent.type !== 'ColumnsContainer') return;

      const columnIndex = parent.data.childrenIds.findIndex(column =>
        column.includes(blockId)
      );

      if (columnIndex === -1) return;

      addItem({
        block: newBlock,
        columnsContainerId,
        columnIndex,
        itemIndex: blockId,
        position
      });
    }
    setAnchorEl(null);
  };

  // Determine which menu to show based on parent block type
  const MenuComponent = blockType === 'ColumnsContainer'
    ? AddRowBlockMenu
    : AddComponentBlockMenu;

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          [position]: '-12px',
          visibility: isSelected ? 'visible' : 'hidden',
          zIndex: 110,
        }}
      >
        <Tooltip
          title={`Add ${isColumnsContainer ? 'Row' : 'Component'} ${position}`}
          placement={position}
        >
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              backgroundColor: getButtonColor(),
              color: '#fff',
              '&:hover': {
                backgroundColor: isColumnsContainer
                  ? 'rgb(123, 82, 174)'  // Dark purple
                  : 'rgb(72, 170, 245)', // Dark blue
              },
              padding: '4px',
              width: '20px',
              height: '20px',
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Render appropriate menu based on block type */}
      <MenuComponent
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        onSelect={handleBlockSelect}
      />
    </>
  );
};

export default LayerAddBlockButton;