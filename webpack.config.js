
const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);

const INDEX_HTML_PATH = `src/index.html`;

module.exports = ({ mode } = { mode: `development` }) => {
  const isProd = mode === `production`;
  const isDev = mode === `development`;

  const getStyleLoaders = () => [
    isProd ? MiniCssExtractPlugin.loader : `style-loader`,
    `css-loader`
  ];

  const getPlugins = () => {
    const plugins = [new HtmlWebpackPlugin({ template: INDEX_HTML_PATH })];

    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({ filename: `main-[hash:8].css` }));
    }

    return plugins;
  }

  return {
    entry: path.join(__dirname, `src/js/index.js`),
    mode: isProd ? `production` : isDev && `development`,
    output: { filename: isProd ? `main-[hash:8].js` : `main.js` },
    devServer: { port: 4500, open: true },
    module: { rules: [{ test: /\.(css)$/, use: getStyleLoaders() }] },
    plugins: getPlugins()
  };
};
