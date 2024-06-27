export interface Event {
  set: string;
  short: string;
  gender: string;
  year: string;
  days: number;
  distance: number;
  flags: string[];
  div_size: number[][];
  results: string[];
  pace: unknown[];
  move: any[];
  back: any[];
  completed: any[];
  skip: any[];
  crews_withdrawn: number;
  crews: Crew[];
  full_set: boolean;
}

interface Crew {
  gain: number | null;
  blades: boolean;
  highlight: boolean;
  withdrawn: boolean;
  start: string;
  num_name: string;
  club: string;
  number: number;
  end: string;
}

export const Gender = {
  MEN: 'Men',
  WOMEN: 'Women',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const Set = {
  EIGHTS: 'Summer Eights',
  TORPIDS: 'Torpids',
  LENTS: 'Lent Bumps',
  MAYS: 'May Bumps',
  TOWN: 'Town Bumps',
} as const;

export type Set = (typeof Set)[keyof typeof Set];
