import styled from 'styled-components';
import { merge } from 'd3-array';
import { line } from 'd3-shape';
import { voronoi } from 'd3-voronoi';

const StyledSvg = styled.svg`
  position: relative;
  cursor: pointer;
  pointer-events: all;
`;

const Line = styled.path<{
  $active: boolean;
  $blades: boolean;
  $spoons: boolean;
}>`
  fill: none;
  stroke: black;
  stroke-width: ${(props) =>
    props.$active
      ? 'var(--react-bumps-chart-stroke-width-active)'
      : 'var(--react-bumps-chart-stroke-width)'};
  stroke-dasharray: ${(props) =>
    props.$blades ? '10,5' : props.$spoons ? '5,5' : null};
  opacity: ${(props) =>
    props.$active ? 1 : 'var(--react-bumps-chart-unselected-opacity)'};
  vector-effect: non-scaling-stroke;
`;

export type LinesProps = {
  data: { crews: any[] };
  crews: any[];
  numCrews: number;
  x: any;
  y: any;
  blades?: boolean;
  spoons?: boolean;
  hover: string;
  onHoverChange: (hover: string) => void;
};

export const Lines = ({
  data,
  crews,
  numCrews,
  x,
  y,
  blades,
  spoons,
  hover,
  onHoverChange,
}: LinesProps) => {
  const l = line()
    .defined((d: any) => d.pos !== -1)
    .x((d: any) => x(d.day))
    .y((d: any) => y(d.pos));

  const v = voronoi()
    .x(function (d: any) {
      return x(d.value.day);
    })
    .y(function (d: any) {
      return y(d.value.pos);
    })
    .extent([
      [0, 0],
      [4, numCrews],
    ]);

  return (
    <StyledSvg viewBox={`0 0 4 ${1.2*numCrews}`} width="100%" height="100%">
      <g className="lines">
        {crews.map((crew) => (
          <Line
            key={crew.name}
            d={l(crew.values) ?? undefined}
            $active={
              (blades && crew.valuesSplit[0].blades) ||
              (spoons && crew.valuesSplit[0].spoons) ||
              (!blades && !spoons && (hover === '' || hover === crew.name))
            }
            $blades={crew.valuesSplit[0].blades}
            $spoons={crew.valuesSplit[0].spoons}
          />
        ))}
      </g>
      <g className="touch-areas">
        {v
          .polygons(
            merge(
              data.crews.map((crew) =>
                crew.values.map((value: any) => ({
                  name: crew.name,
                  value: value,
                }))
              )
            )
          )
          .map((polygon, i) => (
            <path
              key={i}
              d={polygon ? 'M' + polygon.join('L') + 'Z' : undefined}
              fill="none"
              stroke="none"
              pointerEvents="all"
              onMouseEnter={() => onHoverChange((polygon.data as any).name)}
              onMouseLeave={() => onHoverChange('')}
            />
          ))}
      </g>
    </StyledSvg>
  );
};
