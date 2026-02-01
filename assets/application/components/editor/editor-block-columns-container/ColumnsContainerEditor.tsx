import React from 'react';
import { ColumnsContainerBlock } from '@/application/components/blocks';
import { ColumnsContainerBlockPropsType } from '@/domain/blocks/block-columns-container';
import { useCurrentBlockId } from '@/application/components/editor/EditorBlock';
import EmptyColumn from './EmptyColumn';
import EditorBlock from '@/application/components/editor/EditorBlock';
import useEditorStore from '@/application/store/editorStore';

type EditorProps = ColumnsContainerBlockPropsType;

export default function ColumnsContainerEditor(props: EditorProps) {
  const currentBlockId = useCurrentBlockId();
  const selectedScreenSize = useEditorStore((state) => state.selectedScreenSize);
  const isMobile = selectedScreenSize === 'mobile';

  const document = useEditorStore((state) => state.document);
  const rootBlock = document['root'];
  const canvasColor = rootBlock?.type === 'EmailLayout'
    ? (rootBlock.data as any).canvasColor
    : undefined;

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

  return <ColumnsContainerBlock {...props} isMobile={isMobile} defaultBackgroundColor={canvasColor} children={columnContents} />;
}
