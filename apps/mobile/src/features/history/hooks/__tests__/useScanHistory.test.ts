import { buildUpdatedHistory, MAX_ENTRIES } from '../../history-utils';
import type { ScanHistoryEntry } from '../../types';

const makeEntry = (barcode: string, scannedAt?: string): ScanHistoryEntry => ({
  barcode,
  productName: `Product ${barcode}`,
  brandName: 'TestBrand',
  companyName: 'TestCo',
  companySiren: '123456789',
  productSource: 'OFF',
  scannedAt: scannedAt ?? '2026-01-01T00:00:00.000Z',
});

describe('buildUpdatedHistory', () => {
  it('inserts a new entry at the top of an empty list', () => {
    const result = buildUpdatedHistory([], makeEntry('111'));
    expect(result).toHaveLength(1);
    expect(result[0].barcode).toBe('111');
  });

  it('inserts a new entry at the top of a non-empty list', () => {
    const prev = [makeEntry('aaa'), makeEntry('bbb')];
    const result = buildUpdatedHistory(prev, makeEntry('zzz'));
    expect(result[0].barcode).toBe('zzz');
    expect(result).toHaveLength(3);
  });

  it('deduplicates: replaces existing entry with same barcode and moves it to top', () => {
    const prev = [makeEntry('aaa'), makeEntry('dup', '2026-01-01T00:00:00.000Z'), makeEntry('bbb')];
    const updated = makeEntry('dup', '2026-05-30T12:00:00.000Z');

    const result = buildUpdatedHistory(prev, updated);

    expect(result).toHaveLength(3);
    expect(result[0].barcode).toBe('dup');
    expect(result[0].scannedAt).toBe('2026-05-30T12:00:00.000Z');
    expect(result.filter((e) => e.barcode === 'dup')).toHaveLength(1);
  });

  it('keeps only MAX_ENTRIES (50) entries — discards the oldest', () => {
    const prev = Array.from({ length: MAX_ENTRIES }, (_, i) => makeEntry(`old-${i}`));
    const result = buildUpdatedHistory(prev, makeEntry('new'));

    expect(result).toHaveLength(MAX_ENTRIES);
    expect(result[0].barcode).toBe('new');
    expect(result.find((e) => e.barcode === `old-${MAX_ENTRIES - 1}`)).toBeUndefined();
  });

  it('does not exceed MAX_ENTRIES after multiple insertions', () => {
    let history: ScanHistoryEntry[] = [];
    for (let i = 0; i < MAX_ENTRIES + 10; i++) {
      history = buildUpdatedHistory(history, makeEntry(`entry-${i}`));
    }
    expect(history).toHaveLength(MAX_ENTRIES);
  });

  it('preserves original list when deduplicating (no mutation)', () => {
    const prev = [makeEntry('aaa'), makeEntry('bbb')];
    const prevCopy = [...prev];
    buildUpdatedHistory(prev, makeEntry('aaa'));
    expect(prev).toEqual(prevCopy);
  });
});
