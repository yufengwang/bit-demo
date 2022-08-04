  import {
    WebpackConfigTransformer,
    WebpackConfigMutator,
    WebpackConfigTransformContext,
  } from "@teambit/webpack";

  /**
   * Transformation to apply for both preview and dev server
   * @param config
   * @param _context
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function commonTransformation(
    config: WebpackConfigMutator,
    _context: WebpackConfigTransformContext
  ) {
    // Merge config with the webpack.config.js file if you choose to import a module export format config.
    // config.merge([webpackConfig]);
    // config.addAliases({});
    // config.addModuleRule(youRuleHere);
    const oneOf = config?.raw?.module?.rules?.find((el) => (el as any).oneOf);

    if (oneOf) {
      const rule = (oneOf as any).oneOf?.find(
        (el) => el.test.toString() === /(?<!\.module)\.less$/.toString()
      );

      if (rule) {
        const ruleObj = rule.use.find((el) => /less-loader/.test(el.loader));

        if (ruleObj) {
          ruleObj.options.lessOptions = {
            javascriptEnabled: true,
          };
        }
      }
    }
    return config;
  }

  /**
   * Transformation for the preview only
   * @param config
   * @param context
   * @returns
   */
  export const previewConfigTransformer: WebpackConfigTransformer = (
    config: WebpackConfigMutator,
    context: WebpackConfigTransformContext
  ) => {
    const newConfig = commonTransformation(config, context);
    return newConfig;
  };

  /**
   * Transformation for the dev server only
   * @param config
   * @param context
   * @returns
   */
  export const devServerConfigTransformer: WebpackConfigTransformer = (
    config: WebpackConfigMutator,
    context: WebpackConfigTransformContext
  ) => {
    const newConfig = commonTransformation(config, context);
    return newConfig;
  };
