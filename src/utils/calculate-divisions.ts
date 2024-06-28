import { range } from 'lodash';
import { Event } from '../types';

export function calculateDivisions(
  event: Event,
  scale: number,
  spaceLeft: number,
  spaceRight: number,
  blades = false
) {
  let top = 0;

  const polylines: { highlight: boolean; points: number[][] }[] = [];
  const divisionLines: number[][][] = [];
  const skippedLines: number[][][] = [];
  const circles = [];

  for (let crewNum = 0; crewNum < event.crews.length; crewNum++) {
    let yPos = top + scale / 2;
    let xPos = 0;
    let c = crewNum;

    let lines = [];
    let skipped = [];
    let points = [];
    let last = [xPos, yPos];

    for (let day = 0; day < event.days; day++) {
      let t = event.move[day];
      let up = t[c];

      let tmp = c;
      let raceDay = true;
      let divRaced = true;

      for (let d = 0; d < event.div_size[day].length; d++) {
        if (tmp < event.div_size[day][d]) {
          if (!event.completed[day][d]) {
            divRaced = false;
          }

          if (
            !divRaced &&
            d > 0 &&
            event.completed[day][d - 1] &&
            up !== null &&
            tmp === 0
          ) {
            divRaced = true;
          }
          break;
        }

        tmp -= event.div_size[day][d];
      }

      if (event.skip[day][c]) {
        raceDay = false;
      }

      if (up === null) {
        if (divRaced) {
          circles.push(last);
        }
        break;
      }

      xPos = xPos + scale;
      yPos = yPos - up * scale;

      if (divRaced && raceDay) {
        if (points.length === 0) {
          points.push(last);
        }

        points.push([xPos, yPos]);
      } else {
        if (points.length > 0) {
          lines.push(points);
          points = [];
        }

        skipped.push([last, [xPos, yPos]]);
      }

      last = [xPos, yPos];

      c = c - up;
    }

    if (points.length > 0) {
      lines.push(points);
    }

    for (const line of lines) {
      polylines.push({
        points: line,
        highlight: blades && event.crews[crewNum].blades,
      });
    }

    for (const line of skipped) {
      skippedLines.push(line);
    }

    top = top + scale;
  }

  const rect = [
    [-spaceLeft, 0],
    [spaceLeft + event.days * scale + spaceRight, event.crews.length * scale],
  ];

  let left = -spaceLeft;
  let right = scale;
  let prevDivHeight = null;

  for (const day of range(event.days)) {
    const divHeight = [];
    let top = 0;

    if (day === event.days - 1) {
      right += spaceRight;
    }

    for (const div of range(event.div_size[day].length - 1)) {
      top += event.div_size[day][div] * scale;
      divHeight.push(top);

      divisionLines.push([
        [left, top],
        [right, top],
      ]);

      if (prevDivHeight !== null && prevDivHeight[div] !== divHeight[div]) {
        divisionLines.push([
          [left, prevDivHeight[div]],
          [left, divHeight[div]],
        ]);
      }
    }

    prevDivHeight = divHeight;
    left = right;
    right += scale;
  }

  return { polylines, circles, rect, skipped: skippedLines, divisionLines };
}
