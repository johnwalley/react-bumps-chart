import { Event } from '../src/types';
import eights1838_men from '../stories/eights1838_men.json';
import mays1845_1_men from '../stories/mays1845.1_men.json';
import mays1845_2_men from '../stories/mays1845.2_men.json';
import mays1846_1_men from '../stories/mays1846.1_men.json';
import mays1846_2_men from '../stories/mays1846.2_men.json';
import mays2022_men from '../stories/mays2022_men.json';
import mays2023_men from '../stories/mays2023_men.json';
import mays2023_men_incomplete from '../stories/mays2023_men_incomplete.json';
import mays2024_men from '../stories/mays2024_men.json';
import mays_full from '../stories/mays_full.json';
import torpids1858_men from '../stories/torpids1858_men.json';
import torpids1975_men from '../stories/torpids1975_men.json';
import town2024_women from '../stories/town2024_women.json';

/** Single events, keyed by name, used for snapshot tests. */
export const events: Record<string, Event> = {
  eights1838_men,
  mays1845_1_men,
  mays1845_2_men,
  mays1846_1_men,
  mays1846_2_men,
  mays2022_men,
  mays2023_men,
  mays2023_men_incomplete,
  mays2024_men,
  torpids1858_men,
  torpids1975_men,
  town2024_women,
};

/** Consecutive events as passed to `BumpsChartMultiYear`. */
export const sequences: Record<string, Event[]> = {
  mays2022_2024: [mays2022_men, mays2023_men, mays2024_men],
  mays1845_1846: [
    mays1845_1_men,
    mays1845_2_men,
    mays1846_1_men,
    mays1846_2_men,
  ],
};

/** Every men's May Bumps from 1827, too large to snapshot. */
export const maysFull: Event[] = mays_full;

/** Recursively freezes `value` so any attempt to mutate it throws. */
export function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }

  return value;
}

/** Formats points the way they're written to an SVG `points` attribute. */
export function formatPoints(points: number[][]) {
  return points.map((point) => point.join(',')).join(' ');
}
