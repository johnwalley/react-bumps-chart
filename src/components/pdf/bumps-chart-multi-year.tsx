import { Document, G, Page, StyleSheet, Svg } from '@react-pdf/renderer';

import { Crews } from './crews';
import { Division } from './division';
import { Event } from '../../types';
import { Join } from './join';
import { Label } from './label';
import { Numbers } from './numbers';
import { Stripes } from './stripes';
import { layoutChartMultiYear } from '@/utils/layout-chart-multi-year';
import { measurePdfText } from './measure-text';
import { scale } from '@/utils/layout-chart';

const styles = StyleSheet.create({
  page: {},
});

namespace BumpsChartMultiYear {
  export type Props = {
    data: Event[];
    blades?: boolean;
  };
}

export type BumpsChartMultiYearProps = BumpsChartMultiYear.Props;

export const BumpsChartMultiYear = ({
  data,
  blades = false,
}: BumpsChartMultiYear.Props) => {
  const layout = layoutChartMultiYear(data, {
    measureText: measurePdfText,
    blades,
  });

  return (
    <Document>
      <Page
        size={{
          width: Math.ceil(layout.width),
          height: Math.ceil(layout.height),
        }}
        style={styles.page}
      >
        <Svg
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          preserveAspectRatio="none"
        >
          <G transform={`translate(0 ${layout.labels.y})`}>
            {layout.labels.labels.map((label, index) => (
              <Label key={index} label={label} x={layout.labels.x} />
            ))}
          </G>
          <G transform={`translate(0 ${layout.y})`}>
            {layout.stripes.stripes.map((stripe, index) => (
              <Stripes key={index} stripes={stripe} x={layout.stripes.x} />
            ))}
            <Numbers
              align="start"
              numbers={layout.startNumbers.numbers}
              scale={scale}
              x={layout.startNumbers.x}
            />
            <Numbers
              align="end"
              numbers={layout.endNumbers.numbers}
              scale={scale}
              x={layout.endNumbers.x}
            />
            <Crews
              align="end"
              crews={layout.startCrews.crews}
              scale={scale}
              x={layout.startCrews.x}
            />
            <Crews
              align="start"
              crews={layout.endCrews.crews}
              scale={scale}
              x={layout.endCrews.x}
            />
            {layout.joins.map((join, index) => (
              <Join
                key={index}
                lines={join.lines}
                joins={join.polylines}
                text={join.text}
                x={join.x}
              />
            ))}
            {layout.divisions.map((division, index) => (
              <Division
                key={index}
                lines={division.polylines}
                divisionLines={division.divisionLines}
                circles={division.circles}
                rect={division.rect}
                skipped={division.skipped}
                x={division.x}
              />
            ))}
          </G>
        </Svg>
      </Page>
    </Document>
  );
};
