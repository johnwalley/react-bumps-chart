import { G, StyleSheet, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  g: { fontSize: '12.8px' },
});

export type DivisionProps = {
  text: { label: string; pos: number[] }[];
  x: number;
};

export const ExtraText = ({ text, x }: DivisionProps) => {
  return (
    <G transform={`translate(${x} 0)`} style={styles.g}>
      {text.map((text, index) => (
        <Text
          key={index}
          x={text.pos[0]}
          y={text.pos[1]}
          fill="black"
          stroke="none"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`translate(${text.pos[0]} ${text.pos[1]}) rotate(-90 ${text.pos[0]} ${text.pos[1]}) translate(${-text.pos[0]} ${-text.pos[1]})`}
        >
          {text.label}
        </Text>
      ))}
    </G>
  );
};
