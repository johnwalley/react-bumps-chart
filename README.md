# React Bumps Chart

React Bumps Chart is a library for drawing rowing bumps charts.

[![Version](https://img.shields.io/npm/v/react-bumps-chart.svg?style=flat-square)](https://www.npmjs.com/package/react-bumps-chart)

<img width="533" alt="Screenshot 2019-07-23 at 17 33 12" src="https://user-images.githubusercontent.com/981531/61729810-fda5fe00-ad6f-11e9-9843-9f2f615338db.png">

## Install

`npm install --save react-bumps-chart`

### How to use

```tsx
import 'react-bumps-chart/dist/index.css';

import { BumpsChart, BumpsChartMultiYear, type Event } from 'react-bumps-chart';

const Example = ({ data }: { data: Event }) => <BumpsChart data={data} blades />;

const History = ({ data }: { data: Event[] }) => (
  <BumpsChartMultiYear data={data} />
);
```

### PDF export

PDF versions of both charts are available from `react-bumps-chart/pdf`. They need [`@react-pdf/renderer`](https://react-pdf.org), which you install yourself:

`npm install --save @react-pdf/renderer`

```tsx
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BumpsChart, type Event } from 'react-bumps-chart/pdf';

const Download = ({ data }: { data: Event }) => (
  <PDFDownloadLink document={<BumpsChart data={data} />} fileName="bumps.pdf">
    Download PDF
  </PDFDownloadLink>
);
```

Each PDF component renders a complete `<Document>`, so it can also be passed to `renderToFile` or `pdf()` on the server.

## Development

If you want to develop a component

- `npm i`

- `npm run storybook`

If you want to build

- `npm run build-storybook`

## Documentation

See https://react-bumps-chart.mulberryhousesoftware.com/
