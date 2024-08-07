import { G, Text, Polyline, Line } from '@react-pdf/renderer';

export type JoinProps = {
  lines: number[][][];
  joins: number[][][];
  text: { label: string; pos: number[] }[];
  x: number;
};

export const Join = ({ lines, joins, text, x }: JoinProps) => {
  return (
    <G transform={`translate(${x} 0)`} style={{ fontSize: 9 }}>
      {lines.map((line, index) => (
        <Line
          key={index}
          x1={line[0][0]}
          y1={line[0][1]}
          x2={line[1][0]}
          y2={line[1][1]}
          stroke="lightgrey"
          fill="none"
          strokeWidth="1"
        />
      ))}
      {joins.map((line, index) => (
        <Polyline
          key={index}
          points={line.map((point) => point.join(',')).join(' ')}
          fill="none"
          stroke="grey"
          strokeWidth="1"
        />
      ))}
      {text.map((text, index) => (
        <Text
          key={index}
          x={text.pos[0] + 1}
          y={text.pos[1]}
          fill="black"
          stroke="none"
          textAnchor="end"
        >
          {text.label}
        </Text>
      ))}
    </G>
  );
};
