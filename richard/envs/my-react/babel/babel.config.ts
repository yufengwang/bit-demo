const presets = [
  "@babel/preset-react",
  // "@babel/preset-flow",
  "@babel/preset-typescript",
];

const plugins = [
  "@babel/plugin-syntax-class-properties",
  [
    "import",
    { libraryName: "antd", libraryDirectory: "es", style: true },
    "antd",
  ],
  // [
  //   "import",
  //   {
  //     libraryName: "@weimai/maiui",
  //     libraryDirectory: "es",
  //     style: true,
  //   },
  //   "@weimai/maiui",
  // ],
];

export const babelConfig = {
  presets,
  plugins,
  sourceMaps: true,
};
