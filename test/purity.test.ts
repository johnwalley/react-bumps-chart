import { deepFreeze, maysFull } from './fixtures';
import { describe, expect, test } from 'vitest';
import { calculateDivisions } from '@/utils/calculate-divisions';
import { calculateExtraText } from '@/utils/calculate-extra-text';
import { calculateJoin, markJointYearHeadship } from '@/utils/calculate-join';
import { calculateNumbers } from '@/utils/calculate-numbers';
import { calculateStripes } from '@/utils/calculate-stripes';

// Every men's May Bumps since 1827, frozen so any mutation throws
const history = deepFreeze(structuredClone(maysFull));

describe('layout utils', () => {
  test('do not mutate their inputs across the full May Bumps history', () => {
    expect(() => {
      history.forEach((event, i) => {
        const event2 = history[i + 1] ?? null;

        calculateDivisions(event, 16, 100, 100, true);
        calculateExtraText(event, 16);
        calculateNumbers(event, true);
        calculateStripes(event, event2, 16, 0, 200, 32);

        if (event2) {
          calculateJoin(event, event2, 0, 16, 32);
          markJointYearHeadship(event, event2);
        }
      });
    }).not.toThrow();
  });
});
