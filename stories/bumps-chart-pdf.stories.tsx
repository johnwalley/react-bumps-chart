import { BumpsChart } from '../src/components/pdf/bumps-chart';
import mays2023_men from './mays2023_men.json';
import torpids1858_men from './torpids1858_men.json';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PDFViewer, usePDF } from '@react-pdf/renderer';

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
    (Story) => {
      return (
        <>
          <h1>May Bumps 2023 - Men's Divisions</h1>
          {/*   <a href={instance.url!} download="test.pdf">
            Download
          </a> */}
          <PDFViewer width={'100%'} height={600}>
            <Story />
          </PDFViewer>
        </>
      );
    },
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
