import { MeasureText, fontSize } from '@/utils/layout-chart';
import { Font } from '@react-pdf/renderer';
import { estimateTextWidth } from '@/utils/measure-text';

/** Measures text in Helvetica, react-pdf's default font. */
export const measurePdfText: MeasureText = (text) => {
  // Standard fonts are built in, so this is available without loading
  const font = Font.getFont({ fontFamily: 'Helvetica' }).data;

  if (!font) {
    return estimateTextWidth(text);
  }

  // Standard PDF fonts use 1000 units per em
  return (font.layout(text).advanceWidth * fontSize) / 1000;
};
