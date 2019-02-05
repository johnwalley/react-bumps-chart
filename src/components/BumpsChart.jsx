import React, { useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import Blade, { shortShortNames, abbreviations } from 'react-rowing-blades';

console.log(shortShortNames);

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

const Container = styled.div``;

const Wrapper = styled.div`
  position: relative;
  font-family: sans-serif;
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
`;

const Crews = styled.div`
  flex: 0 0 180px;
  cursor: pointer;
`;

const Results = styled.div`
  flex: 0 0 90px;
`;

const Crew = styled.div`
  display: flex;
  height: 20px;
  justify-content: space-between;
`;

const BladeWrapper = styled.div`
  width: 58px;
  display: flex;
  justify-content: space-between;
`;

const Position = styled.div`
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
`;

const Label = styled.div`
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
`;

const StyledBlade = styled(Blade)`
  transform: scale(-1, 1);
`;

const Line = styled.path`
  fill: none;
  stroke: black;
  stroke-width: ${props => (props.active ? '2px' : '1px')};
`;

const BumpsChart = ({ data }) => {
  const [hover, setHover] = useState('');

  const crews = data.crews.map(crew => {
    return {
      code: Object.keys(shortShortNames.cambridge).find(
        key =>
          shortShortNames.cambridge[key] ===
          abbreviations.cambridge[crew.name.replace(/\d/g, '')]
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
  const heightOfOneCrew = 20;

  const x = d3
    .scaleLinear()
    .domain([0, 4])
    .range([5, heightOfOneCrew * 4 + 5]);

  const y = d3
    .scaleLinear()
    .domain([1, numCrews])
    .range([0.5 * heightOfOneCrew, heightOfOneCrew * (numCrews - 0.5)]);

  const line = d3
    .line()
    .x(d => x(d.day))
    .y(d => y(d.pos));

  const voronoi = d3
    .voronoi()
    .x(function(d) {
      return x(d.value.day);
    })
    .y(function(d) {
      return y(d.value.pos);
    })
    .extent([[0, 0], [heightOfOneCrew * 4 + 10, heightOfOneCrew * numCrews]]);

  const Lines = () => {
    return (
      <svg
        style={{
          position: 'relative',
          cursor: 'pointer',
          pointerEvents: 'all',
        }}
        width={heightOfOneCrew * 4 + 10}
        height={heightOfOneCrew * numCrews}
      >
        <g className="lines">
          {data.crews.map(crew => (
            <Line
              key={crew.name}
              d={line(crew.values)}
              active={hover === crew.name}
            />
          ))}
        </g>
        <g className="touch-areas">
          {voronoi
            .polygons(
              d3.merge(
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
      </svg>
    );
  };

  const Background = () => {
    return (
      <svg
        style={{
          position: 'absolute',
          cursor: 'pointer',
          pointerEvents: 'all',
        }}
        width={2 * 180 + heightOfOneCrew * 4 + 10}
        height={heightOfOneCrew * numCrews}
      >
        <g className="zebra-stripes">
          {data.crews.map((d, i) => (
            <rect
              x={0}
              y={i * heightOfOneCrew - 0.5}
              width={450}
              height={heightOfOneCrew}
              fill={i % 2 ? '#f2f2f2' : 'none'}
              stroke="none"
            />
          ))}
        </g>
        <g className="divisions">
          {data.divisions[0].divisions.slice(1).map((division, i) => (
            <line
              x1={0}
              y1={y(division.start - 0.5) - 0.5}
              x2={450}
              y2={y(division.start - 0.5) - 0.5}
              stroke="grey"
              strokeWidth={1}
            />
          ))}
        </g>
      </svg>
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
            >
              <BladeWrapper>
                <Position active={hover === d.name}>{i + 1}</Position>
                <StyledBlade club={d.code} size={40} />
              </BladeWrapper>
              <Label active={hover === d.name}>
                {shortShortNames.cambridge[d.code] +
                  (d.number ? ` ${roman[d.number - 1]}` : '')}
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
            >
              <Label active={hover === crews[finishOrder[i]].name}>
                {shortShortNames.cambridge[crews[finishOrder[i]].code] +
                  (d.number ? ` ${roman[d.number - 1]}` : '')}
              </Label>
              <BladeWrapper>
                <Blade club={crews[finishOrder[i]].code} size={40} />
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
