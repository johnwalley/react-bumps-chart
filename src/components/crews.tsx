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
    >
      {crews.map((crews, index) => (
        <text key={index} y={(index + 0.5) * scale}>
          {crews}
        </text>
      ))}
    </g>
  );
};
