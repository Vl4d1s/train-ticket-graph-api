import { Graph } from "../types";

export const getGraphStructure = (): Graph => {
  try {
    const graphData = require("../data/train-ticket-graph.json");
    return graphData as Graph;
  } catch (error) {
    console.error(`Failed to get graph data: ${error}`);
    return { nodes: [], edges: [] };
  }
};
