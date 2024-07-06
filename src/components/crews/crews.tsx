import classNames from 'classnames';

// @ts-ignore - This import is not working
import classes from './crews.module.css';

export type NumbersProps = {
  align: string;
  crews: {
    crew: string | null;
    blades: boolean;
    highlight: boolean;
    y: number;
  }[];
  scale: number;
  x: number;
};

export const Crews = ({ align, crews, scale, x }: NumbersProps) => {
  return (
    <g
      transform={`translate(${x} 0)`}
      textAnchor={align}
      fontSize="12.8"
      fill="black"
      className={classes.root}
    >
      {crews.map((crew, index) => (
        <text
          key={index}
          y={(crew.y + 0.5) * scale}
          dominantBaseline="central"
          className={classNames({
            [classes.blades]: crew.blades,
            [classes.highlight]: crew.highlight,
          })}
        >
          {crew.crew}
        </text>
      ))}
    </g>
  );
};
