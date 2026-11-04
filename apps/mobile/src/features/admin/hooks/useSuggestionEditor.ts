import { useState } from 'react';
import { useUpdateSuggestionFields } from '../../../api/hooks';
import type { BrandSuggestionDto } from '../../../api/types';
import { toSuggestionDraft, toSuggestionFields, type SuggestionDraft } from '../suggestion-draft';

const EMPTY_DRAFT: SuggestionDraft = { brandName: '', productName: '', barcode: '', notes: '' };

export interface SuggestionEditor {
  isOpen: boolean;
  draft: SuggestionDraft;
  isSaving: boolean;
  startEdit: (item: BrandSuggestionDto) => void;
  changeDraft: (field: keyof SuggestionDraft, value: string) => void;
  cancelEdit: () => void;
  saveEdit: () => void;
}

/**
 * Holds the suggestion being edited and its draft fields, and saves them.
 * The sheet closes only once the save succeeds.
 */
export function useSuggestionEditor(): SuggestionEditor {
  const [editItem, setEditItem] = useState<BrandSuggestionDto | null>(null);
  const [draft, setDraft] = useState<SuggestionDraft>(EMPTY_DRAFT);
  const fieldsMutation = useUpdateSuggestionFields();

  function startEdit(item: BrandSuggestionDto) {
    setEditItem(item);
    setDraft(toSuggestionDraft(item));
  }

  function saveEdit() {
    if (!editItem) return;
    fieldsMutation.mutate(
      { id: editItem.id, fields: toSuggestionFields({ draft, item: editItem }) },
      { onSuccess: () => setEditItem(null) }
    );
  }

  return {
    isOpen: editItem !== null,
    draft,
    isSaving: fieldsMutation.isPending,
    startEdit,
    changeDraft: (field, value) => setDraft((current) => ({ ...current, [field]: value })),
    cancelEdit: () => setEditItem(null),
    saveEdit,
  };
}
