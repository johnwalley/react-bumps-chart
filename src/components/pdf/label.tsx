import { G, Line, Text } from '@react-pdf/renderer';

namespace Label {
  export type Props = {
    label: { label: { label: string; pos: number[] }; lines: number[][][] };
    x: number;
  };
}

export const Label = ({ label, x }: Label.Props) => {
  return (
    <G
      transform={`translate(${x} 10)`}
      fill="black"
      textAnchor="middle"
      style={{ fontSize: 12.8 }}
    >
      <Text x={label.label.pos[0]} y={label.label.pos[1]}>
        {label.label.label}
      </Text>
      {label.lines.map((line, index) => (
        <Line
          key={index}
          x1={line[0][0]}
          y1={line[0][1]}
          x2={line[1][0]}
          y2={line[1][1]}
          stroke="black"
          strokeWidth="1"
          dominantBaseline="central"
        />
      ))}
    </G>
  );
};
