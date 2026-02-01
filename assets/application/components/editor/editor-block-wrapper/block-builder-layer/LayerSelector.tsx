import React from 'react';
import { Box } from '@mui/material';
import { LayerProps } from './types';

interface LayerSelectorProps extends LayerProps {
  children: React.ReactNode;
}

const LayerSelector: React.FC<LayerSelectorProps> = ({
  children,
  isSelected,
  isHovered,
  blockType,
}) => {
  const isColumnsContainer = blockType === 'ColumnsContainer';

  const getOutlineColor = () => {
    // Selected colors (darker)
    const selectedPurple = 'rgb(123, 82, 174)';
    const selectedBlue = 'rgb(72, 170, 245)';
    // Hover colors (lighter)
    const hoverPurple = 'rgb(229, 202, 255)';
    const hoverBlue = 'rgb(213, 236, 251)';

    if (isSelected) {
      return isColumnsContainer ? selectedPurple : selectedBlue;
    }

    if (isHovered) {
      return isColumnsContainer ? hoverPurple : hoverBlue;
    }

    return 'transparent';
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        '&::after': {
          content: '""',
          opacity: 1,
          zIndex: 100,
          position: 'absolute',
          inset: '1px',
          outline: '2px solid',
          outlineOffset: '-1px',
          outlineColor: getOutlineColor(),
        },
      }}
    >
      {children}
    </Box>
  );
};

export default LayerSelector;
