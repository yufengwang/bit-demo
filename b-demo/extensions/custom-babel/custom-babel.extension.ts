import { EnvsMain, EnvsAspect } from '@teambit/envs';
import { ReactAspect, ReactMain } from '@teambit/react';
import { BabelAspect, BabelMain } from '@teambit/babel';

const babelConfig = require('./babel/babel.config.json');

export class CustomBabelExtension {
  constructor(private react: ReactMain) {}

  static dependencies: any = [EnvsAspect, ReactAspect, BabelAspect];

  static async provider([envs, react, babel]: [
    EnvsMain,
    ReactMain,
    BabelMain
  ]) {
    // create a new Babel compiler
    const babelCompiler = babel.createCompiler({
      babelTransformOptions: babelConfig,
    });

    const harmonyReactEnv = react.compose([
      react.overrideCompiler(babelCompiler),
      react.overrideCompilerTasks([babelCompiler.createTask()]),
    ]);

    envs.registerEnv(harmonyReactEnv);
    return new CustomBabelExtension(react);
  }
}
