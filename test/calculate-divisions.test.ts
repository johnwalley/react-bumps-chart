import { describe, expect, test } from 'vitest';
import { events, formatPoints } from './fixtures';
import { calculateDivisions } from '@/utils/calculate-divisions';

describe('calculateDivisions', () => {
  test.each(Object.entries(events))('%s', (_name, event) => {
    const division = calculateDivisions(event, 16, 100, 120, true);

    expect({
      ...division,
      polylines: division.polylines.map((line) => ({
        ...line,
        points: formatPoints(line.points),
      })),
      circles: formatPoints(division.circles),
      rect: formatPoints(division.rect),
      skipped: division.skipped.map(formatPoints),
      divisionLines: division.divisionLines.map(formatPoints),
    }).toMatchSnapshot();
  });

  test('only highlights blades when asked to', () => {
    const division = calculateDivisions(events.mays2023_men, 16, 0, 0, false);

    expect(division.polylines.some((line) => line.blades)).toBe(false);
  });
});
