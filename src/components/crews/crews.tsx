import classNames from 'classnames';

// @ts-ignore - This import is not working
import classes from './crews.module.css';

export type NumbersProps = {
  align: string;
  crews: { crew: string | null; highlight: boolean; y: number }[];
  scale: number;
  x: number;
};

export const Crews = ({ align, crews, scale, x }: NumbersProps) => {
  return (
    <g
      transform={`translate(${x} 0)`}
      textAnchor={align}
      fontSize="12.8"
      dominantBaseline="central"
      fill="black"
      className={classes.root}
    >
      {crews.map((crew, index) => (
        <text
          key={index}
          y={(crew.y + 0.5) * scale}
          className={classNames({ [classes.highlight]: crew.highlight })}
        >
          {crew.crew}
        </text>
      ))}
    </g>
  );
};
