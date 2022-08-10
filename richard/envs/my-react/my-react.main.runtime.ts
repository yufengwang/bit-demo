import { MainRuntime } from "@teambit/cli";

import type { CompilerMain } from "@teambit/compiler";
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

import { CompilerAspect } from "@teambit/compiler";

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

    const tsModifiers: UseTypescriptModifiers = {
      devConfig: [devConfigTransformer],
      buildConfig: [buildConfigTransformer],
    };

    const babelCompiler = babel.createCompiler({
      babelTransformOptions: babelConfig,
      distDir: "dist",
      distGlobPatterns: [
        `dist/**`,
        `!dist/**/*.d.ts`,
        `!dist/tsconfig.tsbuildinfo`,
      ],
    });

    const compilerOverride = envs.override({
      getCompiler: () => {
        return babelCompiler;
      },
    });

    const transformer = (config) => {
      config
        // .mergeTsConfig(tsconfig)
        .setArtifactName("declaration")
        .setDistGlobPatterns([`dist/**/*.d.ts`])
        .setShouldCopyNonSupportedFiles(false);
      return config;
    };

    const tsCompiler = react.env.getTsEsmCompiler("build", [transformer]);

    const buildPipeOverride = react.overrideBuildPipe([
      compiler.createTask("MyTypescriptCompiler", tsCompiler),
      compiler.createTask("MyBabelCompiler", babelCompiler),
    ]);

    const useWebpack = react.useWebpack(webpackModifiers);
    // const useTs = react.useTypescript(tsModifiers);

    const overrideDependencies = react.overrideDependencies({
      devDependencies: {
        "@babel/plugin-syntax-class-properties": "7.12.13",
        // "@babel/preset-flow": "7.17.12",
        "@babel/preset-react": "7.17.12",
        "@babel/preset-typescript": "7.17.12",
        "babel-plugin-import": "1.13.5",
      },
    });

    // const babelCompiler = babel.createCompiler({
    //   babelTransformOptions: babelConfig,
    // });

    // const babelTask = babelCompiler.createTask("MyBabelCompiler");

    // const overrideCompiler = react.overrideCompiler(babelCompiler);

    // const overrideCompilerTasks = react.overrideCompilerTasks([babelTask]);

    const MyReactEnv = react.compose([
      compilerOverride,
      // useTs,
      useWebpack,
      buildPipeOverride,
      // overrideCompiler,
      // overrideCompilerTasks,
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
