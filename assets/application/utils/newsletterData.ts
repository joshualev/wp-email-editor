import type { TEditorConfiguration } from '@/application/components/editor/editor-core';
import { EditorConfigurationSchema } from '@/application/components/editor/editor-core';

export type NewsletterLoadStatus = 'configured' | 'unconfigured' | 'empty' | 'invalid';

type NewsletterErrorResponse = {
  error?: string;
  tableId?: string;
};

const isErrorResponse = (data: unknown): data is NewsletterErrorResponse => {
  return Boolean(
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as NewsletterErrorResponse).error === 'string'
  );
};

const isEmptyObject = (data: unknown): data is Record<string, never> => {
  return Boolean(data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0);
};

export const normalizeNewsletterData = (
  data: unknown,
  fallback: TEditorConfiguration
): { document: TEditorConfiguration; status: NewsletterLoadStatus } => {
  if (!data) {
    return { document: fallback, status: 'empty' };
  }

  if (isErrorResponse(data)) {
    return { document: fallback, status: 'unconfigured' };
  }

  if (Array.isArray(data) && data.length === 0) {
    return { document: fallback, status: 'empty' };
  }

  if (isEmptyObject(data)) {
    return { document: fallback, status: 'empty' };
  }

  const parseResult = EditorConfigurationSchema.safeParse(data);
  if (parseResult.success) {
    return { document: parseResult.data, status: 'configured' };
  }

  return { document: fallback, status: 'invalid' };
};
