const withCSS = require("@zeit/next-css");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = withCSS({
  webpack(config, options) {
    config.plugins.push(new MonacoWebpackPlugin());
    return config;
  },
  cssLoaderOptions: { url: false },
});
