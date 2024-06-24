import { G, Polyline } from "@react-pdf/renderer";

export type DivisionProps = {
  lines: number[][][];
  x: number;
};

export const Division = ({ lines, x }: DivisionProps) => {
  return (
    <G transform={`translate(${x} 0)`}>
      {lines.map((line, index) => (
        <Polyline
          key={index}
          points={line.map((point) => point.join(',')).join(' ')}
          fill="none"
          stroke="grey"
          strokeWidth="1"
        />
      ))}
    </G>
  );
};
