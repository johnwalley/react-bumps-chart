import { G, Rect } from "@react-pdf/renderer";

export type StripesProps = {
  stripes: number[][][];
  x: number;
};

export const Stripes = ({ stripes, x }: StripesProps) => {
  return (
    <G transform={`translate(${x} 0)`} opacity="0.35" fill="lightgrey">
      {stripes.map((stripe, index) => (
        <Rect
          key={index}
          x={stripe[0][0]}
          y={stripe[0][1]}
          width={stripe[1][0]}
          height={stripe[1][1]}
        />
      ))}
    </G>
  );
};
