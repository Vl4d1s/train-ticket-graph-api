import { FiltersDictionary, Graph } from "../types";
import { filterGraph, findPaths, getUniqueNodesAndEdges } from "./utils";

export const filtersDictionary: FiltersDictionary = {
  endInSink: filterRoutesEndingInSink,
  publicToSink: filterRoutesPublicToSink,
  withVulnerabilities: filterRoutesWithVulnerabilities,
};

function filterRoutesEndingInSink(graph: Graph): Graph {
  const sinkNodeIds = new Set(
    graph.nodes
      .filter(
        (node) =>
          node.kind.toLowerCase() === "rds" || node.kind.toLowerCase() === "sql"
      )
      .map((node) => node.id)
  );

  let allPaths = graph.nodes.flatMap((node) =>
    findPaths(node.id, sinkNodeIds, graph.edges)
  );
  const { uniqueNodeIds, uniqueEdges } = getUniqueNodesAndEdges(allPaths);

  return filterGraph(graph, uniqueNodeIds, uniqueEdges);
}

function filterRoutesWithVulnerabilities(graph: Graph): Graph {
  const vulnerableNodeIds = new Set(
    graph.nodes
      .filter((node) => node.vulnerabilities && node.vulnerabilities.length > 0)
      .map((node) => node.id)
  );

  let allPaths = graph.nodes.flatMap((node) =>
    findPaths(node.id, vulnerableNodeIds, graph.edges)
  );
  const { uniqueNodeIds, uniqueEdges } = getUniqueNodesAndEdges(allPaths);

  return filterGraph(graph, uniqueNodeIds, uniqueEdges);
}

function filterRoutesPublicToSink(graph: Graph): Graph {
  const publicNodeIds = new Set(
    graph.nodes.filter((node) => node.publicExposed).map((node) => node.id)
  );
  const sinkNodeIds = new Set(
    graph.nodes
      .filter(
        (node) =>
          node.kind.toLowerCase() === "rds" || node.kind.toLowerCase() === "sql"
      )
      .map((node) => node.id)
  );

  let allPaths = graph.nodes.flatMap((node) =>
    findPaths(node.id, sinkNodeIds, graph.edges, [], [], (path) =>
      publicNodeIds.has(path[0])
    )
  );
  const { uniqueNodeIds, uniqueEdges } = getUniqueNodesAndEdges(allPaths);

  return filterGraph(graph, uniqueNodeIds, uniqueEdges);
}
