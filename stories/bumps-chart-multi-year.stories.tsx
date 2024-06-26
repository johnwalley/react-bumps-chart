import { BumpsChartMultiYear } from '../src/components/bumps-chart-multi-year';
import mays2022_men from './mays2022_men.json';
import mays2023_men from './mays2023_men.json';
import mays2024_men from './mays2024_men.json';

import mays18451_men from './mays1845.1_men.json';
import mays18452_men from './mays1845.2_men.json';
import mays18461_men from './mays1846.1_men.json';
import mays18462_men from './mays1846.2_men.json';

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BumpsChartMultiYear> = {
  component: BumpsChartMultiYear,
};

export default meta;

type Story = StoryObj<typeof BumpsChartMultiYear>;

export const MayBumpsMensDivisions: Story = {
  name: "May Bumps - Men's Divisions",

  args: {
    data: [mays2022_men, mays2023_men, mays2024_men],
  },
  decorators: [
    (Story) => (
      <>
        <h1>May Bumps - Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const MayBumps1845MensDivisions: Story = {
  name: "May Bumps - Men's Divisions",

  args: {
    data: [mays18451_men, mays18452_men, mays18461_men, mays18462_men],
  },
  decorators: [
    (Story) => (
      <>
        <h1>May Bumps - 1845- Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </>
    ),
  ],
};

export const DarkMode: Story = {
  name: "May Bumps - Men's Divisions",

  args: {
    data: [mays18451_men, mays18452_men, mays18461_men, mays18462_men],
  },
  decorators: [
    (Story) => (
      <div className="dark" style={{ backgroundColor: 'black' }}>
        <h1>May Bumps - 1845- Men's Divisions</h1>
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
};
