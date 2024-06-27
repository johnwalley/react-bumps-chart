import { Event } from '../types';

export function calculateStripes(
  event: Event,
  event2: Event | null,
  scale: number,
  x: number,
  width: number,
  sep: number
) {
  const out = [];

  const extra = sep;

  let top = 0;
  let alt = 0;
  let num = 0;

  if (event2 !== null) {
    num = event2.crews.length;
  }

  let cn = 0;

  for (const _crew of event.crews) {
    let swidth = width;

    if (cn < num) {
      swidth = swidth + extra;
    }

    if (alt === 1) {
      out.push([
        [x, top],
        [swidth, scale],
      ]);
    }

    alt = 1 - alt;
    top = top + scale;
    cn = cn + 1;
  }

  // TODO: Add line

  return out;
}
