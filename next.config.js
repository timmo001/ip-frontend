const withCSS = require("@zeit/next-css");
const withFonts = require("next-fonts");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = withCSS(
  withFonts({
    eslint: {
      ignoreDuringBuilds: true,
    },
    webpack5: false,
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 100000,
          },
        },
      });

      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ["javascript", "typescript", "yaml"],
          filename: "static/[name].worker.js",
        })
      );

      return config;
    },
  })
);
