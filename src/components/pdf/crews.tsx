import { G, Text } from '@react-pdf/renderer';

export type NumbersProps = {
  align: string;
  crews: string[];
  scale: number;
  x: number;
};

export const Crews = ({ align, crews, scale, x }: NumbersProps) => {
  return (
    <G
      transform={`translate(${x} 0)`}
      textAnchor={align as any}
      fontSize="12.8"
      dominantBaseline="central"
    >
      {crews.map((crews, index) => (
        <Text key={index} y={(index + 0.5) * scale} >
          {crews}
        </Text>
      ))}
    </G>
  );
};
