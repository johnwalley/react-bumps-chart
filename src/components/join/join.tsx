import classes from './join.module.css';

namespace Join {
  export type Props = {
    lines: number[][][];
    joins: number[][][];
    text: { label: string; pos: number[] }[];
    x: number;
  };
}

export const Join = ({ lines, joins, text, x }: Join.Props) => {
  return (
    <g transform={`translate(${x} 0)`} fontSize="9px">
      {lines.map((line, index) => (
        <line
          key={index}
          x1={line[0][0]}
          y1={line[0][1]}
          x2={line[1][0]}
          y2={line[1][1]}
          stroke="lightgrey"
          fill="none"
          strokeWidth="1"
          className={classes.line}
        />
      ))}
      {joins.map((line, index) => (
        <polyline
          key={index}
          points={line.map((point) => point.join(',')).join(' ')}
          fill="none"
          stroke="grey"
          strokeWidth="1"
        />
      ))}
      {text.map((text, index) => (
        <text
          key={index}
          x={text.pos[0] + 1}
          y={text.pos[1]}
          fill="black"
          stroke="none"
          textAnchor="end"
          className={classes.text}
        >
          {text.label}
        </text>
      ))}
    </g>
  );
};
