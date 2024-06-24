import { useMemo } from 'react';
import { merge, range } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { Blade, shortShortNames, abbreviations } from 'react-rowing-blades';

// @ts-ignore - This import is not working
import classes from './bumps-chart.module.css';

import { Event } from '../../types';
import getStringWidth from '@/utils/get-string-width';
import { line } from 'd3-shape';
import { Delaunay } from 'd3-delaunay';
import { calculateDivisions } from '@/utils/calculate-divisions';
import { Numbers } from '../numbers';
import { calculateNumbers } from '@/utils/calculate-numbers';
import { caluclateJoin as calculateJoin } from '@/utils/calculate-join';
import { Join } from './join';
import { Division } from './division';
import { Crews } from './crews';

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Svg,
} from '@react-pdf/renderer';

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
const xOffset = 10;

const styles = StyleSheet.create({
  page: {},
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

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
  const tLeft = 100;
  const tRight = 100;

  const startNumbers = data.div_size[0].flatMap((size) =>
    Array.from({ length: size }, (_, i) => String(i + 1))
  );

  const endNumbers = Array.from({ length: data.crews.length }, (_, i) =>
    String(i + 1)
  );

  const division = calculateDivisions(data, scale);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Svg width="400" height="1200" style={{ width: 400, height: 1200 }}>
          <Crews
            align="end"
            crews={data.crews.map((crew) => crew.start)}
            scale={scale}
            x={left + 32 + tLeft}
          />
          <Crews
            align="start"
            crews={data.crews.map((crew) => crew.end)}
            scale={scale}
            x={left + 32 + tLeft + 3 + data.days * scale + 3}
          />
          <Division lines={division.polylines} x={left + 32 + tLeft + 3} />
        </Svg>
      </Page>
    </Document>
  );
};
