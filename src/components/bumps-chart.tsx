import './globals.css';

import { Blades } from './blades/blades';
import { Crews } from './crews/crews';
import { Division } from './division/division';
import { Event } from '../types';
import { ExtraText } from './extra-text/extra-text';
import { Numbers } from './numbers/numbers';
import { Stripes } from './stripes/stripes';
import classes from './bumps-chart.module.css';
import { layoutChart, scale } from '@/utils/layout-chart';
import { useMeasureText } from '@/utils/measure-text';
import { useMemo } from 'react';

namespace BumpsChart {
  export type Props = {
    data: Event;
    blades?: boolean;
    spoons?: boolean;
  };
}

export const BumpsChart = ({ data, blades = false }: BumpsChart.Props) => {
  const measureText = useMeasureText();

  const layout = useMemo(
    () => layoutChart(data, { measureText, blades }),
    [data, measureText, blades]
  );

  return (
    <svg
      className={classes.root}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
    >
      <g transform={`translate(0 ${layout.y})`}>
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
        {layout.startBlades && (
          <Blades
            flip
            crews={layout.startBlades.clubs}
            scale={scale}
            x={layout.startBlades.x}
          />
        )}
        {layout.endBlades && (
          <Blades
            crews={layout.endBlades.clubs}
            scale={scale}
            x={layout.endBlades.x}
          />
        )}
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
      </g>
    </svg>
  );
};
