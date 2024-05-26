import styled from 'styled-components';
import { merge } from 'd3-array';
import { line } from 'd3-shape';
import { voronoi } from 'd3-voronoi';

const StyledSvg = styled.svg`
  position: relative;
  cursor: pointer;
  pointer-events: all;
`;

const Line = styled.path`
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
`;

export const Lines = ({
  data,
  crews,
  heightOfOneCrew,
  numCrews,
  x,
  y,
  blades,
  spoons,
  hover,
  onHoverChange,
}) => {
  const l = line()
    .defined((d) => d.pos !== -1)
    .x((d) => x(d.day))
    .y((d) => y(d.pos));

  const v = voronoi()
    .x(function (d) {
      return x(d.value.day);
    })
    .y(function (d) {
      return y(d.value.pos);
    })
    .extent([
      [0, 0],
      [heightOfOneCrew * 4, heightOfOneCrew * numCrews],
    ]);

  return (
    <StyledSvg width={heightOfOneCrew * 4} height={heightOfOneCrew * numCrews}>
      <g className="lines">
        {crews.map((crew) => (
          <Line
            key={crew.name}
            d={l(crew.values)}
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
                crew.values.map((value) => ({
                  name: crew.name,
                  value: value,
                }))
              )
            )
          )
          .map((polygon, i) => (
            <path
              key={i}
              d={polygon ? 'M' + polygon.join('L') + 'Z' : null}
              fill="none"
              stroke="none"
              pointerEvents="all"
              onMouseEnter={() => onHoverChange(polygon.data.name)}
              onMouseLeave={() => onHoverChange('')}
            />
          ))}
      </g>
    </StyledSvg>
  );
};
