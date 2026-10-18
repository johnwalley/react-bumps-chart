import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import getStringWidth, { clearStringWidthCache } from './get-string-width';
import { MeasureText, fontSize } from './layout-chart';

const style = {
  fontFamily: 'var(--react-bumps-chart-font-family)',
  fontSize: `${fontSize}px`,
};

// Helvetica's advance widths in 1/1000 em, which Arial and Liberation Sans
// share. Grouped by width; anything unlisted counts as the commonest, 556
// (most lowercase letters and digits).
const ADVANCE_FALLBACK = 556;
const ADVANCE = new Map<string, number>(
  (
    [
      [191, "'"],
      [222, 'ijl’'],
      [260, '|'],
      [278, ' !,./:;I[\\]ft'],
      [333, '()-`r'],
      [334, '{}'],
      [355, '"'],
      [389, '*'],
      [469, '^'],
      [500, 'Jcksvxyz'],
      [584, '+<=>~'],
      [611, 'FTZ'],
      [667, '&ABEKPSVXY'],
      [722, 'CDHNRUw'],
      [778, 'GOQ'],
      [833, 'Mm'],
      [889, '%'],
      [944, 'W'],
      [1015, '@'],
    ] as const
  ).flatMap(([width, characters]) =>
    [...characters].map((character) => [character, width] as const)
  )
);

/**
 * Approximates text width when there's no DOM to measure with, from
 * Helvetica's advance widths (which Arial shares). Matches what the DOM
 * measures when the chart's font stack falls back to Arial or Helvetica; with
 * another font loaded, such as the default Roboto Flex, the browser's
 * measurement still differs and the chart changes shape after hydration.
 */
export const estimateTextWidth: MeasureText = (text) => {
  let width = 0;

  for (const character of text) {
    width += ADVANCE.get(character) ?? ADVANCE_FALLBACK;
  }

  return (width * fontSize) / 1000;
};

/** Measures text as the SVG charts draw it, falling back to an estimate. */
export const measureSvgText: MeasureText = (text) =>
  getStringWidth(text, style) ?? estimateTextWidth(text);

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Returns a text measurer for SVG charts. Estimates on the server and the
 * first client render so hydration matches, then measures with the DOM before
 * paint, and again whenever a web font finishes loading.
 */
export function useMeasureText(): MeasureText {
  // 0 until mounted, then bumped each time fonts load
  const [version, setVersion] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const fonts = document.fonts;

    const onLoadingDone = () => {
      clearStringWidthCache();
      setVersion((version) => version + 1);
    };

    setVersion(1);
    fonts?.addEventListener('loadingdone', onLoadingDone);

    return () => fonts?.removeEventListener('loadingdone', onLoadingDone);
  }, []);

  // A new function each version so layouts depending on it recalculate
  return useMemo<MeasureText>(
    () => (version === 0 ? estimateTextWidth : (text) => measureSvgText(text)),
    [version]
  );
}
