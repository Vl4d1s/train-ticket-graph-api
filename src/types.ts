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
  name: string;
  kind: string;
  language: string;
  path: string;
  publicExposed: boolean;
  vulnerabilities?: Vulnerability[];
}

export interface Edge {
  from: string;
  to: string | string[];
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
