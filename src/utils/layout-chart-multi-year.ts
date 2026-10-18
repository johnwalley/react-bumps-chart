import {
  CrewsColumn,
  DivisionLayout,
  LayoutOptions,
  NumbersColumn,
  fontSize,
  getMaxWidth,
  scale,
} from './layout-chart';
import { calculateJoin, markJointYearHeadship } from './calculate-join';
import { Event } from '../types';
import { calculateDivisions } from './calculate-divisions';
import { calculateNumbers } from './calculate-numbers';
import { calculateStripes } from './calculate-stripes';

export type YearLabel = {
  label: { label: string; pos: number[] };
  lines: number[][][];
};

export type JoinLayout = Omit<ReturnType<typeof calculateJoin>, 'height'> & {
  x: number;
};

export type MultiYearChartLayout = {
  width: number;
  height: number;
  labels: { x: number; y: number; labels: YearLabel[] };
  /** Vertical offset of the chart body, below the year labels. */
  y: number;
  stripes: { x: number; stripes: number[][][][] };
  startNumbers: NumbersColumn;
  endNumbers: NumbersColumn;
  startCrews: CrewsColumn;
  endCrews: CrewsColumn;
  joins: JoinLayout[];
  divisions: DivisionLayout[];
};

const sep = 32;
const gap = 5;

/** Calculates the position of every part of a chart of consecutive events. */
export function layoutChartMultiYear(
  data: Event[],
  { measureText, blades = false }: Omit<LayoutOptions, 'bladeIcons'>
): MultiYearChartLayout {
  let height = 0;

  const widthStartCrews =
    getMaxWidth(
      data[0].crews.map((crew) => crew.start),
      measureText
    ) +
    2 * gap;

  const widthEndCrews =
    getMaxWidth(
      data[data.length - 1].crews.map((crew) => crew.end ?? ''),
      measureText
    ) +
    2 * gap;

  const startNumbers = calculateNumbers(data[0]);
  const endNumbers = calculateNumbers(data[data.length - 1]);

  const widthStartNumbers = getMaxWidth(startNumbers, measureText) + gap;
  const widthEndNumbers = getMaxWidth(endNumbers, measureText) + gap;

  const top = 0;

  let xPos = 0;
  let skipFirst = false;

  const joins = [];
  const stripes = [];
  const labels: YearLabel[] = [];

  let xDivisionOffset = 0;
  const xDivisionOffsets: number[] = [0];

  // Copy so marking joint-year headships doesn't mutate the caller's data
  const events = [...data];

  for (let eventNum = 0; eventNum < data.length; eventNum++) {
    const event = data[eventNum];
    let event2 = null;

    if (eventNum < data.length - 1) {
      event2 = data[eventNum + 1];
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
        const tWidth = measureText(nYear);

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
        sep
      );

      if (skipFirst) {
        events[eventNum] = markJointYearHeadship(event, event2!);
      }

      if (h > height) {
        height = h;
      }

      joins.push(join);
    }

    xPos = xPos + scale * event.days + sep;

    xDivisionOffset += event.days * scale + sep;
    xDivisionOffsets.push(xDivisionOffset);
  }

  const divisions = [];

  for (const event of events) {
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

  // Left edge of the first event's divisions
  const x = widthStartNumbers + widthStartCrews + gap;
  const widthEvents = xDivisionOffsets[data.length] - sep;

  return {
    width: x + widthEvents + gap + widthEndCrews + widthEndNumbers,
    height: height + 3 * fontSize,
    labels: { x, y: 20, labels },
    y: 30,
    stripes: { x, stripes },
    startNumbers: { x: gap, numbers: startNumbers },
    endNumbers: {
      x: x + widthEvents + gap + widthEndCrews + widthEndNumbers - gap,
      numbers: endNumbers,
    },
    startCrews: {
      x: widthStartNumbers + widthStartCrews,
      crews: events[0].crews.map((crew, index) => ({
        crew: crew.start,
        blades: blades && crew.blades,
        highlight: crew.highlight,
        y: index,
      })),
    },
    endCrews: {
      x: x + widthEvents + gap,
      crews: data[data.length - 1].crews.map((crew, index) => ({
        crew: crew.gain !== null ? crew.start : null,
        blades: blades && crew.blades,
        highlight: crew.highlight,
        y: index - (crew.gain ?? 0),
      })),
    },
    joins: joins.map((join, index) => ({
      x: x + xDivisionOffsets[index + 1] - sep,
      ...join,
    })),
    divisions: divisions.map((division, index) => ({
      x: x + xDivisionOffsets[index],
      ...division,
    })),
  };
}
