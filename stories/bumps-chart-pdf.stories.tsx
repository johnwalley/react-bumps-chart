import type { Meta, StoryObj } from '@storybook/react-vite';

import { BumpsChart } from '../src/components/pdf/bumps-chart';
import { PDFViewer } from '@react-pdf/renderer';
import React from 'react';
import mays2023_men from './mays2023_men.json';

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
