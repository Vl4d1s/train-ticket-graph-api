# Home Exercise - Backslash

## Decisions

### Graph shape

The `createGraph` function is used to generate the graph structure from a JSON file. This function performs two main transformations:

1. **Adding an ID to each node**: Each node in the graph is given an `id` property that is equal to the node's `name`. This was done to ensure that each node has a unique identifier, which can be useful for certain operations such as searching or filtering nodes.

2. **Flattening the `edge.to` property**: In the original data, each edge has a `to` property that is an array of nodes. This was flattened so that each `to` node is associated with a single edge. This makes it easier to work with the edges, as each edge now represents a direct connection between two nodes.

To be honest, I have never used a graph library before, but after conducting a quick research on libraries like [vis](https://github.com/crubier/react-graph-vis), I decided to go with this option.

### Endpoint and Filter mechanism

- `GET /graph`: This endpoint returns the entire graph structure, optionally filtered by the provided filters.

  The filters are provided as a comma-separated list in the `filters` query parameter. For example, to apply `filter1` and `filter2`, you would send a request to `/graph?filters=publicToSink,endInSink,withVulnerabilities`.

I desited to go with one endpoint, I didn't see the need to add another one to the filters.

for example:
`http://localhost:5001/api/v1/graph?filters=endInSink,withVulnerabilities`

### Response

I think it would be nice to provide the client with an additional metadata:

```
{
  graph: filteredGraph,
  metadata: {
    appliedFilters,
    nodeCount: filteredGraph.nodes.length,
    edgeCount: filteredGraph.edges.length,
  },
}
```

## Assumptions

I assumed that the client side needs the extra information located in each node, so I left the data as it is.

I assumed that the service name is "unique," so I chose it for the ID. However, it would be better to generate a numerical unique ID instead.

### Steps to add your own filter

To add a filter, follow these steps:

1. In the `types/index.ts` file, add an optional filter name to the `Filter` interface with a type of `string`.

```typescript
export interface Filter {
  endInSink?: string;
  withVulnerabilities?: string;
  publicToSink?: string;
  yourNewFilterHere?: string; // add filter name
}
```

2. `in filters/index.ts` file:
   1. Write a filter function.
   2. Add the same filter name to `FiltersDictionary` along with a reference to your new filter function.

```javascript
export const filtersDictionary: FiltersDictionary = {
  endInSink: filterRoutesEndingInSink,
  publicToSink: filterRoutesPublicToSink,
  withVulnerabilities: filterRoutesWithVulnerabilities,
  yourNewFilterHere: yourFilterFunctionReference, // add filter reference
};
```
