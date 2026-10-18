import { describe, expect, test } from 'vitest';
import { calculateJoin, markJointYearHeadship } from '@/utils/calculate-join';
import { deepFreeze, formatPoints, sequences } from './fixtures';

const pairs = Object.values(sequences).flatMap((sequence) =>
  sequence.slice(1).map((event2, i) => ({
    name: `${sequence[i].year} -> ${event2.year}`,
    event: sequence[i],
    event2,
  }))
);

describe('calculateJoin', () => {
  test.each(pairs)('$name', ({ event, event2 }) => {
    const join = calculateJoin(event, event2, 0, 16, 32);

    expect({
      ...join,
      lines: join.lines.map(formatPoints),
      polylines: join.polylines.map(formatPoints),
      text: join.text.map(({ label, pos }) => `${label} @ ${pos.join(',')}`),
    }).toMatchSnapshot();
  });
});

describe('markJointYearHeadship', () => {
  const [february, aprilMay] = sequences.mays1845_1846;

  test('awards blades to the crew that finishes head of the second event', () => {
    const marked = markJointYearHeadship(february, aprilMay);
    const head = aprilMay.crews[0].end;

    marked.crews.forEach((crew, i) => {
      expect(crew).toEqual(
        crew.start === head
          ? { ...february.crews[i], blades: true }
          : february.crews[i]
      );
    });
    expect(marked.crews.find((crew) => crew.start === head)?.blades).toBe(true);
  });

  test('does not mutate its inputs', () => {
    const event = deepFreeze(structuredClone(february));
    const event2 = deepFreeze(structuredClone(aprilMay));

    expect(() => markJointYearHeadship(event, event2)).not.toThrow();
  });

  test('returns the event unchanged when the head crew is not found', () => {
    const event2 = {
      ...aprilMay,
      crews: [{ ...aprilMay.crews[0], end: 'Nobody' }],
    };

    expect(markJointYearHeadship(february, event2)).toBe(february);
  });
});
