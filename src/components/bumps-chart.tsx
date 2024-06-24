import { useMemo } from 'react';
import { merge, range } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { Blade, shortShortNames, abbreviations } from 'react-rowing-blades';

// @ts-ignore - This import is not working
import classes from './bumps-chart.module.css';

import { Event } from '../types';
import getStringWidth from '@/utils/get-string-width';
import { line } from 'd3-shape';
import { Delaunay } from 'd3-delaunay';
import { calculateDivisions } from '@/utils/calculate-divisions';
import { Numbers } from './numbers';
import { calculateNumbers } from '@/utils/calculate-numbers';
import { caluclateJoin as calculateJoin } from '@/utils/calculate-join';
import { Join } from './join';
import { Division } from './division';
import { Crews } from './crews';
import { ExtraText } from './extra-text';
import { calculateExtraText } from '@/utils/calculate-extra-text';

const scale = 16;
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

  const widthNumbersLeft = Math.max(
    ...data.crews.map(
      (crew, index) => getStringWidth(`${crew.start}`, { fontSize: 12.8 })!
    )
  );

  const tRight = Math.max(
    ...data.crews.map(
      (crew, index) => getStringWidth(`${crew.end}`, { fontSize: 12.8 })!
    )
  );

  const startNumbers = data.div_size[0].flatMap((size) =>
    Array.from({ length: size }, (_, i) => String(i + 1))
  );

  const endNumbers = Array.from({ length: data.crews.length }, (_, i) =>
    String(i + 1)
  );

  const division = calculateDivisions(data, scale);

  const extraText = calculateExtraText(data, scale);

  return (
    <svg
      className={classes.root}
      width="800"
      viewBox={`0 0 ${left + 32 + widthNumbersLeft + gap + data.days * scale + gap + tRight + 32} ${32 + data.crews.length * scale}`}
      preserveAspectRatio="none"
    >
      <g transform="translate(0 20)">
        <Numbers align="start" numbers={startNumbers} scale={scale} x={left} />
        <Numbers
          align="end"
          numbers={endNumbers}
          scale={scale}
          x={
            left +
            32 +
            widthNumbersLeft +
            gap +
            data.days * scale +
            gap +
            tRight +
            32
          }
        />
        <Crews
          align="end"
          crews={data.crews.map((crew) => crew.start)}
          scale={scale}
          x={left + 32 + widthNumbersLeft}
        />
        <Crews
          align="start"
          crews={data.crews.map((crew) => crew.end)}
          scale={scale}
          x={left + 32 + widthNumbersLeft + gap + data.days * scale + gap}
        />
        <Division
          lines={division.polylines}
          circles={division.circles}
          skipped={[]}
          rect={division.rect}
          x={left + 32 + widthNumbersLeft + gap}
        />
        <ExtraText text={extraText} x={10} />
      </g>
    </svg>
  );
};
