
export interface LayerProps {
  blockType: string;
  blockId?: string;
  isSelected?: boolean;
  hasSelectedBlock?: boolean;
  isHovered?: boolean;
}

export type BlockType = 'component' | 'row';