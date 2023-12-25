import { Request, Response } from "express";
import { getGraphStructure } from "../services/graph-service";
import { Edge, Graph } from "../types";

const getRoutesByFilter = (req: Request, res: Response) => {
  const { filterBy } = req.query;
  const graph = getGraphStructure();

  if (!filterBy) {
    res.json({ routes: [] });
  } else {
    let filteredRoutes: Edge[] = [];

    switch (filterBy) {
      case "endInSink":
        filteredRoutes = getRoutesEndingInSink(graph);
        break;
      case "withVulnerabilities":
        filteredRoutes = getRoutesWithVulnerabilities(graph);
        break;
      case "publicToSink":
        filteredRoutes = getPublicRoutesEndingInSink(graph);
        break;
      default:
        res.status(400).json({ error: "Invalid filterBy parameter" });
        return;
    }

    res.json({ routes: filteredRoutes });
  }
};

function getRoutesEndingInSink(graph: Graph): Edge[] {
  return [];
}

function getRoutesWithVulnerabilities(graph: Graph): Edge[] {
  return [];
}

function getPublicRoutesEndingInSink(graph: Graph): Edge[] {
  const startNode = "frontend";
  const visitedNodes: Set<string> = new Set();

  dfs(graph, startNode, visitedNodes);
  return [];
}

function dfs(graph: Graph, startNode: string, visited: Set<string>) {
  visited.add(startNode);
  console.log(startNode);

  const linkedEdges = graph.edges.filter((edge) => edge.from === startNode);
  for (const edge of linkedEdges) {
    const linkedNodes = Array.isArray(edge.to) ? edge.to : [edge.to];
    for (const linkedNode of linkedNodes) {
      if (!visited.has(linkedNode)) {
        dfs(graph, linkedNode, visited);
      }
    }
  }
}

export default { getRoutesByFilter };
