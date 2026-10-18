// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { createRoot, Root } from 'react-dom/client';
import { BumpsChart } from '../src/components/bumps-chart';
import { BumpsChartMultiYear } from '../src/components/bumps-chart-multi-year';
import { events } from './fixtures';
import { layoutChart } from '@/utils/layout-chart';
import { layoutChartMultiYear } from '@/utils/layout-chart-multi-year';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom can't measure text, so the DOM measures every string as this wide,
// and records the font it was asked to measure in
const DOM_WIDTH = 100;
const measuredFonts: string[] = [];
const domMeasure = () => DOM_WIDTH;

const supplied = (text: string) => text.length * 5;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  measuredFonts.length = 0;
  Object.defineProperty(SVGElement.prototype, 'getComputedTextLength', {
    configurable: true,
    value(this: SVGTextElement) {
      measuredFonts.push(this.style.fontFamily);
      return DOM_WIDTH;
    },
  });

  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.getElementById('__react_svg_text_measurement_id')?.remove();
});

const viewBox = () =>
  container.querySelector('svg')?.getAttribute('viewBox') ?? null;

const viewBoxOf = ({ width, height }: { width: number; height: number }) =>
  `0 0 ${width} ${height}`;

describe('in the browser', () => {
  const event = events.mays2023_men;

  test('measures with the DOM by default', () => {
    act(() => root.render(<BumpsChart data={event} />));

    expect(viewBox()).toBe(
      viewBoxOf(layoutChart(event, { measureText: domMeasure }))
    );
  });

  test('keeps using a supplied measureText after mounting', () => {
    act(() => root.render(<BumpsChart data={event} measureText={supplied} />));

    expect(viewBox()).toBe(
      viewBoxOf(layoutChart(event, { measureText: supplied }))
    );
    expect(measuredFonts).toEqual([]);
  });

  test('keeps using a supplied measureText for multi-year charts', () => {
    const data = [events.mays2022_men, events.mays2023_men];

    act(() =>
      root.render(<BumpsChartMultiYear data={data} measureText={supplied} />)
    );

    expect(viewBox()).toBe(
      viewBoxOf(layoutChartMultiYear(data, { measureText: supplied }))
    );
    expect(measuredFonts).toEqual([]);
  });

  test('draws unkerned only with a supplied measureText', () => {
    act(() => root.render(<BumpsChart data={event} />));
    expect(container.querySelector('svg')?.getAttribute('class')).not.toMatch(
      /unkerned/
    );

    act(() => root.render(<BumpsChart data={event} measureText={supplied} />));
    expect(container.querySelector('svg')?.getAttribute('class')).toMatch(
      /unkerned/
    );
  });

  test("measures in the chart's own font, not the page's", () => {
    container.style.setProperty(
      '--react-bumps-chart-font-family',
      '"Chart Font", Arial'
    );

    act(() => root.render(<BumpsChart data={event} />));

    expect(measuredFonts.length).toBeGreaterThan(0);
    expect(new Set(measuredFonts)).toEqual(new Set(['"Chart Font", Arial']));
  });
});
