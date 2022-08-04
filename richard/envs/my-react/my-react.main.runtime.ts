import { MainRuntime } from "@teambit/cli";
import {
  ReactAspect,
  ReactMain,
  UseWebpackModifiers,
  UseTypescriptModifiers,
} from "@teambit/react";
import { EnvsAspect, EnvsMain } from "@teambit/envs";
import { MyReactAspect } from "./my-react.aspect";
import { BabelAspect, BabelMain } from "@teambit/babel";
import { babelConfig } from "./babel/babel.config";
import {
  previewConfigTransformer,
  devServerConfigTransformer,
} from "./webpack/webpack-transformers";
import {
 devConfigTransformer,
 buildConfigTransformer,
} from "./typescript/ts-transformer";

export class MyReactMain {
  static slots = [];

  static dependencies = [ReactAspect, EnvsAspect, BabelAspect];

  static runtime = MainRuntime;

  static async provider([react, envs, babel]: [
    ReactMain,
    EnvsMain,
    BabelMain
  ]) {
    const webpackModifiers: UseWebpackModifiers = {
      previewConfig: [previewConfigTransformer],
      devServerConfig: [devServerConfigTransformer],
    };

    const tsModifiers: UseTypescriptModifiers = {
     devConfig: [devConfigTransformer],
     buildConfig: [buildConfigTransformer],
    };
    //

    const useWebpack = react.useWebpack(webpackModifiers);
    const useTs = react.useTypescript(tsModifiers)

    const overrideDependencies = react.overrideDependencies({
      devDependencies: {
        "@babel/plugin-syntax-class-properties": "7.12.13",
        // "@babel/preset-flow": "7.17.12",
        "@babel/preset-react": "7.17.12",
        "@babel/preset-typescript": "7.17.12",
        "babel-plugin-import": "1.13.5",
      },
    });

    const babelCompiler = babel.createCompiler({
      babelTransformOptions: babelConfig,
    });

    const babelTask = babelCompiler.createTask("MyBabelCompiler");

    const overrideCompiler = react.overrideCompiler(babelCompiler);

    const overrideCompilerTasks = react.overrideCompilerTasks([babelTask]);

    const MyReactEnv = react.compose([
      useTs,
      useWebpack,
      overrideCompiler,
      overrideCompilerTasks,
      overrideDependencies,
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
    ]);
    envs.registerEnv(MyReactEnv);
    return new MyReactMain();
  }
}

MyReactAspect.addRuntime(MyReactMain);
