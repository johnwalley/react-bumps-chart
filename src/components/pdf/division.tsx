import { Circle, G, Polyline, Rect } from "@react-pdf/renderer";

export type DivisionProps = {
  lines: number[][][];
  skipped: number[][][];
  circles: number[][];
  rect: number[][];
  x: number;
};

export const Division = ({
  lines,
  circles,
  rect,
  skipped,
  x,
}: DivisionProps) => {
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
      {skipped.map((line, index) => (
        <Polyline
          key={index}
          points={line.map((point) => point.join(',')).join(' ')}
          fill="none"
          stroke="lightgrey"
          strokeWidth="1"
        />
      ))}
      {circles.map((circle, index) => (
        <Circle key={index} cx={circle[0]} cy={circle[1]} r="3" fill="grey" />
      ))}
      <Rect
        x={rect[0][0]}
        y={rect[0][1]}
        width={rect[1][0]}
        height={rect[1][1]}
        fill="none"
        stroke="black"
        strokeWidth="1"
      />
    </G>
  );
};
