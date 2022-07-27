import { MainRuntime } from "@teambit/cli";
import { ReactAspect, ReactMain, UseWebpackModifiers } from "@teambit/react";

import { BabelAspect, BabelMain } from "@teambit/babel";
import { CompilerAspect, CompilerMain } from "@teambit/compiler";

import { EnvsAspect, EnvsMain } from "@teambit/envs";
import { MyReactAspect } from "./my-react.aspect";
import {
  previewConfigTransformer,
  devServerConfigTransformer,
} from "./webpack/webpack-transformers";

const babelConfig = require("./babel/babel.config.json");

//import {
//  devConfigTransformer,
//  buildConfigTransformer,
//} from "./typescript/ts-transformer";

export class MyReactMain {
  static slots = [];

  static dependencies = [ReactAspect, EnvsAspect, BabelAspect, CompilerAspect];

  static runtime = MainRuntime;

  static async provider([react, envs, babel, compiler]: [
    ReactMain,
    EnvsMain,
    BabelMain,
    CompilerMain
  ]) {
    const webpackModifiers: UseWebpackModifiers = {
      previewConfig: [previewConfigTransformer],
      devServerConfig: [devServerConfigTransformer],
    };

    //const tsModifiers: UseTypescriptModifiers = {
    //  devConfig: [devConfigTransformer],
    //  buildConfig: [buildConfigTransformer],
    //};

    // create a new Babel compiler
    const babelCompiler = babel.createCompiler({
      babelTransformOptions: babelConfig,
    });
    // Get React's build pipeline
    const basicBuildPipeline = react.reactEnv.getBuildPipe();
    console.log("basice...", basicBuildPipeline);
    // Filter out compilation build tasks
    const basicBuildPipelineWithoutCompilation = basicBuildPipeline.filter(
      (task) => task.aspectId !== CompilerAspect.id
    );

    const compilerBuildTask = [
      compiler.createTask("BabelCompiler", babelCompiler),
      ...basicBuildPipelineWithoutCompilation,
    ];

    const overrideObj = {
      getCompiler: () => babelCompiler,
      getBuildPipe: () => compilerBuildTask,
    };

    const compilerTransformer = envs.override(overrideObj);
    const MyReactEnv = react.compose([
      compilerTransformer,
      /**
       * Uncomment to override the config files for TypeScript, Webpack or Jest
       * Your config gets merged with the defaults
       */

      // react.useTypescript(tsModifiers),  // note: this cannot be used in conjunction with react.overrideCompiler
      // react.useWebpack(webpackModifiers),
      // react.overrideJestConfig(require.resolve('./jest/jest.config')),

      /**
       * override the ESLint default config here then check your files for lint errors
       * @example
       * bit lint
       * bit lint --fix
       */
      //react.useEslint({
      //  transformers: [
      //  (config) => {
      //    config.setRule('no-console', ['error']);
      //    return config;
      //    }
      //  ]
      //}),

      /**
       * override the Prettier default config here the check your formatting
       * @example
       * bit format --check
       * bit format
       */
      //react.usePrettier({
      //  transformers: [
      //    (config) => {
      //      config.setKey('tabWidth', 2);
      //      return config;
      //    }
      //  ]
      //}),

      /**
       * override dependencies here
       * @example
       * Uncomment types to include version 17.0.3 of the types package
       */
      react.overrideDependencies({
        devDependencies: {
          // '@types/react': '17.0.3'
        },
      }),
    ]);
    envs.registerEnv(MyReactEnv);
    return new MyReactMain();
  }
}

MyReactAspect.addRuntime(MyReactMain);
