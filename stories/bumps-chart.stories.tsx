import { BumpsChart } from '../src/components/bumps-chart';
import mays2023_men from './mays2023_men.json';
import mays2023_men_incomplete from './mays2023_men_incomplete.json';
import torpids1858_men from './torpids1858_men.json';
import torpids1975_men from './torpids1975_men.json';
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

export const DarkMode: Story = {
  name: "May Bumps 2023 - Men's Divisions (Dark mode)",

  args: {
    data: mays2023_men,
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ backgroundColor: 'black' }}>
        <h1>May Bumps 2023 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
};

export const Blades: Story = {
  name: "May Bumps 2023 - Men's Divisions (Dark mode)",

  args: {
    data: mays2023_men,
    blades: true,
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ backgroundColor: 'black' }}>
        <h1>May Bumps 2023 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </div>
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
  name: "Torpids 1858 - Men's Divisions",

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

export const Torpids1975MensDivisions: Story = {
  name: "Torpids 1975 - Men's Divisions",

  args: {
    data: torpids1975_men,
  },
  decorators: [
    (Story) => (
      <>
        <h1>Torpids 1975 - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};
