import { describe, expect, test, vi } from 'vitest';

describe('entry points', () => {
  test('the main entry does not need @react-pdf/renderer', async () => {
    // It's an optional peer dependency, so SVG-only users won't have it
    vi.doMock('@react-pdf/renderer', () => {
      throw new Error('@react-pdf/renderer was imported');
    });

    const main = await import('../src/index');

    expect(Object.keys(main).sort()).toEqual([
      'BumpsChart',
      'BumpsChartMultiYear',
    ]);

    vi.doUnmock('@react-pdf/renderer');
  });

  test('the pdf entry exports the PDF charts', async () => {
    const pdf = await import('../src/pdf');
    const svg = await import('../src/index');

    expect(Object.keys(pdf).sort()).toEqual([
      'BumpsChart',
      'BumpsChartMultiYear',
    ]);
    expect(pdf.BumpsChart).not.toBe(svg.BumpsChart);
  });
});
