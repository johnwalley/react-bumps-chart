import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: absolute;
  width: 100%;
`;

export const Background = ({ data, heightOfOneCrew, numCrews, y }) => {
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
