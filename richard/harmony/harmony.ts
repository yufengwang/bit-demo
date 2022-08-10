import 'reflect-metadata';
import ExtensionGraph from './extension-graph/extension-graph';
import { ExtensionLoadError } from './exceptions';
import { Extension, ExtensionManifest } from './extension';
import { asyncForEach } from './utils';
import { Config } from './config';
import { Aspect } from './aspect';
import { Runtimes } from './runtimes/runtimes';
import { RuntimeDefinition } from './runtimes/runtime-definition';
import { RuntimeNotDefined } from './runtimes/exceptions';

export type GlobalConfig = {
  [key: string]: object
};

export type RequireFn = (aspect: Extension, runtime: RuntimeDefinition) => Promise<void>;

export class Harmony {
  constructor(
    /**
     * extension graph
     */
    readonly graph: ExtensionGraph,

    /**
     * harmony top level config
     */
    readonly config: Config,

    readonly runtimes: Runtimes,

    readonly activeRuntime: string
  ) {}

  public current: string|null = null;

  private runtime: RuntimeDefinition | undefined;

  /**
   * list all registered extensions
   */
  get extensions() {
    return this.graph.nodes;
  }

  /**
   * list all registered extensions ids
   */
  get extensionsIds() {
    return [...this.graph.nodes.keys()];
  }

  /**
   * load an Aspect into the dependency graph.
   */
  async load(extensions: ExtensionManifest[]) {
    return this.set(extensions);
  }

  /**
   * set extensions during Harmony runtime.
   * hack!
   */
  async set(extensions: ExtensionManifest[]) {
    this.graph.load(extensions);
    // Only load new extensions and their dependencies
    const extensionsToLoad = extensions.map((ext) => { 
      // @ts-ignore
      return Reflect.getMetadata('harmony:name', ext) || ext.id || ext.name; 
    });
  
    // @ts-ignore
    await this.graph.enrichRuntime(this.runtime, this.runtimes, () => {});
    // @ts-ignore
    const subgraphs = this.graph.successorsSubgraph(extensionsToLoad);
    if (subgraphs) {
      const executionOrder = subgraphs.toposort(true);
      await asyncForEach(executionOrder, async (ext: Extension) => {
        if (!this.runtime) throw new RuntimeNotDefined(this.activeRuntime);
        await this.runOne(ext, this.runtime);
      });
    }
  }

  private async runOne(extension: Extension, runtime: RuntimeDefinition) {
    if (extension.loaded) return;
    // create an index of all vertices in dependency graph
    const deps = this.graph.getRuntimeDependencies(extension, runtime);
    const instances = deps.map(extension => extension.instance);

    try {
      return extension.__run(instances, this, runtime);
    } catch (err) {
      throw new ExtensionLoadError(extension, err);
    }
  }

  getDependencies(aspect: Extension) {
    if (!this.runtime) throw new RuntimeNotDefined(this.activeRuntime);
    return this.graph.getRuntimeDependencies(aspect, this.runtime);
  }

  initExtension(id: string) {
    this.current = id;
  }

  endExtension() {
    this.current = null;
  }

  /**
   * get an extension from harmony.
   */
  get<T>(id: string): T {
    const extension = this.graph.get(id);
    if (!extension || !extension.instance) throw new Error(`failed loading extension ${id}`);
    return extension.instance;
  }

  resolveRuntime(name: string): RuntimeDefinition {
    return this.runtimes.get(name);
  }

  async run(requireFn?: RequireFn) {
    const runtime = this.resolveRuntime(this.activeRuntime);
    this.runtime = runtime;
    const defaultRequireFn: RequireFn = async (aspect: Extension, runtime: RuntimeDefinition) => {
      const runtimeFile = runtime.getRuntimeFile(aspect.files);
      if (!runtimeFile) return;
      // runtime.require(runtimeFile);
    };
    // requireFn ? await requireFn(aspect, runtime) : defaultRequireFn(this.graph);
    await this.graph.enrichRuntime(runtime, this.runtimes, requireFn || defaultRequireFn);
    
    const executionOrder = this.graph.byExecutionOrder();
    await asyncForEach(executionOrder, async (ext: Extension) => {
      await this.runOne(ext, runtime);
    });
  }
  
  static async load(aspects: Aspect[], runtime: string, globalConfig: GlobalConfig) {
    const aspectGraph = ExtensionGraph.from(aspects as any);
    const runtimes = await Runtimes.load(aspectGraph);
    return new Harmony(aspectGraph, Config.from(globalConfig), runtimes, runtime);
  }
}
