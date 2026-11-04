import type { BrandSuggestionDto } from '../../../api/types';
import { toSuggestionDraft, toSuggestionFields } from '../suggestion-draft';

const makeItem = (overrides: Partial<BrandSuggestionDto> = {}): BrandSuggestionDto => ({
  id: 7,
  brandName: 'Original Brand',
  status: 'new',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('toSuggestionDraft', () => {
  it('copies every editable field of the suggestion', () => {
    const item = makeItem({ productName: 'Prod', barcode: '123', notes: 'Note' });
    expect(toSuggestionDraft(item)).toEqual({
      brandName: 'Original Brand',
      productName: 'Prod',
      barcode: '123',
      notes: 'Note',
    });
  });

  it('turns missing optional fields into empty strings', () => {
    expect(toSuggestionDraft(makeItem())).toEqual({
      brandName: 'Original Brand',
      productName: '',
      barcode: '',
      notes: '',
    });
  });
});

describe('toSuggestionFields', () => {
  const draft = { brandName: 'New Brand', productName: ' P ', barcode: ' 1 ', notes: ' N ' };

  it('sends the draft as is, the brand trimmed and the other fields untrimmed', () => {
    const fields = toSuggestionFields({
      draft: { ...draft, brandName: '  New Brand  ' },
      item: makeItem(),
    });
    expect(fields).toEqual({
      brandName: 'New Brand',
      productName: ' P ',
      barcode: ' 1 ',
      notes: ' N ',
    });
  });

  it('falls back to the original brand when the draft brand is blank', () => {
    const fields = toSuggestionFields({ draft: { ...draft, brandName: '   ' }, item: makeItem() });
    expect(fields.brandName).toBe('Original Brand');
  });
});
