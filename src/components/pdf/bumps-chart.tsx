import { Document, G, Page, StyleSheet, Svg } from '@react-pdf/renderer';

import { Crews } from './crews';
import { Division } from './division';
import { Event } from '../../types';
import { ExtraText } from './extra-text';
import { Numbers } from './numbers';
import { Stripes } from './stripes';
import { calculateDivisions } from '@/utils/calculate-divisions';
import { calculateExtraText } from '@/utils/calculate-extra-text';
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
    spoons?: boolean;
  };
}

export const BumpsChart = ({ data }: BumpsChart.Props) => {
  const left = xOffset + scale * 2;

  const widthCrews = Math.max(
    ...data.crews.map(
      (crew) => getStringWidth(`${crew.start}`, { fontSize: 12.8 })!
    )
  );

  const widthNumbers = 32;

  const widthDivisions = data.days * scale;

  const startNumbers = data.div_size[0].flatMap((size) =>
    Array.from({ length: size }, (_, i) => String(i + 1))
  );

  const endNumbers = Array.from({ length: data.crews.length }, (_, i) =>
    String(i + 1)
  );

  const division = calculateDivisions(data, scale, 0, 0);

  const extraText = calculateExtraText(data, scale);

  const stripes = calculateStripes(
    data,
    null,
    scale,
    widthCrews - widthNumbers - gap,
    widthDivisions + gap + widthCrews + widthNumbers,
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
              crews={data.crews.map((crew) => crew.start)}
              scale={scale}
              x={left + widthNumbers + widthCrews}
            />
            <Crews
              align="start"
              crews={data.crews.map((crew) => crew.end)}
              scale={scale}
              x={left + widthNumbers + widthCrews + gap + widthDivisions + gap}
            />
            <Division
              lines={division.polylines}
              circles={division.circles}
              skipped={[]}
              rect={division.rect}
              x={left + widthNumbers + widthCrews + gap}
            />
            <ExtraText text={extraText} x={10} />
          </G>
        </Svg>
      </Page>
    </Document>
  );
};
