import classes from './stripes.module.css';

namespace Stripes {
  export type Props = {
    stripes: number[][][];
    x: number;
  };
}

export const Stripes = ({ stripes, x }: Stripes.Props) => {
  return (
    <g
      transform={`translate(${x} 0)`}
      fill="lightgrey"
      className={classes.root}
    >
      {stripes.map((stripe, index) => (
        <rect
          key={index}
          x={stripe[0][0]}
          y={stripe[0][1]}
          width={stripe[1][0]}
          height={stripe[1][1]}
        />
      ))}
    </g>
  );
};
