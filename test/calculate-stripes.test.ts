import { describe, expect, test } from 'vitest';
import { events, formatPoints, sequences } from './fixtures';
import { calculateStripes } from '@/utils/calculate-stripes';

describe('calculateStripes', () => {
  test.each(Object.entries(events))('%s', (_name, event) => {
    expect(
      calculateStripes(event, null, 16, 10, 200, 32).map(formatPoints)
    ).toMatchSnapshot();
  });

  test('extends stripes into the gap before the next event', () => {
    const [event, event2] = sequences.mays2022_2024;
    const stripes = calculateStripes(event, event2, 16, 0, 200, 32);

    expect(stripes[0][1][0]).toBe(232);
  });
});
