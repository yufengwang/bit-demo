import { MainRuntime } from '@teambit/cli';
import { EnvsMain, EnvsAspect } from '@teambit/envs';
import { CompilerMain, CompilerAspect } from '@teambit/compiler';
/* babel is used here as an example of a specific compiler implementation */
import { BabelMain, BabelAspect } from '@teambit/babel';
import { EnvWithCompiler } from './env-with-compiler.env';
import { EnvWithCompilerAspect } from './env-with-compiler.aspect';

export class EnvWithCompilerMain {
  /* lists the aspects used by this aspect */
  static dependencies = [EnvsAspect, CompilerAspect, BabelAspect];
  static runtime = MainRuntime;
  /* provides the env with the relevant aspect instances (these instances are injected by Bit) */
  static async provider([envs, compiler, babel]: [
    EnvsMain,
    CompilerMain,
    BabelMain
  ]) {
    const envWithCompiler = new EnvWithCompiler(compiler, babel);
    /* registers this env instance as an env */
    envs.registerEnv(envWithCompiler);
    return new EnvWithCompilerMain();
  }
}

EnvWithCompilerAspect.addRuntime(EnvWithCompilerMain);
