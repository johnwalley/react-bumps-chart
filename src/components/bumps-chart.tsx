import { useMemo } from 'react';
import { merge, range } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { Blade, shortShortNames, abbreviations } from 'react-rowing-blades';

// @ts-ignore - This import is not working
import classes from './bumps-chart.module.css';

import { JoinedInternalEvents } from '../types';
import getStringWidth from '@/utils/get-string-width';
import { line } from 'd3-shape';
import { Delaunay } from 'd3-delaunay';

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

export type BumpsChartProps = {
  data: JoinedInternalEvents;
  blades?: boolean;
  spoons?: boolean;
};

const BumpsChart = ({
  data,
  blades = false,
  spoons = false,
}: BumpsChartProps) => {
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

  const crews = data.crews
    .sort((a, b) => a.values[0].pos - b.values[0].pos)
    .map((crew) => {
      const name = crew.name.replace(/ ?\d+$/g, '');

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
        }
      }

      const match = crew.name.match(/\d+$/);

      const number = match ? +match[0] : null;

      const label = code ? names[code] : name;

      return {
        code,
        number,
        label:
          label +
          (number
            ? ` ${data.set === 'Town Bumps' ? number : roman[number - 1]}`
            : ''),
        name: crew.name,
        values: crew.values,
        valuesSplit: crew.valuesSplit,
      };
    });

  const startPositions = data.crews.map((crew) => crew.values[0].pos);

  const finishPositions = data.crews.map((crew) => {
    const finishIndex =
      crew.values.filter((value: any) => value.pos !== -1).length - 1;

    return crew.values[finishIndex].pos;
  });

  const finishOrder = startPositions.map((x) =>
    finishPositions.findIndex((y) => x === y)
  );

  const numCrews = data.crews.length;

  const placeInDivision: number[] = useMemo(
    () =>
      merge(
        data.divisions[0].divisions.map((division) =>
          range(1, division.size + 1)
        )
      ),
    [data.divisions[0].divisions]
  );

  const scale = 16;

  const maxCrewLength =
    Math.max(
      ...crews.map(
        (crew) =>
          getStringWidth(crew.label, {
            fontFamily: 'Arial',
            fontSize: '11.2px',
          })!
      )
    ) + scale;

  const maxNumberLength =
    Math.max(
      ...crews.map(
        (_crew, i) =>
          getStringWidth(`${i}`, {
            fontFamily: 'Arial',
            fontSize: '11.2px',
          })!
      )
    ) + 3;

  const divisionLabelFits = data.divisions[0].divisions.map((division, i) => {
    const length = getStringWidth(`Division ${i + 1}`, {
      fontFamily: 'Arial',
      fontSize: '11.2px',
    })!;

    if (division.size * scale > length) {
      return true;
    } else {
      return false;
    }
  });

  const xOffset = 1;
  const yOffset = 1;

  const spaceLeft = 20;
  const spaceRight = 0;

  const gap = 3;

  const bladeWidth = 24;

  const width =
    spaceLeft +
    spaceRight +
    2 * maxCrewLength +
    2 * maxNumberLength +
    4 * scale +
    2 * bladeWidth +
    18;

  const height = crews.length * scale + yOffset;

  const x = scaleLinear()
    .domain([0, 4])
    .range([
      xOffset + maxNumberLength + spaceLeft + maxCrewLength + bladeWidth + 9,
      xOffset +
        maxNumberLength +
        spaceLeft +
        maxCrewLength +
        bladeWidth +
        9 +
        4 * scale,
    ]);

  const y = scaleLinear()
    .domain([1, numCrews])
    .range([0.5 * scale + 0.5, (numCrews - 0.5) * scale + 0.5]);

  const l = line<{ day: number; pos: number }>()
    .defined((d) => d.pos !== -1)
    .x((d) => x(d.day))
    .y((d) => y(d.pos));

  const points: any[] = merge(
    data.crews.map((crew) =>
      crew.values.map((value) => ({
        name: crew.name,
        value: value,
      }))
    )
  );

  const delaunay = Delaunay.from(
    points.map((d: any) => [x(d.value.day), y(d.value.pos)])
  );

  const voronoi = delaunay.voronoi([
    xOffset + maxNumberLength + spaceLeft + maxCrewLength + bladeWidth + 9,
    0,
    xOffset +
      maxNumberLength +
      spaceLeft +
      maxCrewLength +
      bladeWidth +
      9 +
      4 * scale,
    height,
  ]);

  const polygons = points.map((point, index) => [
    point,
    voronoi.cellPolygon(index),
  ]);

  return (
    <svg
      className={classes.root}
      viewBox={`0 0 ${width + 2} ${height + 2}`}
      preserveAspectRatio="none"
    >
      <rect
        className={classes.container}
        x={xOffset + spaceLeft}
        y={yOffset}
        width={width - (spaceLeft + spaceRight)}
        height={crews.length * scale}
        vectorEffect="non-scaling-stroke"
      />
      <g>
        {crews.map(
          (_crew, i) =>
            i % 2 === 1 && (
              <rect
                key={i}
                className={classes.zebraStripe}
                x={spaceLeft}
                y={scale * i}
                width={width}
                height={scale}
              />
            )
        )}
      </g>
      <g>
        {data.divisions[0].divisions.slice(1).map((division, i) => (
          <line
            key={i}
            x1={xOffset + spaceLeft}
            y1={(division.start - 1) * scale}
            x2={width}
            y2={(division.start - 1) * scale}
            stroke="black"
            strokeWidth={1}
          />
        ))}
      </g>
      <g className={classes.division}>
        {data.divisions[0].divisions.map((division, i) => (
          <text
            key={i}
            x={spaceLeft / 2}
            y={(division.start + division.size / 2 - 1) * scale}
            transform={`rotate(-90 ${spaceLeft / 2} ${(division.start + division.size / 2 - 1) * scale})`}
          >
            {divisionLabelFits[i] ? `Division ${i + 1}` : `${i + 1}`}
          </text>
        ))}
      </g>
      <g>
        {crews.map((_crew, i) => (
          <text
            className={classes.numberStart}
            x={xOffset + spaceLeft + gap}
            y={yOffset + (i + 0.72) * scale}
          >
            {placeInDivision[i]}
          </text>
        ))}
      </g>
      <g>
        {crews.map((_crew, i) => (
          <text
            className={classes.numberFinish}
            x={width - spaceRight - gap}
            y={yOffset + (i + 0.72) * scale}
          >
            {i + 1}
          </text>
        ))}
      </g>
      <g>
        {crews.map((crew, i) => (
          <text
            className={`${classes.crewStart} ${
              (blades && crew.valuesSplit[0].blades) ||
              (spoons && crew.valuesSplit[0].spoons)
                ? classes.blades
                : ''
            }`}
            x={
              xOffset +
              spaceLeft +
              maxNumberLength +
              maxCrewLength +
              bladeWidth +
              6
            }
            y={yOffset + (i + 0.72) * scale}
          >
            {crew.label}
          </text>
        ))}
      </g>
      <g>
        {crews.map((crew, i) => (
          <g
            key={crew.name}
            transform={`translate(${xOffset + spaceLeft + maxNumberLength + 3 + bladeWidth} ${(i + 0.2) * scale}) scale(-1 1)`}
          >
            <Blade club={crew.code} size={bladeWidth} />
          </g>
        ))}
      </g>
      <g>
        {crews.map((_crew, i) => {
          const crew = crews[finishOrder[i]];

          return (
            <g
              key={crew.name}
              transform={`translate(${width - spaceRight - maxNumberLength - 3 - bladeWidth} ${(i + 0.2) * scale})`}
            >
              <Blade club={crew.code} size={bladeWidth} />
            </g>
          );
        })}
      </g>
      <g>
        {crews.map((_crew, i) => {
          const crew = crews[finishOrder[i]];

          return (
            <text
              className={`${classes.crewFinish} ${
                (blades && crew.valuesSplit[0].blades) ||
                (spoons && crew.valuesSplit[0].spoons)
                  ? classes.blades
                  : ''
              }`}
              x={width - maxNumberLength - maxCrewLength - bladeWidth - 6}
              y={yOffset + (i + 0.72) * scale}
            >
              {crew.label}
            </text>
          );
        })}
      </g>
      <g className={classes.lines}>
        {crews.map((crew) => (
          <path
            key={crew.name}
            className={
              (blades && crew.valuesSplit[0].blades) ||
              (spoons && crew.valuesSplit[0].spoons)
                ? classes.blades
                : ''
            }
            d={l(crew.values) ?? undefined}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      <g>
        {polygons.map((polygon, i) => (
          <path
            key={i}
            d={voronoi.renderCell(i)}
            fill="none"
            stroke="none"
            pointerEvents="all"
            onMouseEnter={() => console.log(polygon[0].name)}
            onMouseLeave={() => console.log('')}
          />
        ))}
      </g>
    </svg>
  );
};

export default BumpsChart;
