export type JoinedInternalEvents = {
    crews: {
        name: string;
        values: { day: number; pos: number }[];
        valuesSplit: {
            blades: boolean;
            day: number;
            name: string;
            spoons: boolean;
            values: { day: number; pos: number }[];
        }[];
    }[];
    divisions: {
        divisions: { size: number; start: number }[];
        year: number;
        startDay: number;
        numDays: number;
    }[];
    set: Set;
    gender: Gender;
    endYear: number;
    maxCrews: number;
    startYear: number;
};

export type InternalEvent = {
    crews: {
        name: string;
        values: {
            day: number;
            pos: number;
        }[];
        valuesSplit: {
            blades: boolean;
            day: number;
            name: string;
            spoons: boolean;
            values: { day: number; pos: number }[];
        }[];
    }[];
    divisions: {
        start: number;
        size: number;
    }[];
    year: number;
};

export type Event = {
    completed: boolean[][];
    days: number;
    divisions: string[][];
    finish: string[][];
    gender: Gender;
    move: number[][][];
    result: string;
    results: string;
    set: Set;
    small: string;
    year: number;
};

export const Gender = {
    MEN: "Men",
    WOMEN: "Women",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const Set = {
    EIGHTS: "Summer Eights",
    TORPIDS: "Torpids",
    LENTS: "Lent Bumps",
    MAYS: "May Bumps",
    TOWN: "Town Bumps",
} as const;

export type Set = (typeof Set)[keyof typeof Set];
