import type { Meta, StoryObj } from '@storybook/react-vite';
import { PDFViewer, usePDF } from '@react-pdf/renderer';

import { BumpsChartMultiYear } from '../src/components/pdf/bumps-chart-multi-year';
import React from 'react';
import mays18451_men from './mays1845.1_men.json';
import mays18452_men from './mays1845.2_men.json';
import mays18461_men from './mays1846.1_men.json';
import mays18462_men from './mays1846.2_men.json';

const meta: Meta<typeof BumpsChartMultiYear> = {
  component: BumpsChartMultiYear,
};

export default meta;

type Story = StoryObj<typeof BumpsChartMultiYear>;

export const MayBumps2023MensDivisions: Story = {
  name: "May Bumps 2023 - Men's Divisions",

  args: {
    data: [mays18451_men, mays18452_men, mays18461_men, mays18462_men],
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
