import React from 'react';

import { action } from '@storybook/addon-actions';
import BumpsChart from '../src/components/BumpsChart';
import mockData from '../src/components/mocks.json';

export default {
  title: 'BumpsChart',
  component: BumpsChart,
};

export const MayBumps2018WomensDivisions = () => (
  <>
    <h1>May Bumps 2018 - Women's Divisions</h1>
    <div style={{ width: '320px' }}>
      <BumpsChart data={mockData.mays_women_2018} />
    </div>
  </>
);

MayBumps2018WomensDivisions.story = {
  name: "May Bumps 2018 - Women's Divisions",
};

export const Torpids2017MensDivisions = () => (
  <>
    <h1>Torpids 2017 - Men's Divisions</h1>
    <BumpsChart data={mockData.torpids_men_2017} />
  </>
);

Torpids2017MensDivisions.story = {
  name: "Torpids 2017 - Men's Divisions",
};

export const TownBumps2018MensDivisions = () => (
  <>
    <h1>Town Bumps 2018 - Men's Divisions</h1>
    <BumpsChart data={mockData.town_men_2018} />
  </>
);

TownBumps2018MensDivisions.story = {
  name: "Town Bumps 2018 - Men's Divisions",
};

export const LentBumps2019MensDivisions = () => (
  <>
    <h1>Lent Bumps 2019 - Men's Divisions</h1>
    <BumpsChart data={mockData.lents_men_2019} />
  </>
);

LentBumps2019MensDivisions.story = {
  name: "Lent Bumps 2019 - Men's Divisions",
};

export const Eights2023WomensDivisions = () => (
  <>
    <h1>Summer Eights 2023 - Women's Divisions</h1>
    <BumpsChart data={mockData.eights_women_2023} />
  </>
);

Eights2023WomensDivisions.story = {
  name: "Summer Eights 2023 - Women's Divisions",
};

export const InProgressEvent = () => (
  <>
    <h1>In progress event</h1>
    <BumpsChart data={mockData.in_progress} />
  </>
);

InProgressEvent.story = {
  name: 'In progress event',
};
