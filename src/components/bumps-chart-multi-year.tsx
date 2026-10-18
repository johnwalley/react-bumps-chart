import './globals.css';

import { Crews } from './crews/crews';
import { Division } from './division/division';
import { Event } from '../types';
import { Join } from './join/join';
import { Label } from './label/label';
import { Numbers } from './numbers/numbers';
import { Stripes } from './stripes/stripes';
import classNames from 'classnames';
import classes from './bumps-chart.module.css';
import { layoutChartMultiYear } from '@/utils/layout-chart-multi-year';
import { MeasureText, scale } from '@/utils/layout-chart';
import { useMeasureText } from '@/utils/measure-text';
import { useMemo, useRef } from 'react';

namespace BumpsChartMultiYear {
  export type Props = {
    data: Event[];
    blades?: boolean;
    spoons?: boolean;
    /**
     * Returns the width of a crew name or position at the chart's font size
     * (12.8), in chart units. Used on the server and in the browser alike, so
     * a chart laid out with it never changes shape on hydration. It must
     * match the font the chart draws in, which is unkerned when this is given.
     * Pass a stable function, such as one defined at module level: a new one
     * each render lays the chart out again each render.
     *
     * Defaults to measuring with the DOM, which can only estimate on the server.
     */
    measureText?: MeasureText;
  };
}

export type BumpsChartMultiYearProps = BumpsChartMultiYear.Props;

export const BumpsChartMultiYear = ({
  data,
  blades = false,
  measureText: measureTextProp,
}: BumpsChartMultiYear.Props) => {
  const ref = useRef<SVGSVGElement>(null);
  const measureText = useMeasureText(ref, measureTextProp);

  const layout = useMemo(
    () => layoutChartMultiYear(data, { measureText, blades }),
    [data, measureText, blades]
  );

  return (
    <svg
      ref={ref}
      className={classNames(classes.root, {
        [classes.unkerned]: measureTextProp,
      })}
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
