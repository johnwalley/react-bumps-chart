import React, { useMemo, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { line } from 'd3-shape';
import { voronoi } from 'd3-voronoi';
import { merge, range } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import useResizeObserver from 'use-resize-observer';

import { Blade, shortShortNames, abbreviations } from 'react-rowing-blades';

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

const calculateFontSize = (width) => {
  return width < MOBILE_WIDTH ? 10 : 14;
};

const GlobalStyle = createGlobalStyle`
  :root {
    --react-bumps-chart-unselected-opacity: 0.3;
    --react-bumps-chart-stroke-width: 1px;
    --react-bumps-chart-stroke-width-active: 2px;
  }
`;

const Container = styled.div`
  position: relative;
  max-width: 520px;
  min-width: 320px;
  font-family: sans-serif;
  font-size: ${(props) => calculateFontSize(props.$width)}px;
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
  height: ${(props) => props.$height}px;
  justify-content: space-between;
  align-items: center;
  opacity: ${(props) =>
    props.$active ? 1 : 'var(--react-bumps-chart-unselected-opacity)'};
  padding: 0 6px 0 6px;
`;

const BladeWrapper = styled.div`
  flex: 0 0 ${(props) => props.$width}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Position = styled.div`
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
`;

const Label = styled.div`
  flex: 0 0 auto;
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
`;

const StyledBlade = styled(Blade)`
  flex: 0 0 auto;
  transform: ${(props) => (props.$reverse ? 'scale(-1, 1)' : null)};
`;

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

const BumpsChart = ({ data, blades = false, spoons = false }) => {
  const { ref, width = 1 } = useResizeObserver();
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
        ...Object.values(abbreviations.uk).map((x) => ({ [x]: x }))
      );
      break;
    default:
      throw new Error(`${data.set} not recognised as a set`);
  }

  const crews = data.crews
    .sort((a, b) => a.values[0].pos - b.values[0].pos)
    .map((crew) => {
      const name = crew.name.replace(/ ?\d+$/g, '');

      let code = Object.keys(names).find((key) => names[key] === abbr[name]);

      // Couldn't find club code based on abbreviation
      // Search using full name instead
      if (!code) {
        code = Object.keys(names).find((key) => names[key] === name);
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

      const label = code ? names[code] : name;

      return {
        code,
        number,
        label:
          label +
          (number
            ? ` ${data.set === 'Town Bumps' ? number : roman[number - 1]}`
            : ''),
        name: crew.name,
        values: crew.values,
        valuesSplit: crew.valuesSplit,
      };
    });

  const startPositions = data.crews.map((crew) => crew.values[0].pos);

  const finishPositions = data.crews.map((crew) => {
    const finishIndex =
      crew.values.filter((value) => value.pos !== -1).length - 1;

    return crew.values[finishIndex].pos;
  });

  const finishOrder = startPositions.map((x) =>
    finishPositions.findIndex((y) => x === y)
  );

  const numCrews = data.crews.length;

  const x = scaleLinear()
    .domain([0, 4])
    .range([0, heightOfOneCrew * 4]);

  const y = scaleLinear()
    .domain([1, numCrews])
    .range([0.5 * heightOfOneCrew, heightOfOneCrew * (numCrews - 0.5)]);

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

  const Lines = () => (
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
              onMouseEnter={() => setHover(polygon.data.name)}
              onMouseLeave={() => setHover('')}
            />
          ))}
      </g>
    </StyledSvg>
  );

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
        data.divisions[0].divisions.map((division) =>
          range(1, division.size + 1)
        )
      ),
    [data.divisions[0].divisions]
  );

  return (
    <>
      <GlobalStyle />
      <Container ref={ref} $width={width}>
        <Background />
        <Wrapper>
          <Crews>
            {crews.map((d, i) => (
              <Crew
                key={i}
                onMouseEnter={() => setHover(d.name)}
                onMouseLeave={() => setHover('')}
                $active={
                  (blades && d.valuesSplit[0].blades) ||
                  (spoons && d.valuesSplit[0].spoons) ||
                  (!blades && !spoons && (hover === '' || hover === d.name))
                }
                $height={heightOfOneCrew}
              >
                <BladeWrapper $width={bladeWrapperWidth}>
                  <Position
                    $active={
                      (blades && d.valuesSplit[0].blades) ||
                      (spoons && d.valuesSplit[0].spoons) ||
                      (!blades && !spoons && hover === d.name)
                    }
                  >
                    {placeInDivision[i]}
                  </Position>
                  <StyledBlade club={d.code} size={bladeSize} $reverse />
                </BladeWrapper>
                <Label
                  $active={
                    (blades && d.valuesSplit[0].blades) ||
                    (spoons && d.valuesSplit[0].spoons) ||
                    (!blades && !spoons && hover === d.name)
                  }
                >
                  {d.label}
                </Label>
              </Crew>
            ))}
          </Crews>
          <Results>
            <Lines />
          </Results>
          <Crews>
            {crews.map((d, i) => {
              const crew = crews[finishOrder[i]];

              return (
                <Crew
                  key={i}
                  onMouseEnter={() => setHover(crew.name)}
                  onMouseLeave={() => setHover('')}
                  $active={
                    (blades && crew.valuesSplit[0].blades) ||
                    (spoons && crew.valuesSplit[0].spoons) ||
                    (!blades &&
                      !spoons &&
                      (hover === '' || hover === crew.name))
                  }
                  $height={heightOfOneCrew}
                >
                  <Label
                    $active={
                      (blades && crew.valuesSplit[0].blades) ||
                      (spoons && crew.valuesSplit[0].spoons) ||
                      (!blades && !spoons && hover === crew.name)
                    }
                  >
                    {crew.label}
                  </Label>
                  <BladeWrapper $width={bladeWrapperWidth}>
                    <StyledBlade club={crew.code} size={bladeSize} />
                    <Position
                      $active={
                        (blades && crew.valuesSplit[0].blades) ||
                        (spoons && crew.valuesSplit[0].spoons) ||
                        (!blades && !spoons && hover === crew.name)
                      }
                    >
                      {i + 1}
                    </Position>
                  </BladeWrapper>
                </Crew>
              );
            })}
          </Crews>
        </Wrapper>
      </Container>
    </>
  );
};

export default BumpsChart;
