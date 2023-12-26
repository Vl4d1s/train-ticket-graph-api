import { Request, Response } from "express";

import { FilterKey } from "../types";
import { filtersDictionary } from "../filters";
import { extractFilters } from "../filters/utils";
import { createGraph } from "../services/graph-service";

const getGraph = (req: Request, res: Response) => {
  try {
    const graph = createGraph();
    let filteredGraph = graph;

    const filters = extractFilters(req.query.filters as string);
    const appliedFilters: string[] = [];

    filters.forEach((filter) => {
      const filterFunction = filtersDictionary[filter as FilterKey];
      if (filterFunction) {
        filteredGraph = filterFunction(filteredGraph);
        appliedFilters.push(filter);
      } else {
        throw new Error(`Invalid filter: ${filter}`);
      }
    });

    res.json({
      graph: filteredGraph,
      metadata: {
        appliedFilters,
        nodeCount: filteredGraph.nodes.length,
        edgeCount: filteredGraph.edges.length,
      },
    });
  } catch (error: any) {
    res.status(500).send(`Failed to get graph: ${error.message}`);
  }
};

export default { getGraph };
