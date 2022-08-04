import type { CompilerEnv } from '@teambit/envs';
import type { CompilerMain } from '@teambit/compiler';
import type { BabelMain } from '@teambit/babel';
// import { babelConfig } from './babel.config';

export class EnvWithCompiler implements CompilerEnv {
  constructor(private compiler: CompilerMain, private babel: BabelMain) {}

  /**
   * implements the compiler env service and
   * provides the compiler with a specific compiler implementation.
   * this provides components with compilation in the workspace. to provide compilation during build,
   * implement the 'builder' env service, and add a compilation build task.
   * learn more here: https://bit.dev/docs/dev-services/builder/using-build-tasks
   */
  getCompiler() {
    const babelCompiler = this.babel.createCompiler({
      /* most env service implementations enable envs to add their own config */
      //   babelTransformOptions: babelConfig,
    });
    return babelCompiler;
  }

  async __getDescriptor() {
    return {
      type: 'custom-env',
    };
  }
}
