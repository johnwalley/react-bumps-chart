// @ts-ignore - This import is not working
import classes from './crews.module.css';

export type NumbersProps = {
  align: string;
  crews: string[];
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
      {crews.map((crews, index) => (
        <text key={index} y={(index + 0.5) * scale}>
          {crews}
        </text>
      ))}
    </g>
  );
};
