import { BumpsChart } from '../src/components/bumps-chart';
import mays2023_men from './mays2023_men.json';
import mays2023_men_incomplete from './mays2023_men_incomplete.json';
import torpids1858_men from './torpids1858_men.json';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BumpsChart> = {
  component: BumpsChart,
};

export default meta;

type Story = StoryObj<typeof BumpsChart>;

export const MayBumps2023MensDivisions: Story = {
  name: "May Bumps 2023 - Men's Divisions",

  args: {
    data: mays2023_men,
  },
  decorators: [
    (Story) => (
      <>
        <h1>May Bumps 2023 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const MayBumps2023MensDivisionsIncomplete: Story = {
  name: "May Bumps 2023 - Men's Divisions (Incomplete)",

  args: {
    data: mays2023_men_incomplete,
  },
  decorators: [
    (Story) => (
      <>
        <h1>May Bumps 2023 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const Torpids1858MensDivisions: Story = {
  name: "May Bumps 2023 - Men's Divisions",

  args: {
    data: torpids1858_men,
  },
  decorators: [
    (Story) => (
      <>
        <h1>Torpids 1858 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};
