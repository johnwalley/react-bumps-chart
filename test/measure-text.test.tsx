import { beforeAll, describe, expect, test } from 'vitest';
import { BumpsChart } from '../src/components/bumps-chart';
import { Font } from '@react-pdf/renderer';
import { estimateTextWidth } from '@/utils/measure-text';
import { events } from './fixtures';
import { layoutChart } from '@/utils/layout-chart';
import { measurePdfText } from '../src/components/pdf/measure-text';
import { renderToStaticMarkup } from 'react-dom/server';

describe('measurePdfText', () => {
  test('measures Helvetica at the chart font size', () => {
    expect(measurePdfText('Lady Margaret')).toBeCloseTo(82.52, 2);
    expect(measurePdfText('')).toBe(0);
  });
});

describe('estimateTextWidth', () => {
  // Every printable ASCII character and the typographic quotes the table
  // lists, then whole crew names
  const characters = [
    ...Array.from({ length: 0x7f - 0x20 }, (_, i) =>
      String.fromCharCode(0x20 + i)
    ),
    ...'‘’“”',
  ];
  const names = Object.values(events).flatMap((event) =>
    event.crews.map((crew) => crew.start)
  );

  beforeAll(() => {
    // Without it, measurePdfText falls back to estimateTextWidth and every
    // comparison below would check the estimate against itself
    expect(Font.getFont({ fontFamily: 'Helvetica' }).data).toBeTruthy();
  });

  test.each(characters)('matches Helvetica for %j', (character) => {
    expect(estimateTextWidth(character)).toBeCloseTo(
      measurePdfText(character),
      6
    );
  });

  test('matches Helvetica for every crew name', () => {
    for (const name of names) {
      expect(estimateTextWidth(name)).toBeCloseTo(measurePdfText(name), 6);
    }
    expect(estimateTextWidth('')).toBe(0);
  });
});

describe('server rendering', () => {
  test('estimates text widths instead of collapsing columns', () => {
    const event = events.mays2023_men;
    const markup = renderToStaticMarkup(<BumpsChart data={event} />);
    const { width, height } = layoutChart(event, {
      measureText: estimateTextWidth,
    });

    expect(markup).toContain(`viewBox="0 0 ${width} ${height}"`);
    expect(width).toBeGreaterThan(event.days * 16 + 2 * 100);
  });
});
