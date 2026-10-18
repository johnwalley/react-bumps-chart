import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import getStringWidth, { clearStringWidthCache } from './get-string-width';
import { MeasureText, fontSize } from './layout-chart';

// Helvetica's advance widths in 1/1000 em, which Arial and Liberation Sans
// share, for printable ASCII and typographic quotes. Grouped by width;
// anything unlisted counts as the commonest, 556 (most lowercase letters and
// digits).
const ADVANCE_FALLBACK = 556;
const ADVANCE = new Map<string, number>(
  (
    [
      [191, "'"],
      [222, 'ijl‘’'],
      [260, '|'],
      [278, ' !,./:;I[\\]ft'],
      [333, '()-`r“”'],
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
 * measures before kerning when the chart's font stack falls back to Arial or
 * Helvetica; with another font loaded, such as the default Roboto Flex, the
 * browser's measurement still differs and the chart changes shape after
 * hydration.
 */
export const estimateTextWidth: MeasureText = (text) => {
  let width = 0;

  for (const character of text) {
    width += ADVANCE.get(character) ?? ADVANCE_FALLBACK;
  }

  return (width * fontSize) / 1000;
};

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

type ChartFont = Pick<
  CSSStyleDeclaration,
  | 'fontFamily'
  | 'fontKerning'
  | 'fontStretch'
  | 'fontStyle'
  | 'fontVariationSettings'
  | 'fontWeight'
  | 'letterSpacing'
>;

/**
 * The font a chart's text is drawn in, read from text it has rendered. The
 * measuring element lives on `document.body`, so it can't rely on the chart's
 * styles: this way it follows the stylesheet, a `--react-bumps-chart-font-family`
 * set for the chart alone, a page's own rules for chart text, or the page font
 * when the stylesheet isn't loaded. Null if the chart has no text to read.
 */
function chartFont(svg: SVGSVGElement | null): ChartFont | null {
  const text = svg?.querySelector('text');

  if (!text) return null;

  const style = getComputedStyle(text);

  return {
    fontFamily: style.fontFamily,
    fontKerning: style.fontKerning,
    fontStretch: style.fontStretch,
    fontStyle: style.fontStyle,
    fontVariationSettings: style.fontVariationSettings,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
  };
}

/**
 * Returns a text measurer for SVG charts. A `measureText` passed in is used
 * as is, on the server and in the browser alike. Otherwise estimates on the
 * server and the first client render so hydration matches, then measures with
 * the DOM, in the chart's font, before paint, and again whenever a web font
 * finishes loading.
 */
export function useMeasureText(
  svg: RefObject<SVGSVGElement | null>,
  measureText?: MeasureText
): MeasureText {
  // Null until mounted. A new object each time a web font loads, so layouts
  // depending on the measurer recalculate
  const [font, setFont] = useState<ChartFont | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (measureText) return;

    const fonts = document.fonts;

    const read = () => setFont(chartFont(svg.current));

    const onLoadingDone = () => {
      clearStringWidthCache();
      read();
    };

    read();
    fonts?.addEventListener('loadingdone', onLoadingDone);

    return () => fonts?.removeEventListener('loadingdone', onLoadingDone);
  }, [svg, measureText]);

  return useMemo<MeasureText>(() => {
    if (measureText) return measureText;
    if (!font) return estimateTextWidth;

    // In the chart's units, as layout expects
    const style = { ...font, fontSize: `${fontSize}px` };

    return (text) => getStringWidth(text, style) ?? estimateTextWidth(text);
  }, [measureText, font]);
}
