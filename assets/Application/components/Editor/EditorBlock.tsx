// Editor.tsx
import React, { createContext, useContext } from 'react';
import { EditorBlock as CoreEditorBlock } from './editor-core';
import useEditorStore from '@/Application/store/editorStore';

const EditorBlockContext = createContext<string | null>(null);
export const useCurrentBlockId = () => useContext(EditorBlockContext)!;

type EditorBlockProps = {
  id: string;
};

/**
 *
 * @param id - Block id
 * @returns EditorBlock component that loads data from the editor store
 */
export default function EditorBlock({ id }: EditorBlockProps) {
  const document = useEditorStore((state) => state.document);
  const block = document[id];

  if (!block) {
    console.warn(`Block with id ${id} not found in document`);
    return null;
  }

  return (
    <EditorBlockContext.Provider value={id}>
      <CoreEditorBlock {...block} />
    </EditorBlockContext.Provider>
  );
}