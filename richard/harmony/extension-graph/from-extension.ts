import { ExtensionManifest } from '../extension';
import { extensionFactory } from '../factory';
import ExtensionPotentialCircular from '../exceptions/extension-potential-circular';
import { Extension } from '../extension';
import { Edge } from './extension-graph';

function getName(manifest: any) {
  return Reflect.getMetadata('harmony:name', manifest) || manifest.id || manifest.name;
}

/**
 * build vertices and edges from the given extension
 */
export function fromExtension(extension: ExtensionManifest) {
  const vertices: { [id: string]: Extension } = {};
  let edges: { sourceId: string; targetId: string; edge: Edge }[] = [];

  function iterate(root: ExtensionManifest) {
    const id = getName(root);
    if (vertices[id]) return;

    const instance = extensionFactory(root);
    const validDeps = instance.dependencies.filter(dep => dep).map(dep => extensionFactory(dep));
    if (instance.dependencies.length > validDeps.length) {
      throw new ExtensionPotentialCircular(instance, validDeps);
    }
    vertices[id] = instance;
    const newEdges = validDeps.map(dep => {
      return {
        sourceId: id,
        targetId: dep.name,
        edge: {
          type: 'dependency'
        }
      };
    });

    edges = edges.concat(newEdges);

    // @ts-ignore
    instance.dependencies.forEach(dep => iterate(dep));
  }

  iterate(extension);

  let vertexArray: { id: string; node: Extension }[] = [];
  for (let [key, value] of Object.entries(vertices)) {
    vertexArray.push({ id: key, node: value });
  }

  return {
    vertices: vertexArray,
    edges
  };
}

/**
 * build vertices and edges from the given list of extensions
 */
export function fromExtensions(extensions: ExtensionManifest[]) {
  const perExtension = extensions.map(ext => fromExtension(ext));

  return perExtension.reduce(
    (acc, subgraph) => {
      acc.edges = acc.edges.concat(subgraph.edges);
      acc.vertices = acc.vertices.concat(subgraph.vertices);

      return acc;
    },
    { vertices: [], edges: [] }
  );
}
