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
import { calculateStripes } from '@/utils/calculate-stripes';
import { Stripes } from './stripes';
import { Label } from './label';

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

  // TODO: Crews who start are not necessarily the same as crews who end
  const widthCrews = Math.max(
    ...data[0].crews.map(
      (crew) => getStringWidth(`${crew.start}`, { fontSize: 12.8 })!
    )
  );

  const widthNumbers = 32;

  const startNumbers = calculateNumbers(data[0]);
  const endNumbers = calculateNumbers(data[data.length - 1]);

  let top = 0;
  let right = 100;

  let xPos = 0;
  let skipFirst = false;

  const joins = [];
  const divisions = [];
  const stripes = [];
  const labels = [];

  let xDivisionOffset = 0;
  const xDivisionOffsets: number[] = [0];

  for (let eventNum = 0; eventNum < data.length; eventNum++) {
    const event = data[eventNum];
    let event2 = null;
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
      const nYear = event2!.year.split(' ')[0];

      if (nYear === p[0]) {
        skipFirst = true;
        const h = top - 5 - (p2.length - 1) * fontSize;
        const mid1 = xPos + (scale * event.days) / 2;

        const mid2 =
          xPos + scale * event.days + sep + (scale * event2!.days) / 2;

        const midp = (mid1 + mid2) / 2;
        const twidth = getStringWidth(nYear, { fontSize: 12.8 })!;

        labels.push({
          label: { label: nYear, pos: [midp, h] },
          lines: [
            [
              [mid1, h - fontSize / 2],
              [midp - twidth / 2, h - fontSize / 2],
            ],
            [
              [midp + twidth / 2, h - fontSize / 2],
              [mid2, h - fontSize / 2],
            ],
            [
              [mid1, h - fontSize / 2],
              [mid1, h],
            ],
            [
              [mid2, h - fontSize / 2],
              [mid2, h],
            ],
          ],
        });

        p2 = p2.slice(1);
      }
    }

    let h = top - 5 - (p2.length - 1) * fontSize;

    for (let i = 0; i < p2.length; i++) {
      labels.push({
        label: { label: p2[i], pos: [xPos + (scale * event.days) / 2, h] },
        lines: [],
      });

      h += fontSize;
    }

    stripes.push(
      calculateStripes(
        event,
        event2,
        scale,
        eventNum === 0
          ? xDivisionOffset - widthCrews - widthNumbers - gap
          : xDivisionOffset,
        event.days * scale +
          (eventNum === 0
            ? widthCrews + widthNumbers + gap
            : eventNum === data.length - 1
              ? gap + widthCrews + widthNumbers
              : 0),
        sep
      )
    );

    if (eventNum < data.length - 1) {
      joins.push(calculateJoin(event, event2, top, scale, sep, skipFirst));
    }

    xPos = xPos + scale * event.days + sep;

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
      width="400"
      viewBox={`0 0 ${widthNumbers + widthCrews + gap + xDivisionOffsets[data.length] - sep + gap + widthCrews + widthNumbers} 2000`}
      preserveAspectRatio="none"
    >
      <g transform="translate(0 20)">
        {labels.map((label, index) => (
          <Label label={label} x={widthNumbers + widthCrews + gap} />
        ))}
      </g>
      <g transform="translate(0 30)">
        {stripes.map((stripe, index) => (
          <Stripes stripes={stripe} x={widthNumbers + widthCrews + gap} />
        ))}
        <Numbers align="start" numbers={startNumbers} scale={scale} x={0} />
        <Numbers
          align="end"
          numbers={endNumbers}
          scale={scale}
          x={
            widthNumbers +
            widthCrews +
            gap +
            xDivisionOffsets[data.length] -
            sep +
            gap +
            widthCrews +
            widthNumbers
          }
        />
        <Crews
          align="end"
          crews={data[0].crews.map((crew) => crew.start)}
          scale={scale}
          x={widthNumbers + widthCrews}
        />
        <Crews
          align="start"
          crews={data[data.length - 1].crews.map((crew) => crew.end)}
          scale={scale}
          x={
            widthNumbers +
            widthCrews +
            gap +
            xDivisionOffsets[data.length] -
            sep +
            gap
          }
        />
        {joins.map((join, index) => (
          <Join
            lines={join.lines}
            joins={join.polylines}
            text={join.text}
            x={
              widthNumbers +
              widthCrews +
              gap +
              xDivisionOffsets[index + 1] -
              sep
            }
          />
        ))}
        {divisions.map((division, index) => (
          <Division
            lines={division.polylines}
            circles={division.circles}
            rect={division.rect}
            skipped={division.skipped}
            x={widthNumbers + widthCrews + gap + xDivisionOffsets[index]}
          />
        ))}
      </g>
    </svg>
  );
};
