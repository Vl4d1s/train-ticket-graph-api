import { Request, Response } from "express";

import { createGraph } from "../services/graph-service";
import { FilterKey, FiltersDictionary } from "../types";
import {
  extractFilters,
  filterRoutesEndingInSink,
  filterRoutesPublicToSink,
  filterRoutesWithVulnerabilities,
} from "../helpers";

const filtersDictionary: FiltersDictionary = {
  endInSink: filterRoutesEndingInSink,
  publicToSink: filterRoutesPublicToSink,
  withVulnerabilities: filterRoutesWithVulnerabilities,
  // Add other filters here
};

const getGraph = (req: Request, res: Response) => {
  try {
    const graph = createGraph();
    let filteredGraph = graph;

    const filters = extractFilters(req.query.filters as string);

    filters.forEach((filter) => {
      const filterFunction = filtersDictionary[filter as FilterKey];
      if (filterFunction) {
        filteredGraph = filterFunction(filteredGraph);
      } else {
        throw new Error(`Invalid filter: ${filter}`);
      }
    });

    res.json(filteredGraph);
  } catch (error: any) {
    res.status(500).send(`Failed to get graph: ${error.message}`);
  }
};

export default { getGraph };
