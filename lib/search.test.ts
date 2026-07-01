import { describe, it, expect } from 'vitest';
import { normalize, buildPopularChips, detectPruYear } from './search';

describe('normalize', () => {
  it('collapses PRU variants to one key', () => {
    expect(normalize('PRU-15')).toBe('pru 15');
    expect(normalize('PRU Ke-15')).toBe('pru 15');
    expect(normalize('pru 15')).toBe('pru 15');
  });

  it('strips punctuation and collapses whitespace', () => {
    expect(normalize('  Keputusan   PRU!! ')).toBe('keputusan pru');
  });

  it('returns empty string for punctuation-only input', () => {
    expect(normalize('  --- ')).toBe('');
  });

  it('does not mangle words that merely contain "ke" + digit', () => {
    expect(normalize('cake7')).toBe('cake7');
    expect(normalize('like 2')).toBe('like 2');
  });
});

describe('buildPopularChips', () => {
  const fallback = ['Keputusan PRU', 'Kadar keluar mengundi', 'Pemerhati Pilihan Raya'];

  it('returns the full fallback when backend is empty', () => {
    expect(buildPopularChips([], fallback, 3)).toEqual(fallback);
  });

  it('puts backend first then tops up from fallback, deduped by normalized key', () => {
    expect(buildPopularChips(['keputusan pru'], fallback, 3)).toEqual([
      'keputusan pru',
      'Kadar keluar mengundi',
      'Pemerhati Pilihan Raya',
    ]);
  });

  it('caps the result at the limit', () => {
    expect(buildPopularChips(['a', 'b', 'c', 'd'], fallback, 3)).toEqual(['a', 'b', 'c']);
  });

  it('dedupes duplicates within backend itself', () => {
    expect(buildPopularChips(['PRU-15', 'pru ke-15'], [], 3)).toEqual(['PRU-15']);
  });

  it('dedupes backend against fallback case/format-insensitively', () => {
    expect(buildPopularChips(['PRU 15'], ['pru-15', 'Pemerhati Pilihan Raya'], 3))
      .toEqual(['PRU 15', 'Pemerhati Pilihan Raya']);
  });

  it('uses a default limit of 3 when omitted', () => {
    expect(buildPopularChips(['a', 'b', 'c', 'd'], [])).toEqual(['a', 'b', 'c']);
  });
});

describe('detectPruYear', () => {
  it('maps a PRU number to its election year across formats', () => {
    expect(detectPruYear('pru 14')).toBe('2018');
    expect(detectPruYear('keputusan pru 15')).toBe('2022');
    expect(detectPruYear('PRU-13')).toBe('2013');
    expect(detectPruYear('pru ke-12')).toBe('2008');
    expect(detectPruYear('pru14')).toBe('2018');
  });

  it('accepts an explicit known election year', () => {
    expect(detectPruYear('keputusan 2018')).toBe('2018');
  });

  it('returns null when there is no PRU number or known year', () => {
    expect(detectPruYear('pru')).toBeNull();
    expect(detectPruYear('prk')).toBeNull();
    expect(detectPruYear('pru 99')).toBeNull();
    expect(detectPruYear('2019')).toBeNull();
  });
});
