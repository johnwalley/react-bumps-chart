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
      components: './src/**/[A-Z]*.js',
      exampleMode: 'expand',
      usageMode: 'expand',
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
  },
};
