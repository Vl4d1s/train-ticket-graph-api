import { Graph, Edge } from "../types";

export function extractFilters(filters: string): string[] {
  try {
    const filtersArray = filters.split(",");
    return filtersArray.length > 0 ? filtersArray : [];
  } catch (error) {
    console.error(`Failed to extract filters: ${error}`);
    return [];
  }
}

/**
 * Recursive function to find all paths in a graph that satisfy a given condition.
 *
 * @param startId - The ID of the node where the path starts.
 * @param endIds - A set of IDs of nodes where the path can end.
 * @param edges - An array of all edges in the graph.
 * @param path - An array representing the current path (default is an empty array).
 * @param paths - An array of all paths found so far (default is an empty array).
 * @param condition - A function that takes a path and returns a boolean indicating whether the path satisfies the condition (default is a function that always returns true).
 * @returns An array of all paths that satisfy the condition.
 */
export function findPaths(
  startId: string,
  endIds: Set<string>,
  edges: Edge[],
  path: string[] = [],
  paths: string[][] = [],
  condition: (path: string[]) => boolean = () => true
): string[][] {
  path.push(startId);

  if (endIds.has(startId) && condition(path)) {
    paths.push([...path]);
  } else {
    for (const edge of edges) {
      if (edge.from === startId && !path.includes(edge.to)) {
        findPaths(edge.to, endIds, edges, [...path], paths, condition);
      }
    }
  }

  return paths;
}

/**
 * Function to get unique nodes and edges from a graph.
 *
 * This function takes a graph as input and returns a new graph with duplicate nodes and edges removed.
 * The uniqueness of nodes and edges is determined by their 'id' property.
 *
 * @param graph - The input graph.
 * @returns A new graph with unique nodes and edges.
 */
export function getUniqueNodesAndEdges(allPaths: string[][]): {
  uniqueNodeIds: Set<string>;
  uniqueEdges: Set<string>;
} {
  const uniqueNodeIds = new Set(allPaths.flat());
  const uniqueEdges = new Set(
    allPaths.flatMap((path) => {
      return path.slice(1).map((nodeId, idx) => `${path[idx]}-${nodeId}`);
    })
  );

  return { uniqueNodeIds, uniqueEdges };
}

/**
 * Function to filter a graph based on certain criteria.
 *
 * This function takes a graph and a set of filter names as input. It applies each filter to the graph in the order they appear in the input set. Each filter is a function that takes a graph as input and returns a modified graph.
 *
 * @param graph - The input graph.
 * @param filters - A set of filter names.
 * @returns The filtered graph.
 */
export function filterGraph(
  graph: Graph,
  uniqueNodeIds: Set<string>,
  uniqueEdges: Set<string>
): Graph {
  const filteredNodes = graph.nodes.filter((node) =>
    uniqueNodeIds.has(node.id)
  );
  const filteredEdges = graph.edges.filter((edge) =>
    uniqueEdges.has(`${edge.from}-${edge.to}`)
  );

  return { nodes: filteredNodes, edges: filteredEdges };
}
