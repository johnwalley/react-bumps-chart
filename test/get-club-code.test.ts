import { describe, expect, test } from 'vitest';
import { getClubCode } from '@/utils/get-club-code';

describe('getClubCode', () => {
  test('finds clubs by name', () => {
    expect(getClubCode('May Bumps')('Caius')).toBe('cai');
    expect(getClubCode('Torpids')('Oriel')).toBe('oro');
  });

  test('falls back for names react-rowing-blades does not know', () => {
    expect(getClubCode('May Bumps')('LMBC')).toBe('lmb');
    expect(getClubCode('Town Bumps')('Town')).toBe('cam');
  });

  test('returns undefined for unknown clubs', () => {
    expect(getClubCode('May Bumps')('Nobody')).toBeUndefined();
  });

  test('throws for unknown sets', () => {
    expect(() => getClubCode('Henley')).toThrow('Henley not recognised');
  });
});
