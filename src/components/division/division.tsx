import classNames from 'classnames';

// @ts-ignore - This import is not working
import classes from './division.module.css';

export type DivisionProps = {
  lines: { highlight: boolean; points: number[][] }[];
  divisionLines: number[][][];
  skipped: number[][][];
  circles: number[][];
  rect: number[][];
  x: number;
};

export const Division = ({
  lines,
  divisionLines,
  circles,
  rect,
  skipped,
  x,
}: DivisionProps) => {
  return (
    <g transform={`translate(${x} 0)`}>
      {lines.map((line, index) => (
        <polyline
          key={index}
          points={line.points.map((point) => point.join(',')).join(' ')}
          fill="none"
          stroke={line.highlight ? 'red' : 'grey'}
          strokeWidth="1"
          className={classNames(classes.line, {
            [classes.highlight]: line.highlight,
          })}
        />
      ))}
      {divisionLines.map((line, index) => (
        <polyline
          key={index}
          points={line.map((point) => point.join(',')).join(' ')}
          fill="none"
          stroke="grey"
          strokeWidth="1"
          className={classes.line}
        />
      ))}
      {skipped.map((line, index) => (
        <polyline
          key={index}
          points={line.map((point) => point.join(',')).join(' ')}
          fill="none"
          stroke="lightgrey"
          strokeWidth="1"
          className={classes.skipped}
        />
      ))}
      {circles.map((circle, index) => (
        <circle
          key={index}
          cx={circle[0]}
          cy={circle[1]}
          r="3"
          fill="grey"
          className={classes.withdrawn}
        />
      ))}
      <rect
        x={rect[0][0]}
        y={rect[0][1]}
        width={rect[1][0]}
        height={rect[1][1]}
        fill="none"
        stroke="black"
        strokeWidth="1"
        className={classes.border}
      />
    </g>
  );
};
