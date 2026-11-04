import type { BrandSuggestionDto, UpdateSuggestionFieldsDto } from '../../api/types';

/** The editable fields of a suggestion, as the edit sheet holds them. */
export interface SuggestionDraft {
  brandName: string;
  productName: string;
  barcode: string;
  notes: string;
}

/** Fills the edit draft from a suggestion; missing fields become empty strings. */
export function toSuggestionDraft(item: BrandSuggestionDto): SuggestionDraft {
  return {
    brandName: item.brandName,
    productName: item.productName ?? '',
    barcode: item.barcode ?? '',
    notes: item.notes ?? '',
  };
}

/** Builds the update payload; a blank brand keeps the suggestion's brand. */
export function toSuggestionFields({
  draft,
  item,
}: {
  draft: SuggestionDraft;
  item: BrandSuggestionDto;
}): UpdateSuggestionFieldsDto {
  return {
    brandName: draft.brandName.trim() || item.brandName,
    productName: draft.productName,
    barcode: draft.barcode,
    notes: draft.notes,
  };
}
