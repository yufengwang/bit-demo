import { MainRuntime } from "@teambit/cli";
import { ReactAspect, ReactMain } from "@teambit/react";
import { EnvsAspect, EnvsMain } from "@teambit/envs";
import { BabelAspect, BabelMain } from "@teambit/babel";
import { BuilderAspect } from "@teambit/builder";
import { MyReactAspect } from "./my-react.aspect";
import { devConfigTransformer as devTsConfigTransformer } from "./typescript/ts-transformer";
import {
  previewConfigTransformer,
  devServerConfigTransformer,
} from "./webpack/webpack-transformers";

import MultiCompilerAspect, {
  MultiCompilerMain,
} from "@teambit/multi-compiler";
import { babelConfig } from "./babel/babel.config";
import { ApplicationAspect } from "@teambit/application";

export class MyReactMain {
  static slots = [];

  static dependencies = [
    ReactAspect,
    EnvsAspect,
    BabelAspect,
    MultiCompilerAspect,
    ApplicationAspect,
    BuilderAspect,
  ];

  static runtime = MainRuntime;

  static async provider([react, envs, babel, multiCompiler]: [
    ReactMain,
    EnvsMain,
    BabelMain,
    MultiCompilerMain
  ]) {
    const overrideDependencies = react.overrideDependencies({
      devDependencies: {
        "@babel/plugin-syntax-class-properties": "7.12.13",
        "@babel/preset-flow": "7.17.12",
        "@babel/preset-react": "7.17.12",
        "@babel/preset-typescript": "7.17.12",
        "babel-plugin-import": "1.13.5",
      },
    });

    const babelCompiler = babel.createCompiler({
      babelTransformOptions: babelConfig,
    });

    const tsCompiler = react.env.getTsEsmCompiler("build", [
      devTsConfigTransformer,
    ]);

    const compiler = multiCompiler.createCompiler(
      [babelCompiler, tsCompiler],
      {}
    );
    const buildPipe = react.env.getBuildPipe({
      tsModifier: { transformers: [devTsConfigTransformer] },
    });

    const useWebpack = react.useWebpack({
      previewConfig: [previewConfigTransformer],
      devServerConfig: [devServerConfigTransformer],
    });

    const overideBuildPipe = react.overrideBuildPipe(buildPipe);

    const overrideCompiler = react.overrideCompiler(compiler);

    const babelTask = babelCompiler.createTask("CustomCompiler");

    const overrideCompilerTasks = react.overrideCompilerTasks([babelTask]);

    const CustomReactEnvEnv = react.compose([
      overrideCompiler,
      overrideCompilerTasks,
      useWebpack,
      overrideDependencies,
      overideBuildPipe,
    ]);

    envs.registerEnv(CustomReactEnvEnv);
    const customReact = new MyReactMain();
    return customReact;
  }
}

MyReactAspect.addRuntime(MyReactMain);
