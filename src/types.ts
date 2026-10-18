/** Results of one bumps event, e.g. the 2023 men's May Bumps. */
export interface Event {
  set: string;
  short: string;
  gender: string;
  year: string;
  /** Present on some historical events instead of a plain year. */
  title?: string;
  days: number;
  distance: number;
  flags: string[];
  /** Crews in each division, per day. */
  div_size: number[][];
  results: string[];
  pace: unknown[];
  /**
   * Places moved up each day by the crew starting that day in each position,
   * or null once it's out of the event.
   */
  move: (number | null)[][];
  back: (number | null)[][];
  /** Whether each division completed racing on each day. */
  completed: boolean[][];
  /** Whether the crew in each position sat out each day. */
  skip: boolean[][];
  crews_withdrawn?: number;
  crews: Crew[];
  full_set?: boolean;
}

/** A crew's starting and finishing positions in an event. */
export interface Crew {
  /** Overall places gained, or null if the crew didn't finish. */
  gain: number | null;
  blades: boolean;
  highlight: boolean;
  withdrawn: boolean;
  /** Name of the crew in this starting position. */
  start: string;
  num_name: string;
  club: string;
  number: number;
  /** Name of the crew in this finishing position, if any. */
  end: string | null;
  club_end?: string | null;
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
