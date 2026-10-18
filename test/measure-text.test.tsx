import { describe, expect, test } from 'vitest';
import { BumpsChart } from '../src/components/bumps-chart';
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
