// @ts-ignore - This import is not working
import classes from './bumps-chart.module.css';

import { Event } from '../types';
import getStringWidth from '@/utils/get-string-width';
import { calculateDivisions } from '@/utils/calculate-divisions';
import { Numbers } from './numbers/numbers';
import { calculateNumbers } from '@/utils/calculate-numbers';
import { Division } from './division/division';
import { Crews } from './crews/crews';
import { ExtraText } from './extra-text/extra-text';
import { calculateExtraText } from '@/utils/calculate-extra-text';
import { calculateStripes } from '@/utils/calculate-stripes';
import { Stripes } from './stripes/stripes';
import { Blades } from './blades/blades';

import './globals.css';

import { shortShortNames, abbreviations } from 'react-rowing-blades';
import { useMemo } from 'react';

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

export const BumpsChart = ({ data, blades = false }: BumpsChart.Props) => {
  let names;
  let abbr;

  switch (data.set) {
    case 'May Bumps':
    case 'Lent Bumps':
      names = shortShortNames.cambridge;
      abbr = abbreviations.cambridge;
      break;
    case 'Summer Eights':
    case 'Torpids':
      names = shortShortNames.oxford;
      abbr = abbreviations.oxford;
      break;
    case 'Town Bumps':
      names = shortShortNames.uk;
      abbr = Object.assign(
        {},
        ...Object.values(abbreviations.uk).map((x: any) => ({ [x]: x }))
      );
      break;
    default:
      throw new Error(`${data.set} not recognised as a set`);
  }

  const startCodes = useMemo(
    () =>
      data.crews.map((crew) => {
        const name = crew.club;

        let code = Object.keys(names).find((key) => names[key] === abbr[name]);

        // Couldn't find club code based on abbreviation
        // Search using full name instead
        if (!code) {
          code = Object.keys(names).find((key) => names[key] === name);
        }

        if (!code) {
          if (name === 'LMBC') {
            code = 'lmb';
          } else if (name === '1st and 3rd') {
            code = 'ftt';
          } else if (name === "St Catharine's") {
            code = 'scc';
          } else if (name === "St Edmund's") {
            code = 'sec';
          } else if (name === 'Town') {
            code = 'cam';
          } else if (name === 'Old Cantabs') {
            code = 'cab';
          }
        }

        return code;
      }),
    [data.crews]
  );

  const endCodes = useMemo(
    () =>
      data.crews.map((crew) => {
        if (!crew.end) {
          return undefined;
        }

        const name = crew.club_end;

        let code = Object.keys(names).find((key) => names[key] === abbr[name]);

        // Couldn't find club code based on abbreviation
        // Search using full name instead
        if (!code) {
          code = Object.keys(names).find((key) => names[key] === name);
        }

        if (!code) {
          if (name === 'LMBC') {
            code = 'lmb';
          } else if (name === '1st and 3rd') {
            code = 'ftt';
          } else if (name === "St Catharine's") {
            code = 'scc';
          } else if (name === "St Edmund's") {
            code = 'sec';
          } else if (name === 'Town') {
            code = 'cam';
          } else if (name === 'Old Cantabs') {
            code = 'cab';
          }
        }

        return code;
      }),
    [data.crews]
  );

  const left = xOffset + scale * 2;
  const right = gap;

  const widthDivisions = data.days * scale;

  const widthBlades = 32;

  // TODO: Crews who start are not necessarily the same as crews who end
  const widthCrews =
    Math.max(
      ...data.crews.map(
        (crew) =>
          getStringWidth(`${crew.start}`, {
            fontFamily: var(--react-bumps-chart-font-family),
            fontSize: 12.8,
          })!
      )
    ) +
    2 * gap;

  const startNumbers = calculateNumbers(data, true);
  const endNumbers = calculateNumbers(data, false);

  const widthStartNumbers =
    Math.max(
      ...startNumbers.map(
        (number) =>
          getStringWidth(`${number}`, {
            fontFamily: 'var(--react-bumps-chart-font-family)',
            fontSize: '12.8px',
          })!
      )
    ) + gap;

  const widthEndNumbers =
    Math.max(
      ...endNumbers.map(
        (number) =>
          getStringWidth(`${number}`, {
            fontFamily: 'var(--react-bumps-chart-font-family)',
            fontSize: '12.8px',
          })!
      )
    ) + gap;

  const division = calculateDivisions(
    data,
    scale,
    widthStartNumbers + widthBlades + widthCrews,
    widthEndNumbers + widthBlades + widthCrews,
    blades
  );

  const extraText = calculateExtraText(data, scale);

  const stripes = calculateStripes(
    data,
    null,
    scale,
    left,
    widthStartNumbers +
      widthBlades +
      widthCrews +
      widthDivisions +
      widthCrews +
      widthBlades +
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
        widthBlades +
        widthCrews +
        widthDivisions +
        widthCrews +
        widthBlades +
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
            widthBlades +
            widthCrews +
            widthDivisions +
            widthCrews +
            widthBlades +
            widthEndNumbers -
            gap
          }
        />
        <Blades
          flip
          crews={startCodes}
          scale={scale}
          x={left + widthStartNumbers + widthBlades - gap}
        />
        {data.results.length > 0 && (
          <Blades
            crews={endCodes}
            scale={scale}
            x={
              left +
              widthStartNumbers +
              widthBlades +
              widthCrews +
              widthDivisions +
              widthCrews +
              gap
            }
          />
        )}
        <Crews
          align="end"
          crews={data.crews.map((crew, index) => ({
            crew: crew.start,
            blades: blades && crew.blades,
            highlight: crew.highlight,
            y: index,
          }))}
          scale={scale}
          x={left + widthStartNumbers + widthBlades + widthCrews - gap}
        />
        <Crews
          align="start"
          crews={data.crews.map((crew, index) => ({
            crew: crew.gain !== null ? crew.start : null,
            blades: blades && crew.blades,
            highlight: crew.highlight,
            y: index - (crew.gain ?? 0),
          }))}
          scale={scale}
          x={
            left +
            widthStartNumbers +
            widthBlades +
            widthCrews +
            widthDivisions +
            gap
          }
        />
        <Division
          lines={division.polylines}
          divisionLines={division.divisionLines}
          circles={division.circles}
          skipped={division.skipped}
          rect={division.rect}
          x={left + widthStartNumbers + widthBlades + widthCrews}
        />
        <ExtraText text={extraText} x={16} />
      </g>
    </svg>
  );
};
