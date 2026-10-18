import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import getStringWidth, { clearStringWidthCache } from './get-string-width';
import { MeasureText, fontSize } from './layout-chart';

const style = {
  fontFamily: 'var(--react-bumps-chart-font-family)',
  fontSize: `${fontSize}px`,
};

/** Approximates text width when there's no DOM to measure with. */
export const estimateTextWidth: MeasureText = (text) =>
  text.length * fontSize * 0.55;

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
