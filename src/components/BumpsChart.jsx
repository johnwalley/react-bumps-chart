import React, { useState } from 'react';
import styled from 'styled-components';
import { line } from 'd3-shape';
import { voronoi } from 'd3-voronoi';
import { merge } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import ContainerDimensions from 'react-container-dimensions';
import Blade, { shortShortNames, abbreviations } from 'react-rowing-blades';

const UNSELECTED_OPACITY = 0.7;

const roman = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
];

const heightOfOneCrew = 24;

const Container = styled.div`
  position: relative;
  max-width: 800px;
`;

const Wrapper = styled.div`
  position: relative;
  top: -100%;
  font-family: sans-serif;
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
`;

const Crews = styled.div`
  flex: 2 1 0;
  cursor: pointer;
`;

const Results = styled.div`
  flex: 0 0 auto;
`;

const Crew = styled.div`
  display: flex;
  height: ${heightOfOneCrew}px;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => (props.active ? 1 : UNSELECTED_OPACITY)};
  padding: 0 10px 0 10px;
`;

const BladeWrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  width: 70px;
  justify-content: space-between;
  align-items: center;
`;

const Position = styled.div`
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
`;

const Label = styled.div`
  flex: 0 0 auto;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
`;

const StyledBlade = styled(Blade)`
  flex: 0 0 auto;
  transform: scale(-1, 1);
`;

const StyledSvg = styled.svg`
  position: relative;
  cursor: pointer;
  pointer-events: all;
`;

const Line = styled.path`
  fill: none;
  stroke: black;
  stroke-width: ${props => (props.active ? '2px' : '1px')};
  stroke-dasharray: ${props =>
    props.blades ? '10,5' : props.spoons ? '5,5' : null};
  opacity: ${props => (props.active ? 1 : UNSELECTED_OPACITY)};
`;

const BumpsChart = ({ data }) => {
  const [hover, setHover] = useState('');

  let names;
  let abbr;

  switch (data.set) {
    case 'May Bumps':
      names = shortShortNames.cambridge;
      abbr = abbreviations.cambridge;
      break;
    case 'Torpids':
      names = shortShortNames.oxford;
      abbr = abbreviations.oxford;
      break;
  }

  const crews = data.crews.map(crew => {
    return {
      code: Object.keys(names).find(
        key => names[key] === abbr[crew.name.replace(/\d/g, '')]
      ),
      number: +crew.name.match(/\d+/),
      name: crew.name,
    };
  });

  const startPositions = data.crews.map(crew => crew.values[0].pos);
  const finishPositions = data.crews.map(crew => crew.values[4].pos);

  const finishOrder = startPositions.map(x =>
    finishPositions.findIndex(y => x === y)
  );

  const numCrews = data.crews.length;

  const x = scaleLinear()
    .domain([0, 4])
    .range([0, heightOfOneCrew * 4]);

  const y = scaleLinear()
    .domain([1, numCrews])
    .range([0.5 * heightOfOneCrew, heightOfOneCrew * (numCrews - 0.5)]);

  const l = line()
    .x(d => x(d.day))
    .y(d => y(d.pos));

  const v = voronoi()
    .x(function(d) {
      return x(d.value.day);
    })
    .y(function(d) {
      return y(d.value.pos);
    })
    .extent([[0, 0], [heightOfOneCrew * 4, heightOfOneCrew * numCrews]]);

  const Lines = () => {
    return (
      <StyledSvg
        width={heightOfOneCrew * 4}
        height={heightOfOneCrew * numCrews}
      >
        <g className="lines">
          {data.crews.map(crew => (
            <Line
              key={crew.name}
              d={l(crew.values)}
              active={hover === '' || hover === crew.name}
              blades={crew.valuesSplit[0].blades}
              spoons={crew.valuesSplit[0].spoons}
            />
          ))}
        </g>
        <g className="touch-areas">
          {v
            .polygons(
              merge(
                data.crews.map(crew =>
                  crew.values.map(value => ({ name: crew.name, value: value }))
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
                onMouseEnter={() => setHover(polygon.data.name)}
                onMouseLeave={() => setHover('')}
              />
            ))}
        </g>
      </StyledSvg>
    );
  };

  const Background = () => {
    return (
      <div
        style={{
          position: 'absolute',
          cursor: 'pointer',
          pointerEvents: 'all',
          width: '100%',
        }}
      >
        <svg
          style={{
            cursor: 'pointer',
            pointerEvents: 'all',
          }}
          height={heightOfOneCrew * numCrews}
          width="100%"
        >
          <g className="zebra-stripes">
            {data.crews.map((d, i) => (
              <rect
                key={i}
                x={0}
                y={i * heightOfOneCrew - 0.5}
                width="100%"
                height={heightOfOneCrew}
                fill={i % 2 ? '#f2f2f2' : 'none'}
                stroke="none"
              />
            ))}
          </g>
          <g className="divisions">
            {data.divisions[0].divisions.slice(1).map((division, i) => (
              <line
                key={i}
                x1={0}
                y1={y(division.start - 0.5) - 0.5}
                x2="100%"
                y2={y(division.start - 0.5) - 0.5}
                stroke="grey"
                strokeWidth={1}
              />
            ))}
          </g>
        </svg>
      </div>
    );
  };

  return (
    <Container>
      <Background />
      <Wrapper>
        <Crews>
          {crews.map((d, i) => (
            <Crew
              key={i}
              onMouseEnter={() => setHover(d.name)}
              onMouseLeave={() => setHover('')}
              active={hover === '' || hover === d.name}
            >
              <BladeWrapper>
                <Position active={hover === d.name}>{i + 1}</Position>
                <StyledBlade club={d.code} size={50} />
              </BladeWrapper>
              <Label active={hover === d.name}>
                {names[d.code] + (d.number ? ` ${roman[d.number - 1]}` : '')}
              </Label>
            </Crew>
          ))}
        </Crews>
        <Results>
          <Lines />
        </Results>
        <Crews>
          {crews.map((d, i) => (
            <Crew
              key={i}
              onMouseEnter={() => setHover(crews[finishOrder[i]].name)}
              onMouseLeave={() => setHover('')}
              active={hover === '' || hover === crews[finishOrder[i]].name}
            >
              <Label active={hover === crews[finishOrder[i]].name}>
                {names[crews[finishOrder[i]].code] +
                  (crews[finishOrder[i]].number
                    ? ` ${roman[crews[finishOrder[i]].number - 1]}`
                    : '')}
              </Label>
              <BladeWrapper>
                <Blade club={crews[finishOrder[i]].code} size={50} />
                <Position active={hover === crews[finishOrder[i]].name}>
                  {i + 1}
                </Position>
              </BladeWrapper>
            </Crew>
          ))}
        </Crews>
      </Wrapper>
    </Container>
  );
};

export default BumpsChart;
