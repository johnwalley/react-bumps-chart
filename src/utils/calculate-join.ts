import { Event } from '../types';
import { range } from 'lodash';

export function calculateJoin(
  event: Event,
  event2: Event,
  yOff: number,
  scale: number,
  sep: number
) {
  const lines = [];
  const polylines = [];
  const text = [];

  const added = [];
  const used = range(event.crews.length).map(() => false);
  yOff = yOff + scale / 2;
  const fontSize = scale * 0.6;
  let yNext = yOff + scale * event.crews.length - scale / 2 + 4;
  let ySep = scale * 0.75;
  let verticals = 0;

  for (const crewNum2 of range(event2.crews.length)) {
    if (event2.crews[crewNum2].start.length === 0) {
      continue;
    }

    let found = false;

    let crewNum = 0;

    for (crewNum of range(event.crews.length)) {
      if (
        !used[crewNum] &&
        event2.crews[crewNum2].start === event.crews[crewNum].end
      ) {
        found = true;
        used[crewNum] = true;
        break;
      }
    }

    if (found) {
      lines.push([
        [0, yOff + scale * crewNum],
        [sep, yOff + scale * crewNum2],
      ]);
    } else {
      let height = yOff + scale * crewNum2;
      let adjacent = false;

      if (yNext < height) {
        adjacent = true;
        yNext = height - fontSize / 2;
      } else {
        verticals += 1;
      }

      added.push({
        height,
        adjacent,
        label: yNext,
        crew: event2.crews[crewNum2],
      });

      yNext += ySep;
    }
  }

  const xSep = (sep - 4) / (verticals + 1);
  let xPos = xSep;

  for (const crew of added) {
    text.push({
      label: crew.crew.start,
      pos: [xPos, crew.label + fontSize - 1],
    });

    if (!crew.adjacent) {
      polylines.push([
        [xPos, crew.label],
        [xPos, crew.height],
        [sep, crew.height],
      ]);
      xPos = xPos + xSep;
    }
  }

  return { lines, polylines, text, height: yNext };
}

/**
 * When a year is split across two events, the crew that finishes head of the
 * second event is awarded blades in the first. Returns a copy of `event` with
 * that crew marked.
 */
export function markJointYearHeadship(event: Event, event2: Event): Event {
  const headship = event2.crews[0].end;
  const index = event.crews.findIndex((crew) => crew.start === headship);

  if (index === -1) {
    return event;
  }

  return {
    ...event,
    crews: event.crews.map((crew, i) =>
      i === index ? { ...crew, blades: true } : crew
    ),
  };
}
