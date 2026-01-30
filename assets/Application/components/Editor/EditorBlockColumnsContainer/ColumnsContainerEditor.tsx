import React from 'react';
import { ColumnsContainerBlock, ColumnsContainerBlockPropsType } from '@/Domain/Blocks/block-columns-container';
import { useCurrentBlockId } from '@/Application/components/Editor/EditorBlock';
import EmptyColumn from './EmptyColumn';
import EditorBlock from '@/Application/components/Editor/EditorBlock';
import useEditorStore from '@/Application/store/editorStore';

type EditorProps = ColumnsContainerBlockPropsType;

export default function ColumnsContainerEditor(props: EditorProps) {
  const currentBlockId = useCurrentBlockId();
  const selectedScreenSize = useEditorStore((state) => state.selectedScreenSize);
  const isMobile = selectedScreenSize === 'mobile';

  const columnContents = props.childrenIds.map((columnIds, index) => {
    if (index >= props.widths.length) return null;

    if (columnIds.length === 0) {
      return (
        <EmptyColumn
          key={`empty-${index}`}
          parentId={currentBlockId}
          columnIndex={index}
        />
      );
    }

    return columnIds.map(childId => (
      <EditorBlock key={childId} id={childId} />
    ));
  });

  return <ColumnsContainerBlock {...props} isMobile={isMobile} children={columnContents} />;
}

