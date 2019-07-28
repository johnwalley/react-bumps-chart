import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { line } from 'd3-shape';
import { voronoi } from 'd3-voronoi';
import { merge, range } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { withSize } from 'react-sizeme';

import Blade, { shortShortNames, abbreviations } from 'react-rowing-blades';

const UNSELECTED_OPACITY = 0.7;
const MOBILE_WIDTH = 440;

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

const calculateFontSize = width => {
  return width < MOBILE_WIDTH ? 10 : 14;
};

const Container = styled.div`
  position: relative;
  max-width: 520px;
  min-width: 320px;
  font-family: sans-serif;
  font-size: ${props => calculateFontSize(props.width)}px;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  width: 100%;
`;

const Wrapper = styled.div`
  position: relative;
  top: -100%;
  display: flex;
  justify-content: flex-start;
`;

const Crews = styled.div`
  flex: 1 1 0;
  cursor: pointer;
`;

const Results = styled.div`
  flex: 0 0 auto;
`;

const Crew = styled.div`
  display: flex;
  height: ${props => props.height}px;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => (props.active ? 1 : UNSELECTED_OPACITY)};
  padding: 0 6px 0 6px;
`;

const BladeWrapper = styled.div`
  flex: 0 0 ${props => props.width}px;
  display: flex;
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
  transform: ${props => (props.reverse ? 'scale(-1, 1)' : null)};
`;

const StyledSvg = styled.svg`
  position: relative;
  cursor: pointer;
  pointer-events: all;
`;

const Line = styled.path`
  fill: none;
  stroke: black;
  stroke-width: ${props => (props.active ? '1.5px' : '1px')};
  stroke-dasharray: ${props =>
    props.blades ? '10,5' : props.spoons ? '5,5' : null};
  opacity: ${props => (props.active ? 1 : UNSELECTED_OPACITY)};
`;

const BumpsChart = ({ data, size: { width } }) => {
  const [hover, setHover] = useState('');

  const heightOfOneCrew = width < MOBILE_WIDTH ? 12 : 20;
  const bladeSize = width < MOBILE_WIDTH ? 22 : 36;
  const bladeWrapperWidth = width < MOBILE_WIDTH ? 32 : 52;

  let names;
  let abbr;

  switch (data.set) {
    case 'May Bumps':
    case 'Lent Bumps':
      names = shortShortNames.cambridge;
      abbr = abbreviations.cambridge;
      break;
    case 'Summer Eights':
    case 'Torpids':
      names = shortShortNames.oxford;
      abbr = abbreviations.oxford;
      break;
    case 'Town Bumps':
      names = shortShortNames.uk;
      abbr = Object.assign(
        {},
        ...Object.values(abbreviations.uk).map(x => ({ [x]: x }))
      );
      break;
    default:
      throw new Error(`${data.set} not recognised as a set`);
  }

  const crews = data.crews
    .sort((a, b) => a.values[0].pos - b.values[0].pos)
    .map(crew => {
      const name = crew.name.replace(/ ?\d+$/g, '');

      let code = Object.keys(names).find(key => names[key] === abbr[name]);

      // Couldn't find club code based on abbreviation
      // Search using full name instead
      if (!code) {
        code = Object.keys(names).find(key => names[key] === name);
      }

      if (!code) {
        if (name === 'LMBC') {
          code = 'lmb';
        } else if (name === '1st and 3rd') {
          code = 'ftt';
        } else if (name === "St Catharine's") {
          code = 'scc';
        } else if (name === "St Edmund's") {
          code = 'sec';
        }
      }

      const number = +crew.name.match(/\d+$/);

      return {
        code,
        number,
        label:
          names[code] +
          (number
            ? ` ${data.set === 'Town Bumps' ? number : roman[number - 1]}`
            : ''),
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
      <BackgroundContainer>
        <svg height={heightOfOneCrew * numCrews} width="100%">
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
      </BackgroundContainer>
    );
  };

  const placeInDivision = useMemo(
    () =>
      merge(
        data.divisions[0].divisions.map(division => range(1, division.size + 1))
      ),
    [data.divisions[0].divisions]
  );

  return (
    <Container width={width}>
      <Background />
      <Wrapper>
        <Crews>
          {crews.map((d, i) => (
            <Crew
              key={i}
              onMouseEnter={() => setHover(d.name)}
              onMouseLeave={() => setHover('')}
              active={hover === '' || hover === d.name}
              height={heightOfOneCrew}
            >
              <BladeWrapper width={bladeWrapperWidth}>
                <Position active={hover === d.name}>
                  {placeInDivision[i]}
                </Position>
                <StyledBlade club={d.code} size={bladeSize} reverse />
              </BladeWrapper>
              <Label active={hover === d.name}>{d.label}</Label>
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
              height={heightOfOneCrew}
            >
              <Label active={hover === crews[finishOrder[i]].name}>
                {crews[finishOrder[i]].label}
              </Label>
              <BladeWrapper width={bladeWrapperWidth}>
                <StyledBlade
                  club={crews[finishOrder[i]].code}
                  size={bladeSize}
                />
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

export default withSize()(BumpsChart);
