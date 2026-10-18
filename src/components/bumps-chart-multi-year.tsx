import './globals.css';

import { Crews } from './crews/crews';
import { Division } from './division/division';
import { Event } from '../types';
import { Join } from './join/join';
import { Label } from './label/label';
import { Numbers } from './numbers/numbers';
import { Stripes } from './stripes/stripes';
import classes from './bumps-chart.module.css';
import { layoutChartMultiYear } from '@/utils/layout-chart-multi-year';
import { scale } from '@/utils/layout-chart';
import { useMeasureText } from '@/utils/measure-text';
import { useMemo } from 'react';

namespace BumpsChartMultiYear {
  export type Props = {
    data: Event[];
    blades?: boolean;
    spoons?: boolean;
  };
}

export const BumpsChartMultiYear = ({
  data,
  blades = false,
}: BumpsChartMultiYear.Props) => {
  const measureText = useMeasureText();

  const layout = useMemo(
    () => layoutChartMultiYear(data, { measureText, blades }),
    [data, measureText, blades]
  );

  return (
    <svg
      className={classes.root}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
    >
      <g transform={`translate(0 ${layout.labels.y})`}>
        {layout.labels.labels.map((label, index) => (
          <Label key={index} label={label} x={layout.labels.x} />
        ))}
      </g>
      <g transform={`translate(0 ${layout.y})`}>
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
      </g>
    </svg>
  );
};
