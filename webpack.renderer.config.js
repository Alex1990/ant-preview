const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const { VueLoaderPlugin } = require('vue-loader');

rules.push(
  {
    test: /\.css$/,
    use: [
      { loader: 'vue-style-loader' },
      { loader: 'css-loader' },
    ],
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
  },
);

module.exports = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
