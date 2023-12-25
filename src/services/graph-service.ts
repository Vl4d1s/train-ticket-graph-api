import fs from "fs";
import path from "path";

import { Node, Edge, OldEdge, Graph } from "../types";

export function createGraph(): Graph {
  try {
    const graph = JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(), "./src/data/train-ticket-graph.json"),
        "utf-8"
      )
    );

    const nodes: Node[] = graph.nodes.map((node: Node) => ({
      ...node,
      id: node.name,
    }));

    const edges: Edge[] = graph.edges
      .map((edge: OldEdge) => edge.to.map((to) => ({ from: edge.from, to })))
      .flat();

    return { edges, nodes };
  } catch (error) {
    console.error("Error creating graph:", error);
    throw error;
  }
}
