export const babelConfig = {
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
        targets: "> 0.25%, not dead",
      },
    ],
    "@babel/preset-flow",
    "@babel/preset-typescript",
  ],
  plugins: [
    "module:@babel/plugin-syntax-class-properties",
    ["import", { libraryName: "antd", style: true }],
  ],
  sourceMaps: true,
};
