import './globals.css';

import { Crews } from './crews/crews';
import { Division } from './division/division';
import { Event } from '../types';
import { Join } from './join/join';
import { Label } from './label/label';
import { Numbers } from './numbers/numbers';
import { Stripes } from './stripes/stripes';
import { calculateDivisions } from '@/utils/calculate-divisions';
import { caluclateJoin as calculateJoin } from '@/utils/calculate-join';
import { calculateNumbers } from '@/utils/calculate-numbers';
import { calculateStripes } from '@/utils/calculate-stripes';
import classes from './bumps-chart.module.css';
import getStringWidth from '@/utils/get-string-width';

const scale = 16;
const sep = 32;
const gap = 5;
const xOffset = 10;
const fontSize = 12.8;

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
  let height = 0;
  const left = xOffset + scale * 2;

  const widthStartCrews =
    Math.max(
      ...data[0].crews.map(
        (crew) => getStringWidth(`${crew.start}`, { fontSize: fontSize })!
      )
    ) +
    2 * gap;

  const widthEndCrews =
    Math.max(
      ...data[0].crews.map(
        (crew) => getStringWidth(`${crew.end}`, { fontSize: fontSize })!
      )
    ) +
    2 * gap;

  const startNumbers = calculateNumbers(data[0]);
  const endNumbers = calculateNumbers(data[data.length - 1]);

  const widthStartNumbers =
    Math.max(
      ...startNumbers.map(
        (number) => getStringWidth(`${number}`, { fontSize: fontSize })!
      )
    ) + gap;

  const widthEndNumbers =
    Math.max(
      ...endNumbers.map(
        (number) => getStringWidth(`${number}`, { fontSize: fontSize })!
      )
    ) + gap;

  let top = 0;

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
    //let extra = sep;

    if (eventNum < data.length - 1) {
      event2 = data[eventNum + 1];
    } else {
      //extra = right;
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
        const tWidth = getStringWidth(nYear, { fontSize: fontSize })!;

        labels.push({
          label: { label: nYear, pos: [midp, h] },
          lines: [
            [
              [mid1, h - fontSize / 2],
              [midp - tWidth / 2, h - fontSize / 2],
            ],
            [
              [midp + tWidth / 2, h - fontSize / 2],
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
          ? xDivisionOffset - widthStartCrews - widthStartNumbers - gap
          : xDivisionOffset,
        event.days * scale +
          (eventNum === 0
            ? widthStartCrews + widthStartNumbers + gap
            : eventNum === data.length - 1
              ? gap + widthEndCrews + widthEndNumbers
              : 0),
        sep
      )
    );

    if (eventNum < data.length - 1) {
      const { height: h, ...join } = calculateJoin(
        event,
        event2!,
        top,
        scale,
        sep,
        skipFirst
      );

      if (h > height) {
        height = h;
      }

      joins.push(join);
    }

    xPos = xPos + scale * event.days + sep;

    xDivisionOffset += event.days * scale + sep;
    xDivisionOffsets.push(xDivisionOffset);
  }

  xPos = left;

  for (const event of data) {
    const { height: h, ...division } = calculateDivisions(
      event,
      scale,
      0,
      0,
      blades
    );

    if (h > height) {
      height = h;
    }

    divisions.push(division);
  }

  return (
    <svg
      className={classes.root}
      viewBox={`0 0 ${widthStartNumbers + widthStartCrews + gap + xDivisionOffsets[data.length] - sep + gap + widthEndCrews + widthEndNumbers} ${height + 3 * fontSize}`}
      preserveAspectRatio="none"
    >
      <g transform="translate(0 20)">
        {labels.map((label) => (
          <Label
            key={label.label.label}
            label={label}
            x={widthStartNumbers + widthStartCrews + gap}
          />
        ))}
      </g>
      <g transform="translate(0 30)">
        {stripes.map((stripe, index) => (
          <Stripes
            key={index}
            stripes={stripe}
            x={widthStartNumbers + widthStartCrews + gap}
          />
        ))}
        <Numbers align="start" numbers={startNumbers} scale={scale} x={gap} />
        <Numbers
          align="end"
          numbers={endNumbers}
          scale={scale}
          x={
            widthStartNumbers +
            widthStartCrews +
            gap +
            xDivisionOffsets[data.length] -
            sep +
            gap +
            widthEndCrews +
            widthEndNumbers -
            gap
          }
        />
        <Crews
          align="end"
          crews={data[0].crews.map((crew, index) => ({
            crew: crew.start,
            blades: blades && crew.blades,
            highlight: crew.highlight,
            y: index,
          }))}
          scale={scale}
          x={widthStartNumbers + widthStartCrews}
        />
        <Crews
          align="start"
          crews={data[data.length - 1].crews.map((crew, index) => ({
            crew: crew.gain !== null ? crew.start : null,
            blades: blades && crew.blades,
            highlight: crew.highlight,
            y: index - (crew.gain ?? 0),
          }))}
          scale={scale}
          x={
            widthEndNumbers +
            widthEndCrews +
            gap +
            xDivisionOffsets[data.length] -
            sep +
            gap
          }
        />
        {joins.map((join, index) => (
          <Join
            key={index}
            lines={join.lines}
            joins={join.polylines}
            text={join.text}
            x={
              widthStartNumbers +
              widthStartCrews +
              gap +
              xDivisionOffsets[index + 1] -
              sep
            }
          />
        ))}
        {divisions.map((division, index) => (
          <Division
            key={index}
            lines={division.polylines}
            divisionLines={division.divisionLines}
            circles={division.circles}
            rect={division.rect}
            skipped={division.skipped}
            x={
              widthStartNumbers +
              widthStartCrews +
              gap +
              xDivisionOffsets[index]
            }
          />
        ))}
      </g>
    </svg>
  );
};
