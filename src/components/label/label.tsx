// @ts-ignore - This import is not working
import classes from './label.module.css';

namespace Label {
  export type Props = {
    label: { label: { label: string; pos: number[] }; lines: number[][][] };
    x: number;
  };
}

export const Label = ({ label, x }: Label.Props) => {
  return (
    <g
      transform={`translate(${x} 10)`}
      fill="black"
      textAnchor="middle"
      fontSize="12.8px"
    >
      <text
        x={label.label.pos[0]}
        y={label.label.pos[1]}
        className={classes.text}
      >
        {label.label.label}
      </text>
      {label.lines.map((line, index) => (
        <line
          key={index}
          x1={line[0][0]}
          y1={line[0][1]}
          x2={line[1][0]}
          y2={line[1][1]}
          stroke="black"
          strokeWidth="1"
          dominantBaseline="central"
          className={classes.line}
        />
      ))}
    </g>
  );
};
