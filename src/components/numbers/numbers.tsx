// @ts-ignore - This import is not working
import classes from './numbers.module.css';

export type NumbersProps = {
  align: string;
  numbers: string[];
  scale: number;
  x: number;
};

export const Numbers = ({ align, numbers, scale, x }: NumbersProps) => {
  return (
    <g
      transform={`translate(${x} 0)`}
      textAnchor={align}
      fontSize="12.8"
      dominantBaseline="central"
      className={classes.root}
    >
      {numbers.map((number, index) => (
        <text key={index} y={(index + 0.5) * scale}>
          {number}
        </text>
      ))}
    </g>
  );
};
