import classes from './extra-text.module.css';

namespace ExtraText {
  export type Props = {
    text: { label: string; pos: number[] }[];
    x: number;
  };
}

export const ExtraText = ({ text, x }: ExtraText.Props) => {
  return (
    <g transform={`translate(${x} 0)`}>
      {text.map((text, index) => (
        <text
          key={index}
          x={text.pos[0]}
          y={text.pos[1]}
          fill="black"
          stroke="none"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12.8"
          transform={`rotate(-90 ${text.pos[0]} ${text.pos[1]})`}
          className={classes.text}
        >
          {text.label}
        </text>
      ))}
    </g>
  );
};
