import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: absolute;
  width: 100%;
`;

export type BackgroundProps = {
  data: { crews: any[]; divisions: { divisions: any[] }[] };
  numCrews: number;
  y: any;
};

export const Background = ({ data, numCrews, y }: BackgroundProps) => {
  return (
    <BackgroundContainer>
      <svg
        viewBox={`0 0 4 ${numCrews}`}
        height="100%"
        width="100%"
        preserveAspectRatio="xMidYMin slice"
      >
        <g className="zebra-stripes">
          {data.crews.map((_d, i) => (
            <rect
              key={i}
              x={0}
              y={i - 0.5}
              width="4"
              height="1"
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
