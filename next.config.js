const withCSS = require("@zeit/next-css");
const withFonts = require("next-fonts");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = withCSS(
  withFonts({
    webpack(config, _options) {
      config.plugins.push(new MonacoWebpackPlugin());
      return config;
    },
    cssLoaderOptions: { url: false },
  })
);
