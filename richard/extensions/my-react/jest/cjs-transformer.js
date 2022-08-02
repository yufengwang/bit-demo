/* eslint-disable import/order */
/* eslint-disable global-require */
const { generateProcessFunc } = require("./base-transformer-process");
const { basePlugins } = require("./base-transformer-plugins");
const { basePresets } = require("./base-transformer-presets");

const presets = [
  ...basePresets,
  [
    require("@babel/preset-env"),
    {
      targets: {
        node: 12,
      },
      useBuiltIns: "usage",
      corejs: 3,
    },
  ],
];

const plugins = [
  [require("@babel/plugin-transform-modules-commonjs")],
  ...basePlugins,
  [
    "import",
    { libraryName: "antd", libraryDirectory: "es", style: true },
    "antd",
  ],
  [
    "import",
    {
      libraryName: "@weimai/maiui",
      libraryDirectory: "es",
      style: true,
    },
    "@weimai/maiui",
  ],
];

module.exports = {
  process: generateProcessFunc(presets, plugins),
};
