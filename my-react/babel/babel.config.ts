const presets = [
  [
    "@babel/preset-react",
    {
      runtime: "automatic",
      targets: "> 0.25%, not dead",
    },
  ],
  "@babel/preset-flow",
  "@babel/preset-typescript",
];
const plugins = [
  "module:@babel/plugin-syntax-class-properties",
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

export const babelConfig = {
  presets,
  plugins,
  sourceMaps: true,
};
