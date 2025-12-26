import { Document, G, Page, StyleSheet, Svg } from '@react-pdf/renderer';
import { Crews } from './crews';
import { Division } from './division';
import { Event } from '../../types';
import { ExtraText } from './extra-text';
import { Numbers } from './numbers';
import { Stripes } from './stripes';
import { calculateDivisions } from '@/utils/calculate-divisions';
import { calculateExtraText } from '@/utils/calculate-extra-text';
import { calculateNumbers } from '@/utils/calculate-numbers';
import { calculateStripes } from '@/utils/calculate-stripes';
import getStringWidth from '@/utils/get-string-width';

const scale = 16;
const sep = 32;
const gap = 3;
const xOffset = 0;
const fontSize = 12.8;

const styles = StyleSheet.create({
  page: {},
});

const getMaxStringWidth = (strings: string[]) => {
  return Math.max(
    ...strings.map(
      (str) =>
        getStringWidth(`${str}`, {
          fontFamily: 'var(--react-bumps-chart-font-family)',
          fontSize: `${fontSize}px`,
        })!
    )
  );
};

namespace BumpsChart {
  export type Props = {
    data: Event;
    blades?: boolean;
  };
}

export const BumpsChart = ({ data, blades = false }: BumpsChart.Props) => {
  const left = xOffset + scale * 2;
  const right = gap;

  const widthDivisions = data.days * scale;

  const widthBlades = 32;

  // TODO: Crews who start are not necessarily the same as crews who end
  const widthCrews =
    getMaxStringWidth(data.crews.map((crew) => crew.start)) + 2 * gap;

  const startNumbers = calculateNumbers(data, true);
  const endNumbers = calculateNumbers(data, false);

  const widthStartNumbers = getMaxStringWidth(startNumbers) + gap;
  const widthEndNumbers = getMaxStringWidth(endNumbers) + gap;

  const division = calculateDivisions(
    data,
    scale,
    widthStartNumbers + widthBlades + widthCrews,
    widthEndNumbers + widthBlades + widthCrews,
    blades
  );

  const extraText = calculateExtraText(data, scale);

  const stripes = calculateStripes(
    data,
    null,
    scale,
    left,
    widthStartNumbers +
      widthBlades +
      widthCrews +
      widthDivisions +
      widthCrews +
      widthBlades +
      widthEndNumbers,
    sep
  );

  return (
    <Document>
      <Page
        size={{
          width:
            left +
            widthStartNumbers +
            widthBlades +     
            widthCrews +
            widthDivisions +
            widthCrews +
            widthBlades +
            widthEndNumbers +
            right,
          height: 2 * gap + data.crews.length * scale,
        }}
        style={styles.page}
      >
        <Svg
          viewBox={`0 0 ${left +
            widthStartNumbers +
            widthBlades +     
            widthCrews +
            widthDivisions +
            widthCrews +
            widthBlades +
            widthEndNumbers +
            right} ${2 * gap + data.crews.length * scale}`}
          preserveAspectRatio="none"
        >
          <G transform={`translate(0 ${gap})`}>
            <Stripes stripes={stripes} x={0} />
            <Numbers
              align="start"
              numbers={startNumbers}
              scale={scale}
              x={left + gap}
            />
            <Numbers
              align="end"
              numbers={endNumbers}
              scale={scale}
              x={
                left +
                widthStartNumbers +
                widthBlades +
                widthCrews +
                widthDivisions +
                widthCrews +
                widthBlades +
                widthEndNumbers -
                gap
              }
            />
            <Crews
              align="end"
              crews={data.crews.map((crew, index) => ({
                crew: crew.start,
                blades: blades && crew.blades,
                highlight: crew.highlight,
                y: index,
              }))}
              scale={scale}
              x={left + widthStartNumbers + widthBlades + widthCrews - gap}
            />
            <Crews
              align="start"
              crews={data.crews.map((crew, index) => ({
                crew: crew.gain !== null ? crew.start : null,
                blades: blades && crew.blades,
                highlight: crew.highlight,
                y: index - (crew.gain ?? 0),
              }))}
              scale={scale}
              x={
                left +
                widthStartNumbers +
                widthBlades +
                widthCrews +
                widthDivisions +
                gap
              }
            />
            <Division
              lines={division.polylines}
              divisionLines={division.divisionLines}
              circles={division.circles}
              skipped={division.skipped}
              rect={division.rect}
              x={left + widthStartNumbers + widthBlades + widthCrews}
            />
            <ExtraText text={extraText} x={16} />
          </G>
        </Svg>
      </Page>
    </Document>
  );
};
