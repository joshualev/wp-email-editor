import React, { forwardRef } from 'react';
import { Box } from '@mui/material';
import { LayerProps } from './types';
import { Move } from 'lucide-react';


// Use forwardRef to accept the ref and pass it to the Box component
const LayerDragHandle = forwardRef<HTMLDivElement, LayerProps>(
  ({ blockType, isSelected }, ref) => {
    const styles = {
      component: {
        right: '-17px',
        height: '30px',
        width: '30px',
        borderRadius: '100%',
        marginTop: '-15px',
        fontSize: 16,
      },
      row: {
        right: '0px',
        height: '40px',
        width: '40px',
        borderRadius: '100% 0 0 100%',
        marginTop: '-20px',
        fontSize: '20px',
      },
    };


    const isColumnsContainer = blockType === 'ColumnsContainer';
    const moveIconSize = isColumnsContainer ? 26 : 20
    const variant = isColumnsContainer ? 'row' : 'component'

    const getBackgroundColor = () => {
      // Selected colors (darker)
      const selectedPurple = 'rgb(123, 82, 174)';
      const selectedBlue = 'rgb(72, 170, 245)';

      if (isSelected) return isColumnsContainer ? selectedPurple : selectedBlue
      return 'transparent';
    };

    return (
      <Box
        ref={ref} // Drag handle forwarded ref
        sx={{
          visibility: (isSelected) ? 'visible' : 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          backgroundColor: getBackgroundColor(),
          color: '#fff',
          zIndex: 111,
          cursor: 'grab',
          lineHeight: '31px',
          ...styles[variant],
        }}
      >
        <Move size={moveIconSize} />
      </Box>
    );
  }
);

export default LayerDragHandle;
