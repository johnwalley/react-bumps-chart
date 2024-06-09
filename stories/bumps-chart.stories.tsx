import BumpsChart from '../src/components/bumps-chart';
import mockData from '../src/components/mocks.json';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JoinedInternalEvents } from '../src/types';

const meta: Meta<typeof BumpsChart> = {
  component: BumpsChart,
};

export default meta;

type Story = StoryObj<typeof BumpsChart>;

export const MayBumps2018WomensDivisions: Story = {
  name: "May Bumps 2018 - Women's Divisions",

  args: {
    data: mockData.mays_women_2018 as JoinedInternalEvents,
  },
  decorators: [
    (Story) => (
      <>
        <h1>May Bumps 2018 - Women's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const Torpids2017MensDivisions: Story = {
  name: "Torpids 2017 - Men's Divisionss",

  args: {
    data: mockData.torpids_men_2017 as JoinedInternalEvents,
  },
  decorators: [
    (Story) => (
      <>
        <h1>Torpids 2017 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const TownBumps2018MensDivisions: Story = {
  name: "Town Bumps 2018 - Men's Divisions",

  args: {
    data: mockData.town_men_2018 as JoinedInternalEvents,
  },
  decorators: [
    (Story) => (
      <>
        <h1>Town Bumps 2018 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const LentBumps2019MensDivisions: Story = {
  name: "Lent Bumps 2019 - Men's Divisions",

  args: {
    data: mockData.lents_men_2019 as JoinedInternalEvents,
  },
  decorators: [
    (Story) => (
      <>
        <h1>Lent Bumps 2019 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const Eights2023WomensDivisions: Story = {
  name: "Summer Eights 2023 - Women's Divisions",

  args: {
    data: mockData.eights_women_2023 as JoinedInternalEvents,
  },
  decorators: [
    (Story) => (
      <>
        <h1>Summer Eights 2023 - Women's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const InProgressEvent: Story = {
  name: 'In progress event',

  args: {
    data: mockData.in_progress as JoinedInternalEvents,
  },
  decorators: [
    (Story) => (
      <>
        <h1>In progress event</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const Blades: Story = {
  name: 'Blades',
  args: {
    blades: true,
    data: mockData.mays_women_2018 as JoinedInternalEvents,
  },
  decorators: [
    (Story) => (
      <>
        <h1>May Bumps 2018 - Women's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};
