import { Event } from '../types';
import { calculateDivisions } from './calculate-divisions';
import { calculateExtraText } from './calculate-extra-text';
import { calculateNumbers } from './calculate-numbers';
import { calculateStripes } from './calculate-stripes';
import { getClubCode } from './get-club-code';

/** Returns the rendered width of `text` at the chart's font size. */
export type MeasureText = (text: string) => number;

export type LayoutOptions = {
  measureText: MeasureText;
  blades?: boolean;
  /** Reserve columns for club blade icons. Off for PDF, which can't draw them. */
  bladeIcons?: boolean;
};

export type CrewLabel = {
  crew: string | null;
  blades: boolean;
  highlight: boolean;
  y: number;
};

export type NumbersColumn = { x: number; numbers: string[] };
export type CrewsColumn = { x: number; crews: CrewLabel[] };
export type BladesColumn = { x: number; clubs: (string | undefined)[] };
export type DivisionLayout = Omit<
  ReturnType<typeof calculateDivisions>,
  'height'
> & { x: number };

export type ChartLayout = {
  width: number;
  height: number;
  /** Vertical offset of the chart body. */
  y: number;
  stripes: number[][][];
  startNumbers: NumbersColumn;
  endNumbers: NumbersColumn;
  startBlades: BladesColumn | null;
  endBlades: BladesColumn | null;
  startCrews: CrewsColumn;
  endCrews: CrewsColumn;
  division: DivisionLayout;
  extraText: { x: number; text: { label: string; pos: number[] }[] };
};

export const scale = 16;
export const fontSize = 12.8;

const sep = 32;
const gap = 3;
const xOffset = 0;
const bladesWidth = 32;

export function getMaxWidth(strings: string[], measureText: MeasureText) {
  return Math.max(...strings.map((str) => measureText(`${str}`)));
}

/** Calculates the position of every part of a single-event chart. */
export function layoutChart(
  event: Event,
  { measureText, blades = false, bladeIcons = true }: LayoutOptions
): ChartLayout {
  const left = xOffset + scale * 2;
  const right = gap;

  const widthDivisions = event.days * scale;
  const widthBlades = bladeIcons ? bladesWidth : 0;

  // TODO: Crews who start are not necessarily the same as crews who end
  const widthCrews =
    getMaxWidth(
      event.crews.map((crew) => crew.start),
      measureText
    ) +
    2 * gap;

  const startNumbers = calculateNumbers(event, true);
  const endNumbers = calculateNumbers(event, false);

  const widthStartNumbers = getMaxWidth(startNumbers, measureText) + gap;
  const widthEndNumbers = getMaxWidth(endNumbers, measureText) + gap;

  const widthBeforeDivisions = widthStartNumbers + widthBlades + widthCrews;
  const widthAfterDivisions = widthCrews + widthBlades + widthEndNumbers;
  const widthInner =
    widthBeforeDivisions + widthDivisions + widthAfterDivisions;

  const { height: _height, ...division } = calculateDivisions(
    event,
    scale,
    widthBeforeDivisions,
    widthAfterDivisions,
    blades
  );

  const clubCode = bladeIcons ? getClubCode(event.set) : null;

  return {
    width: left + widthInner + right,
    height: 2 * gap + event.crews.length * scale,
    y: gap,
    stripes: calculateStripes(event, null, scale, left, widthInner, sep),
    startNumbers: { x: left + gap, numbers: startNumbers },
    endNumbers: { x: left + widthInner - gap, numbers: endNumbers },
    startBlades: clubCode && {
      x: left + widthStartNumbers + widthBlades - gap,
      clubs: event.crews.map((crew) => clubCode(crew.club)),
    },
    endBlades:
      clubCode && event.results.length > 0
        ? {
            x: left + widthBeforeDivisions + widthDivisions + widthCrews + gap,
            clubs: event.crews.map((crew) =>
              crew.end && crew.club_end ? clubCode(crew.club_end) : undefined
            ),
          }
        : null,
    startCrews: {
      x: left + widthBeforeDivisions - gap,
      crews: event.crews.map((crew, index) => ({
        crew: crew.start,
        blades: blades && crew.blades,
        highlight: crew.highlight,
        y: index,
      })),
    },
    endCrews: {
      x: left + widthBeforeDivisions + widthDivisions + gap,
      crews: event.crews.map((crew, index) => ({
        crew: crew.gain !== null ? crew.start : null,
        blades: blades && crew.blades,
        highlight: crew.highlight,
        y: index - (crew.gain ?? 0),
      })),
    },
    division: { x: left + widthBeforeDivisions, ...division },
    extraText: { x: 16, text: calculateExtraText(event, scale) },
  };
}
