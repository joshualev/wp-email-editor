import React from 'react';

import { TEditorBlock, TEditorConfiguration } from '@/Application/components/Editor/editor-core';
import useEditorStore from '@/Application/store/editorStore';

export default function JsonPanel(){
  const document = useEditorStore((state) => state.document);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);

  const code: TEditorBlock | TEditorConfiguration = selectedBlockId
    ? document[selectedBlockId]
    : document;

  const jsonData = React.useMemo(() => {
    try {
      return JSON.stringify(code, null, 2);
    } catch (error) {
      console.warn('Failed to process data:', error);
      return null;
    }
  }, [code]);

  if (jsonData === null) {
    return null;
  }

  return (
    <div style={{ margin: 0, padding: '12px' }}>
      <pre
        style={{
          fontSize: '0.75em',
          margin: 0,
          padding: '12px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          color: '#333',
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          lineHeight: '1.5',
          overflowY: 'auto',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        {jsonData}
      </pre>
    </div>
  );
}