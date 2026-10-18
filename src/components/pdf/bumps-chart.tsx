import { Document, G, Page, StyleSheet, Svg } from '@react-pdf/renderer';
import { layoutChart, scale } from '@/utils/layout-chart';
import { Crews } from './crews';
import { Division } from './division';
import { Event } from '../../types';
import { ExtraText } from './extra-text';
import { Numbers } from './numbers';
import { Stripes } from './stripes';
import { measurePdfText } from './measure-text';

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
  // react-pdf can't draw react-rowing-blades icons, so leave no space for them
  const layout = layoutChart(data, {
    measureText: measurePdfText,
    blades,
    bladeIcons: false,
  });

  return (
    <Document>
      <Page
        size={{ width: layout.width, height: layout.height }}
        style={styles.page}
      >
        <Svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          preserveAspectRatio="none"
        >
          <G transform={`translate(0 ${layout.y})`}>
            <Stripes stripes={layout.stripes} x={0} />
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
            <Division
              lines={layout.division.polylines}
              divisionLines={layout.division.divisionLines}
              circles={layout.division.circles}
              skipped={layout.division.skipped}
              rect={layout.division.rect}
              x={layout.division.x}
            />
            <ExtraText text={layout.extraText.text} x={layout.extraText.x} />
          </G>
        </Svg>
      </Page>
    </Document>
  );
};
