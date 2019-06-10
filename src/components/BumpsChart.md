Draw a Bumps Chart.

```jsx
const mockData = require('./mocks');

<>
  <h1>May Bumps 2018 - Women's Divisions</h1>
  <div style={{ width: '320px' }}>
    <BumpsChart data={mockData.mays_women_2018} />
  </div>
</>;
```

```jsx
const mockData = require('./mocks');

<>
  <h1>Torpids 2017 - Men's Divisions</h1>
  <BumpsChart data={mockData.torpids_men_2017} />
</>;
```

```jsx
const mockData = require('./mocks');

<>
  <h1>Town Bumps 2018 - Men's Divisions</h1>
  <BumpsChart data={mockData.town_men_2018} />
</>;
```

```jsx
const mockData = require('./mocks');

<>
  <h1>Lent Bumps 2019 - Men's Divisions</h1>
  <BumpsChart data={mockData.lents_men_2019} />
</>;
```
