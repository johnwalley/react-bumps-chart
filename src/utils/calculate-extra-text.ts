import { range } from 'lodash';
import { Event } from '../types';

export function calculateExtraText(event: Event, scale: number) {
  const out = [];

  let top = 0;

  for (const divNum of range(event.div_size[0].length)) {
    let label = null;
    let fontScale = 0.8;
    let fontSize = scale * fontScale;
    let color = 'black';
    let height = event.div_size[0][divNum] * scale;

    label = `Division ${divNum + 1}`;

    out.push({ label, pos: [0, top + height / 2] });

    top = top + height;
  }

  return out;
}
