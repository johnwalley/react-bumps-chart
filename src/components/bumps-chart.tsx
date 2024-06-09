import { useMemo, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { merge, range } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import useResizeObserver from 'use-resize-observer';

import { Blade, shortShortNames, abbreviations } from 'react-rowing-blades';

import { Background } from './background';
import { Lines } from './lines';

import { JoinedInternalEvents } from '../types';

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

const heightOfOneCrewScale = scaleLinear()
  .domain([320, 520])
  .range([12, 20])
  .clamp(true);

const bladeSizeScale = scaleLinear()
  .domain([320, 520])
  .range([22, 36])
  .clamp(true);

const bladeWrapperWidthScale = scaleLinear()
  .domain([320, 520])
  .range([32, 52])
  .clamp(true);

const GlobalStyle = createGlobalStyle`
  :root {
    --react-bumps-chart-unselected-opacity: 0.3;
    --react-bumps-chart-stroke-width: 1.5px;
    --react-bumps-chart-stroke-width-active: 1.5px;
  }
`;

const Container = styled.div`
  container-type: inline-size;
  position: relative;
  max-width: 520px;
  min-width: 320px;
  font-family: sans-serif;
`;

const Wrapper = styled.div`
  position: relative;
  top: -100%;
  display: flex;
  justify-content: flex-start;
  font-size: 10px;

  @container (min-width: 320px) {
    font-size: clamp(10px, 2cqw + 3.6px, 14px);
  }
`;

const Crews = styled.div`
  flex: 1 1 0;
  cursor: pointer;
`;

const Results = styled.div`
  flex: 0 0 48px;

  @container (min-width: 320px) {
    flex: 0 0 clamp(20px, 20cqw + 9.6px, 80px);
  }
`;

const Crew = styled.div<{ $active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${(props) =>
    props.$active ? 1 : 'var(--react-bumps-chart-unselected-opacity)'};
  padding: 0 6px 0 6px;
  overflow: hidden;
`;

const BladeWrapper = styled.div<{}>`
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.div`
  flex: 0 0 auto;
`;

const StyledBlade = styled(Blade)`
  flex: 0 0 auto;
  transform: ${(props) => (props.$reverse ? 'scale(-1, 1)' : null)};
`;

export type BumpsChartProps = {
  data: JoinedInternalEvents;
  blades?: boolean;
  spoons?: boolean;
};

const BumpsChart = ({
  data,
  blades = false,
  spoons = false,
}: BumpsChartProps) => {
  const [hover, setHover] = useState('');

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
        ...Object.values(abbreviations.uk).map((x: any) => ({ [x]: x }))
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

      const match = crew.name.match(/\d+$/);

      const number = match ? +match[0] : null;

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
      crew.values.filter((value: any) => value.pos !== -1).length - 1;

    return crew.values[finishIndex].pos;
  });

  const finishOrder = startPositions.map((x) =>
    finishPositions.findIndex((y) => x === y)
  );

  const numCrews = data.crews.length;

  const x = scaleLinear().domain([0, 4]).range([0, 4]);

  const y = scaleLinear()
    .domain([1, numCrews])
    .range([0.5, numCrews - 0.5]);

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
      <Container>
        <Background data={data} numCrews={numCrews} y={y} />
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
              >
                <BladeWrapper>
                  <div>{placeInDivision[i] as any}</div>
                  <StyledBlade club={d.code} $reverse />
                </BladeWrapper>
                <Label>{d.label}</Label>
              </Crew>
            ))}
          </Crews>
          <Results>
            <Lines
              data={data}
              crews={crews}
              numCrews={numCrews}
              x={x}
              y={y}
              blades={blades}
              spoons={spoons}
              hover={hover}
              onHoverChange={setHover}
            />
          </Results>
          <Crews>
            {crews.map((_d, i) => {
              const crew = crews[finishOrder[i]];

              return (
                <Crew
                  key={i}
                  onMouseEnter={() => {
                    setHover(crew.name);
                  }}
                  onMouseLeave={() => {
                    setHover('');
                  }}
                  $active={
                    (blades && crew.valuesSplit[0].blades) ||
                    (spoons && crew.valuesSplit[0].spoons) ||
                    (!blades &&
                      !spoons &&
                      (hover === '' || hover === crew.name))
                  }
                >
                  <Label>{crew.label}</Label>
                  <BladeWrapper>
                    <StyledBlade club={crew.code} />
                    <div>{i + 1}</div>
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
