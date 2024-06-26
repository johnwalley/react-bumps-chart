import { useMemo } from 'react';
import { merge, range } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { Blade, shortShortNames, abbreviations } from 'react-rowing-blades';

// @ts-ignore - This import is not working
import classes from './bumps-chart.module.css';

import { Event } from '../types';
import getStringWidth from '@/utils/get-string-width';
import { Delaunay } from 'd3-delaunay';
import { calculateDivisions } from '@/utils/calculate-divisions';
import { Numbers } from './numbers/numbers';
import { calculateNumbers } from '@/utils/calculate-numbers';
import { Division } from './division/division';
import { Crews } from './crews/crews';
import { ExtraText } from './extra-text/extra-text';
import { calculateExtraText } from '@/utils/calculate-extra-text';
import { calculateStripes } from '@/utils/calculate-stripes';
import { Stripes } from './stripes/stripes';

import './globals.css';

const scale = 16;
const sep = 32;
const gap = 3;
const xOffset = 0;

namespace BumpsChart {
  export type Props = {
    data: Event;
    blades?: boolean;
    spoons?: boolean;
  };
}

export const BumpsChart = ({
  data,
  blades = false,
  spoons = false,
}: BumpsChart.Props) => {
  const left = xOffset + scale * 2;
  const right = gap;

  const widthDivisions = data.days * scale;

  // TODO: Crews who start are not necessarily the same as crews who end
  const widthCrews =
    Math.max(
      ...data.crews.map(
        (crew) => getStringWidth(`${crew.start}`, { fontSize: 12.8 })!
      )
    ) +
    2 * gap;

  const startNumbers = calculateNumbers(data, true);
  const endNumbers = calculateNumbers(data, false);

  const widthStartNumbers =
    Math.max(
      ...startNumbers.map(
        (number) => getStringWidth(`${number}`, { fontSize: 12.8 })!
      )
    ) + gap;

  const widthEndNumbers =
    Math.max(
      ...endNumbers.map(
        (number) => getStringWidth(`${number}`, { fontSize: 12.8 })!
      )
    ) + gap;

  const division = calculateDivisions(
    data,
    scale,
    widthStartNumbers + widthCrews,
    widthEndNumbers + widthCrews
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
    <svg
      className={classes.root}
      width="800"
      viewBox={`0 0 ${
        left +
        widthStartNumbers +
        widthCrews +
        widthDivisions +
        widthCrews +
        widthEndNumbers +
        right
      } ${2 * gap + data.crews.length * scale}`}
      preserveAspectRatio="none"
    >
      <g transform={`translate(0 ${gap})`}>
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
            widthCrews +
            widthDivisions +
            widthCrews +
            widthEndNumbers -
            gap
          }
        />
        <Crews
          align="end"
          crews={data.crews.map((crew) => crew.start)}
          scale={scale}
          x={left + widthStartNumbers + widthCrews - gap}
        />
        <Crews
          align="start"
          crews={data.crews.map((crew) => crew.end)}
          scale={scale}
          x={left + widthStartNumbers + widthCrews + widthDivisions + gap}
        />
        <Division
          lines={division.polylines}
          circles={division.circles}
          skipped={[]}
          rect={division.rect}
          x={left + widthStartNumbers + widthCrews}
        />
        <ExtraText text={extraText} x={16} />
      </g>
    </svg>
  );
};
