module.exports = {
  title: 'React Bumps Chart',
  pagePerSection: false,
  sections: [
    {
      name: 'React Bumps Chart',
      content: 'docs/ReactBumpsChart.md',
    },
    {
      name: 'Getting Started',
      content: 'docs/GetStarted.md',
    },
    {
      name: 'Components',
      components: './src/**/[A-Z]*.jsx',
      exampleMode: 'expand',
      usageMode: 'expand',
    },
  ],
};
