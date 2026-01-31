import React from 'react';
import { Box } from '@mui/material';
import { LayerProps } from './types';

const LayerType: React.FC<LayerProps> = ({ hasSelectedBlock, isHovered, blockType }) => {
  const isColumnsContainer = blockType === 'ColumnsContainer';

  return (
    <Box
      sx={{
        visibility: (!hasSelectedBlock && isHovered) ? 'visible' : 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, "Open Sans", sans-serif',
        position: 'absolute',
        bottom: '-22px',
        right: '0px',
        zIndex: 200,
        backgroundColor: isColumnsContainer
          ? 'rgb(123, 82, 174)'
          : 'rgb(72, 170, 245)',
        color: '#fff',
        fontSize: '12px',
        lineHeight: '22px',
        height: '22px',
      }}
    >
      <Box sx={{ padding: '0px 10px' }}>
        {blockType === 'ColumnsContainer'
          ? 'Row'
          : 'Item'
        }
      </Box>
    </Box>
  );
};

export default LayerType;
