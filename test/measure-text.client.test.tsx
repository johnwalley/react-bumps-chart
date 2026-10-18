// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { BumpsChart } from '../src/components/bumps-chart';
import { BumpsChartMultiYear } from '../src/components/bumps-chart-multi-year';
import { events } from './fixtures';
import { layoutChart } from '@/utils/layout-chart';
import { layoutChartMultiYear } from '@/utils/layout-chart-multi-year';
import { renderToString } from 'react-dom/server';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom can't measure text, so the DOM measures every string as this wide,
// and records the font it was asked to measure in
const DOM_WIDTH = 100;
const measuredFonts: { fontFamily: string; fontWeight: string }[] = [];
const domMeasure = () => DOM_WIDTH;

const supplied = (text: string) => text.length * 5;

let container: HTMLDivElement;
let root: Root;
let pageStyles: HTMLStyleElement;

beforeEach(() => {
  measuredFonts.length = 0;
  Object.defineProperty(SVGElement.prototype, 'getComputedTextLength', {
    configurable: true,
    value(this: SVGTextElement) {
      const { fontFamily, fontWeight } = this.style;
      measuredFonts.push({ fontFamily, fontWeight });
      return DOM_WIDTH;
    },
  });

  pageStyles = document.createElement('style');
  document.head.append(pageStyles);

  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  pageStyles.remove();
  document.getElementById('__react_svg_text_measurement_id')?.remove();
  delete (SVGElement.prototype as Partial<SVGTextContentElement>)
    .getComputedTextLength;
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

  test('measures in the font its text is drawn in', () => {
    // A page styling chart text directly. jsdom can't resolve var(), so this
    // stands in for --react-bumps-chart-font-family too: a browser reports
    // the resolved font either way
    pageStyles.textContent =
      '.page text { font-family: Georgia; font-weight: 700 }';
    container.className = 'page';

    act(() => root.render(<BumpsChart data={event} />));

    expect(measuredFonts.length).toBeGreaterThan(0);
    expect(new Set(measuredFonts.map((font) => JSON.stringify(font)))).toEqual(
      new Set([JSON.stringify({ fontFamily: 'Georgia', fontWeight: '700' })])
    );
  });
});

describe('hydration', () => {
  test.each([
    [
      'BumpsChart',
      () => <BumpsChart data={events.mays2023_men} measureText={supplied} />,
    ],
    [
      'BumpsChartMultiYear',
      () => (
        <BumpsChartMultiYear
          data={[events.mays2022_men, events.mays2023_men]}
          measureText={supplied}
        />
      ),
    ],
  ])('%s with a supplied measureText never changes shape', (_, chart) => {
    // Hydrate into the container in place of the client root beforeEach made
    act(() => root.unmount());
    container.innerHTML = renderToString(chart());
    // As the DOM serializes it, which escapes differently from React
    const serverMarkup = container.innerHTML;

    const errors: unknown[] = [];
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    try {
      act(() => {
        root = hydrateRoot(container, chart(), {
          onRecoverableError: (error) => errors.push(error),
        });
      });

      expect(errors).toEqual([]);
      expect(consoleError).not.toHaveBeenCalled();
      // Effects have run, and the markup is still exactly the server's
      expect(container.innerHTML).toBe(serverMarkup);
      expect(measuredFonts).toEqual([]);
    } finally {
      consoleError.mockRestore();
    }
  });
});
