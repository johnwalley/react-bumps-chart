import { describe, expect, test } from 'vitest';
import { calculateNumbers } from '@/utils/calculate-numbers';
import { events } from './fixtures';

describe('calculateNumbers', () => {
  test.each(Object.entries(events))('%s', (_name, event) => {
    expect({
      overall: calculateNumbers(event).join(' '),
      byDivision: calculateNumbers(event, true).join(' '),
    }).toMatchSnapshot();
  });

  test('restarts numbering at each division when reset', () => {
    const event = events.mays2023_men;
    const numbers = calculateNumbers(event, true);
    const [firstDivision] = event.div_size[0];

    expect(numbers[firstDivision - 1]).toBe(`${firstDivision}`);
    expect(numbers[firstDivision]).toBe('1');
  });
});
