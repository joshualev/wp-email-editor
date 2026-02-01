import React, {useRef, Fragment} from 'react';

import { useCurrentBlockId } from '@/application/components/editor/EditorBlock';
import useEditorStore from '@/application/store/editorStore';

import { getFontFamily } from '@/domain/blocks/helpers/utils'
import EmptyLayout from './EmptyLayout';
import EditorBlock from '@/application/components/editor/EditorBlock';
import { EmailLayoutBlockPropsType } from '@/domain/blocks'

export default function EmailLayoutEditor(props: EmailLayoutBlockPropsType) {
  const ref = useRef<HTMLDivElement | null>(null);
  const currentBlockId = useCurrentBlockId();
  const setSelectedBlockId = useEditorStore((state) => state.setSelectedBlockId);

  // Initialize childrenIds as an empty array if null or undefined
  const childrenIds = props.childrenIds ?? [];

  return (
    <>
      <div
        onClick={(ev: React.MouseEvent) => {
          setSelectedBlockId(null);
          ev.stopPropagation();
          ev.preventDefault();
        }}
        style={{
          backgroundColor: props.backdropColor ?? 'transparent',
          color: props.textColor ?? '#262626',
          fontFamily: getFontFamily(props.fontFamily),
          fontSize: '16px',
          fontWeight: '400',
          letterSpacing: '0.15008px',
          lineHeight: '1.5',
          margin: '0',
          width: '100%',
        }}
      >
        <EditorBlock id="hubspot-header" />

        {(!childrenIds || childrenIds.length === 0) ? (
          <EmptyLayout rootId={currentBlockId} />
        ) : (
          <table
            align="center"
            width="100%"
            style={{ margin: '0 auto' }}
            role="presentation"
            cellSpacing="0"
            cellPadding="0"
            border={0}
          >
            <tbody>
              <tr style={{ width: '100%' }}>
                <td>
                  <div ref={ref}>
                    {childrenIds.map((rowId: string) => (
                      <Fragment key={rowId}>
                        <EditorBlock id={rowId} />
                      </Fragment>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <EditorBlock id="hubspot-footer" />
      </div>
    </>
  );
}

