export interface Metadata {
  cwe: string;
}

export interface Vulnerability {
  file: string;
  severity: string;
  message: string;
  metadata: Metadata;
}

export interface Node {
  id: string;
  name: string;
  kind: string;
  language: string;
  path: string;
  publicExposed: boolean;
  vulnerabilities?: Vulnerability[];
}

export interface Edge {
  from: string;
  to: string;
}

export interface OldEdge {
  from: string;
  to: string[];
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface Filter {
  endInSink?: string;
  withVulnerabilities?: string;
  publicToSink?: string;
}

export type FilterKey = keyof Filter;

export type FiltersDictionary = {
  [key in FilterKey]: (graph: Graph) => Graph;
};
