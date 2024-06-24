import { useMemo } from 'react';
import { cumsum, merge, range, sum } from 'd3-array';
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

const roman = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
];

const scale = 16;
const sep = 32;
const gap = 3;
const xOffset = 10;

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
  spoons = false,
}: BumpsChartMultiYear.Props) => {
  const fontSize = 12;
  const left = xOffset + scale * 2;

  const tLeft = Math.max(
    ...data[0].crews.map(
      (crew, index) => getStringWidth(`${crew.start}`, { fontSize: 12.8 })!
    )
  );

  const tRight = Math.max(
    ...data[data.length - 1].crews.map(
      (crew, index) => getStringWidth(`${crew.end}`, { fontSize: 12.8 })!
    )
  );

  const startNumbers = calculateNumbers(data[0]);
  const endNumbers = calculateNumbers(data[data.length - 1]);

  let top = 0;
  let right = 100;

  let xPos = left;
  let eLeft = left;
  let skipFirst = false;

  const joins = [];
  const divisions = [];

  let xDivisionOffset = 0;
  const xDivisionOffsets: number[] = [0];

  for (let eventNum = 0; eventNum < data.length; eventNum++) {
    const event = data[eventNum];
    let event2 = event;
    let extra = sep;

    if (eventNum < data.length - 1) {
      event2 = data[eventNum + 1];
    } else {
      extra = right;
    }

    const p = event.year.split(' ');
    let p2 = [p[0]];

    if (p.length > 1) {
      p2.push(p.slice(1).join(' '));
    }

    if (skipFirst) {
      p2 = p2.slice(1);
      skipFirst = false;
    } else if (eventNum < data.length - 1) {
      const nYear = event2.year.split(' ')[0];

      if (nYear === p[0]) {
        skipFirst = true;
        const h = top - 5 - (p2.length - 1) * fontSize;
        const mid1 = xPos + (scale * event.days) / 2;
        const mid2 =
          xPos + scale * event.days + sep + (scale * event2.days) / 2;
        const midp = (mid1 + mid2) / 2;
        const twidth = nYear.length * 6;

        // TODO: Finish
      }
    }

    let h = top - 5 - (p2.length - 1) * 12;

    for (let i = 0; i < p2.length; i++) {
      h += fontSize;
    }

    if (eventNum < data.length - 1) {
      joins.push(calculateJoin(event, event2, top, scale, sep, skipFirst));
    }

    xDivisionOffset += event.days * scale + sep;
    xDivisionOffsets.push(xDivisionOffset);
  }

  xPos = left;

  for (const event of data) {
    divisions.push(calculateDivisions(event, scale));
  }

  return (
    <svg
      className={classes.root}
      width="800"
      viewBox="0 0 800 2000"
      preserveAspectRatio="none"
    >
      <g transform="translate(0 20)">
        <Numbers align="start" numbers={startNumbers} scale={scale} x={0} />
        <Numbers
          align="end"
          numbers={endNumbers}
          scale={scale}
          x={
            32 +
            tLeft +
            gap +
            xDivisionOffsets[data.length] -
            sep +
            gap +
            tRight +
            32
          }
        />
        <Crews
          align="end"
          crews={data[0].crews.map((crew) => crew.start)}
          scale={scale}
          x={32 + tLeft}
        />
        <Crews
          align="start"
          crews={data[data.length - 1].crews.map((crew) => crew.end)}
          scale={scale}
          x={32 + tLeft + gap + xDivisionOffsets[data.length] - sep + gap}
        />
        {joins.map((join, index) => (
          <Join
            lines={join.lines}
            joins={join.polylines}
            text={join.text}
            x={32 + tLeft + gap + xDivisionOffsets[index + 1] - sep}
          />
        ))}
        {divisions.map((division, index) => (
          <Division
            lines={division.polylines}
            circles={division.circles}
            rect={division.rect}
            skipped={division.skipped}
            x={32 + tLeft + gap + xDivisionOffsets[index]}
          />
        ))}
      </g>
    </svg>
  );
};
