import { describe, expect, test } from 'vitest';
import { ChartLayout, layoutChart } from '@/utils/layout-chart';
import { estimateTextWidth } from '@/utils/measure-text';
import { events } from './fixtures';
import { measurePdfText } from '../src/components/pdf/measure-text';

// Where each column sits; the shapes inside are covered by the util snapshots
function columns(layout: ChartLayout) {
  return {
    width: layout.width,
    height: layout.height,
    startNumbers: layout.startNumbers.x,
    startBlades: layout.startBlades?.x,
    startCrews: layout.startCrews.x,
    division: layout.division.x,
    endCrews: layout.endCrews.x,
    endBlades: layout.endBlades?.x,
    endNumbers: layout.endNumbers.x,
  };
}

describe('layoutChart', () => {
  test.each(Object.entries(events))('%s', (_name, event) => {
    expect({
      svg: columns(layoutChart(event, { measureText: estimateTextWidth })),
      pdf: columns(
        layoutChart(event, { measureText: measurePdfText, bladeIcons: false })
      ),
    }).toMatchSnapshot();
  });

  test('looks up blades for each crew', () => {
    const layout = layoutChart(events.mays2023_men, {
      measureText: estimateTextWidth,
    });

    expect(layout.startBlades?.clubs.slice(0, 3)).toEqual([
      'cai',
      'lmb',
      'mgd',
    ]);
  });

  test('leaves out end blades until there are results', () => {
    const layout = layoutChart(events.town2024_women, {
      measureText: estimateTextWidth,
    });

    expect(layout.startBlades).not.toBeNull();
    expect(layout.endBlades).toBeNull();
  });

  test('reserves no space for blades without blade icons', () => {
    const options = { measureText: estimateTextWidth };
    const withIcons = layoutChart(events.mays2023_men, options);
    const without = layoutChart(events.mays2023_men, {
      ...options,
      bladeIcons: false,
    });

    expect(without.startBlades).toBeNull();
    expect(without.endBlades).toBeNull();
    expect(withIcons.width - without.width).toBeCloseTo(64);
  });

  test('places finishing crews by how far they moved', () => {
    const event = events.mays2023_men;
    const layout = layoutChart(event, { measureText: estimateTextWidth });

    event.crews.forEach((crew, index) => {
      expect(layout.endCrews.crews[index].y).toBe(index - (crew.gain ?? 0));
    });
  });

  test('marks blades only when asked to', () => {
    const event = events.mays2023_men;
    const measureText = estimateTextWidth;

    expect(
      layoutChart(event, { measureText }).startCrews.crews.some(
        (crew) => crew.blades
      )
    ).toBe(false);
    expect(
      layoutChart(event, { measureText, blades: true }).startCrews.crews.some(
        (crew) => crew.blades
      )
    ).toBe(true);
  });
});
