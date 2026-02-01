import React from 'react';
import { Paper, Box, IconButton, Tooltip } from '@mui/material';
import { ContentCopyOutlined, DeleteOutlined } from '@mui/icons-material';
import { LayerProps } from './types';
import useEditorStore from '@/application/store/editorStore';

const LayerControls: React.FC<LayerProps> = ({ isSelected, blockId, blockType }) => {
  const deleteBlock = useEditorStore((state) => state.deleteBlock);
  const cloneItem = useEditorStore((state) => state.cloneItem);
  const cloneRow = useEditorStore((state) => state.cloneRow);

  if (!blockId) return;

  const handleClickDelete = (ev: React.MouseEvent) => {
    deleteBlock(blockId);
    ev.stopPropagation();
    ev.preventDefault();
  };

  const handleClickClone = (ev: React.MouseEvent) => {
    if (blockType === 'ColumnsContainer') {
      cloneRow(blockId);
    } else {
      cloneItem(blockId);
    }
    ev.stopPropagation();
    ev.preventDefault();
  };

  return (
    <Paper>
      <Box
        sx={{
          visibility: isSelected ? 'visible' : 'hidden',
          position: 'absolute',
          display: 'inline-block',
          textAlign: 'right',
          border: '1px solid #dedede',
          padding: '1px',
          right: 0,
          bottom: '-50px',
          borderRadius: '2px',
          boxShadow: '0px 4px 11px rgba(0, 0, 0, .08)',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          zIndex: 112,
        }}
      >
        <Tooltip title="Clone" placement="bottom-start">
          <IconButton
            sx={{ color: 'text.primary' }}
            onClick={handleClickClone}
          >
            <ContentCopyOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" placement="bottom-start">
          <IconButton
            sx={{ color: 'text.primary' }}
            onClick={handleClickDelete}
          >
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default LayerControls;
