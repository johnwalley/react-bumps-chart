import { G, Text } from '@react-pdf/renderer';

export type NumbersProps = {
  align: 'start' | 'middle' | 'end';
  crews: {
    crew: string | null;
    blades: boolean;
    highlight: boolean;
    y: number;
  }[];
  scale: number;
  x: number;
};

export const Crews = ({ align, crews, scale, x }: NumbersProps) => {
  return (
    <G
      transform={`translate(${x} 0)`}
      textAnchor={align}
      dominantBaseline="central"
      style={{ fontSize: 12.8 }}
    >
      {crews.map((crew, index) => (
        <Text key={index} y={(index + 0.5) * scale}>
          {crew.crew}
        </Text>
      ))}
    </G>
  );
};
