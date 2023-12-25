import { Request, Response } from "express";

import { getGraphStructure } from "../services/graph-service";

const getGraph = (req: Request, res: Response) => {
  try {
    const graphStracture = getGraphStructure();
    const nodes = graphStracture.nodes;
    const edges = graphStracture.edges.map((edge) => ({
      source: edge.from,
      target: edge.to,
    }));

    const graph = { nodes, edges };

    res.json(graph);
  } catch (error) {
    res.status(500).send("Failed to get graph");
  }
};

export default { getGraph };
