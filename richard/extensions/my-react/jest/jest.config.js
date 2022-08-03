  // Override the Jest config to ignore transpiling from specific folders
  // See the base Jest config: https://bit.cloud/teambit/react/react/~code/jest/jest.config.js

  const reactJestConfig = require("@teambit/react/jest/jest.config");
  // uncomment the line below and install the package if you want to use this function
  const {
    generateNodeModulesPattern,
  } = require("@teambit/dependencies.modules.packages-excluder");

  const cjsTransformer = require.resolve("./cjs-transformer.js");

  // const packagesToExclude = ["antd", "@babel"];

  // const packagesToExclude = ["@weimai/maiui"];

  const object = {
    ...reactJestConfig,
    transformIgnorePatterns: [
      // ...reactJestConfig.transformIgnorePatterns,
      // `/${generateNodeModulesPattern({
      //   packages: packagesToExclude,
      // })}`,
    ],
    transform: {
      ...reactJestConfig.transform,
      "^.+\\.(js|jsx|ts|tsx)$": cjsTransformer,
    },
  };

  console.log("react jest", object);

  module.exports = object;
  // module.exports = {};
