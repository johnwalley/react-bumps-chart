import { Event } from '../types';

export function calculateNumbers(event: Event, reset = false) {
  const out = [];
  let number = 1;
  let divNum = 0;

  for (const crew of event.crews) {
    out.push(`${number}`);
    number = number + 1;

    if (reset && number - 1 === event.div_size[0][divNum]) {
      number = 1;
      divNum += 1;

      if (divNum >= event.div_size[0].length) {
        break;
      }
    }
  }

  return out;
}
