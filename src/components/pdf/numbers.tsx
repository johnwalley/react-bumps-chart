import { G, Text } from "@react-pdf/renderer";

export type NumbersProps = {
  align: string;
  numbers: string[];
  scale: number;
  x: number;
};

export const Numbers = ({ align, numbers, scale, x }: NumbersProps) => {
  return (
    <G
      transform={`translate(${x} 0)`}
      textAnchor={align}
      fontSize="12.8"
      dominantBaseline="central"
    >
      {numbers.map((number, index) => (
        <Text key={index} y={(index + 0.5) * scale}>
          {number}
        </Text>
      ))}
    </G>
  );
};
