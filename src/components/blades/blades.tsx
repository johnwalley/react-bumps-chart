import { Blade } from 'react-rowing-blades';
import classes from './blades.module.css';

namespace Blades {
  export type Props = {
    flip?: boolean;
    crews: (string | undefined)[];
    scale: number;
    x: number;
  };
}

export const Blades = ({ flip = false, crews, scale, x }: Blades.Props) => {
  return (
    <g transform={`translate(${x} 0)`} className={classes.root}>
      {crews.map((crew, index) => (
        <g
          key={index}
          transform={`translate(0 ${(index + 0.1) * scale}) scale(${flip ? -1 : 1} 1)`}
        >
          <Blade club={crew} size={1.8 * scale} />
        </g>
      ))}
    </g>
  );
};
