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

const styles = StyleSheet.create({
  page: {},
});

namespace BumpsChart {
  export type Props = {
    data: Event;
    blades?: boolean;
  };
}

export const BumpsChart = ({ data, blades = false }: BumpsChart.Props) => {
  const left = xOffset + scale * 2;

  const widthNumbers = 32;

  const widthDivisions = data.days * scale;

  // TODO: Crews who start are not necessarily the same as crews who end
  const widthCrews =
    Math.max(
      ...data.crews.map(
        (crew) =>
          getStringWidth(`${crew.start}`, {
            fontFamily: 'var(--react-bumps-chart-font-family)',
            fontSize: '12.8px',
          })!
      )
    ) +
    2 * gap;

  const startNumbers = calculateNumbers(data, true);
  const endNumbers = calculateNumbers(data, false);

  const widthStartNumbers =
    Math.max(
      ...startNumbers.map(
        (number) =>
          getStringWidth(`${number}`, {
            fontFamily: 'var(--react-bumps-chart-font-family)',
            fontSize: '12.8px',
          })!
      )
    ) + gap;

  const widthEndNumbers =
    Math.max(
      ...endNumbers.map(
        (number) =>
          getStringWidth(`${number}`, {
            fontFamily: 'var(--react-bumps-chart-font-family)',
            fontSize: '12.8px',
          })!
      )
    ) + gap;

  const division = calculateDivisions(
    data,
    scale,
    widthStartNumbers + widthCrews,
    widthEndNumbers + widthCrews,
    blades
  );
  const extraText = calculateExtraText(data, scale);

  const stripes = calculateStripes(
    data,
    null,
    scale,
    left,
    widthStartNumbers +
      widthCrews +
      widthDivisions +
      widthCrews +
      widthEndNumbers,
    sep
  );

  return (
    <Document>
      <Page
        size={{
          width:
            left +
            widthNumbers +
            widthCrews +
            gap +
            widthDivisions +
            gap +
            widthCrews +
            widthNumbers,
          height: 32 + data.crews.length * scale,
        }}
        style={styles.page}
      >
        <Svg
          viewBox={`0 0 ${left + widthNumbers + widthCrews + gap + widthDivisions + gap + widthCrews + widthNumbers} ${32 + data.crews.length * scale}`}
          preserveAspectRatio="none"
        >
          <G transform="translate(0 20)">
            <Stripes stripes={stripes} x={0} />
            <Numbers
              align="start"
              numbers={startNumbers}
              scale={scale}
              x={left}
            />
            <Numbers
              align="end"
              numbers={endNumbers}
              scale={scale}
              x={
                left +
                widthNumbers +
                widthCrews +
                gap +
                widthDivisions +
                gap +
                widthCrews +
                widthNumbers
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
              x={left + widthStartNumbers + widthCrews - gap}
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
              x={left + widthStartNumbers + widthCrews + widthDivisions + gap}
            />
            <Division
              lines={division.polylines}
              divisionLines={division.divisionLines}
              circles={division.circles}
              skipped={division.skipped}
              rect={division.rect}
              x={left + widthStartNumbers + widthCrews}
            />
            <ExtraText text={extraText} x={16} />
          </G>
        </Svg>
      </Page>
    </Document>
  );
};
