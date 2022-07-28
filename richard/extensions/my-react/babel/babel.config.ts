export const babelConfig = {
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-flow",
    "@babel/preset-typescript",
  ],
  plugins: [
    "module:@babel/plugin-syntax-class-properties",
    ["import", { libraryName: "antd", style: "css" }],
  ],
  sourceMaps: true,
};
