import { Graph, Node } from "../types";

export function isSinkNode(node: Node): boolean {
  return ["rds", "sql"].includes(node.kind.toLowerCase());
}

export function extractFilters(filters: string): string[] {
  try {
    const filtersArray = filters.split(",");
    return filtersArray.length > 0 ? filtersArray : [];
  } catch (error) {
    console.error(`Failed to extract filters: ${error}`);
    return [];
  }
}

export function filterRoutesEndingInSink(graph: Graph): Graph {
  const sinkNodes = graph.nodes.filter(isSinkNode);
  const sinkNodeIds = new Set(sinkNodes.map((node) => node.id));

  const filteredEdges = graph.edges.filter((edge) => sinkNodeIds.has(edge.to));
  const involvedNodeIds = new Set([
    ...filteredEdges.map((edge) => edge.from),
    ...filteredEdges.map((edge) => edge.to),
  ]);

  const filteredNodes = graph.nodes.filter((node) =>
    involvedNodeIds.has(node.id)
  );

  return { nodes: filteredNodes, edges: filteredEdges };
}

export function filterRoutesWithVulnerabilities(graph: Graph): Graph {
  // Filter nodes that have vulnerabilities
  const vulnerableNodes = graph.nodes.filter(
    (node) => node.vulnerabilities && node.vulnerabilities.length > 0
  );
  const vulnerableNodeIds = new Set(vulnerableNodes.map((node) => node.id));

  // Filter edges that involve vulnerable nodes
  const filteredEdges = graph.edges.filter(
    (edge) => vulnerableNodeIds.has(edge.from) || vulnerableNodeIds.has(edge.to)
  );
  const involvedNodeIds = new Set([
    ...filteredEdges.map((edge) => edge.from),
    ...filteredEdges.map((edge) => edge.to),
  ]);

  const filteredNodes = graph.nodes.filter((node) =>
    involvedNodeIds.has(node.id)
  );

  return { nodes: filteredNodes, edges: filteredEdges };
}

export function filterRoutesPublicToSink(graph: Graph): Graph {
  const publicNodes = graph.nodes.filter((node) => node.publicExposed);
  const sinkNodes = graph.nodes.filter(isSinkNode); // Assuming isSinkNode is already defined

  const publicNodeIds = new Set(publicNodes.map((node) => node.id));
  const sinkNodeIds = new Set(sinkNodes.map((node) => node.id));

  // Filter edges that start in a public node and end in a Sink node
  const filteredEdges = graph.edges.filter(
    (edge) => publicNodeIds.has(edge.from) && sinkNodeIds.has(edge.to)
  );

  // Include only the nodes involved in these edges
  const involvedNodeIds = new Set([
    ...filteredEdges.map((edge) => edge.from),
    ...filteredEdges.map((edge) => edge.to),
  ]);
  const filteredNodes = graph.nodes.filter((node) =>
    involvedNodeIds.has(node.id)
  );

  return { nodes: filteredNodes, edges: filteredEdges };
}
