import { abbreviations, shortShortNames } from 'react-rowing-blades';

// Clubs whose names in the results don't match react-rowing-blades
const fallbacks: Record<string, string> = {
  LMBC: 'lmb',
  '1st and 3rd': 'ftt',
  "St Catharine's": 'scc',
  "St Edmund's": 'sec',
  Town: 'cam',
  'Old Cantabs': 'cab',
};

function getClubNames(set: string): {
  names: Record<string, string>;
  abbr: Record<string, string>;
} {
  switch (set) {
    case 'May Bumps':
    case 'Lent Bumps':
      return {
        names: shortShortNames.cambridge,
        abbr: abbreviations.cambridge,
      };
    case 'Summer Eights':
    case 'Torpids':
      return { names: shortShortNames.oxford, abbr: abbreviations.oxford };
    case 'Town Bumps':
      return {
        names: shortShortNames.uk,
        abbr: Object.assign(
          {},
          ...Object.values(abbreviations.uk).map((x: any) => ({ [x]: x }))
        ),
      };
    default:
      throw new Error(`${set} not recognised as a set`);
  }
}

/**
 * Returns a function that looks up the react-rowing-blades club code for a
 * club name in the given set, e.g. "Caius" in May Bumps -> "cai".
 */
export function getClubCode(set: string) {
  const { names, abbr } = getClubNames(set);

  return (name: string): string | undefined =>
    Object.keys(names).find((key) => names[key] === abbr[name]) ??
    Object.keys(names).find((key) => names[key] === name) ??
    fallbacks[name];
}
