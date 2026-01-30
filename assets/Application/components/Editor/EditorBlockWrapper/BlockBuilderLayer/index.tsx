import React, {forwardRef} from 'react';
import LayerSelector from './LayerSelector';
import LayerType from './LayerType';
import LayerControls from './LayerControls';
import LayerDragHandle from './LayerDragHandle';
import LayerAddBlockButton from './LayerAddBlockButton';
import { LayerProps, BlockType } from './types';

interface BlockBuilderLayerProps extends LayerProps {
  blockId: string;
  hasSelectedBlock: boolean;
}

// Define the type for the forwarded ref
type BlockBuilderLayerRef = HTMLDivElement;

// Forward the ref and correctly type the component
const BlockBuilderLayer = forwardRef<BlockBuilderLayerRef, BlockBuilderLayerProps>(
  (
    {
      blockId,
      isSelected,
      hasSelectedBlock,
      isHovered,
      blockType,
    },
    ref
  ) => {
    return (
      
      <LayerSelector 
        blockType={blockType}
        isSelected={isSelected} 
        isHovered={isHovered} 
      >
        <LayerType
          blockType={blockType}
          hasSelectedBlock={hasSelectedBlock}
          isHovered={isHovered}
        />
        <LayerControls 
          blockId={blockId}
          blockType={blockType}
          isSelected={isSelected}
        />
        <LayerDragHandle
          blockType={blockType}
          isSelected={isSelected}
          ref={ref} // Attach the forwarded ref here
        />
        {/* Only show add buttons if block can contain children */}
        <LayerAddBlockButton  
          blockId={blockId}
          blockType={blockType}
          isSelected={isSelected}
          position="top"
        />
        <LayerAddBlockButton
          blockId={blockId}  
          blockType={blockType}
          isSelected={isSelected}
          position="bottom"
        />
      </LayerSelector>
    );
  }
);

// Optional: Add a display name for easier debugging
BlockBuilderLayer.displayName = 'BlockBuilderLayer';

export default BlockBuilderLayer;
