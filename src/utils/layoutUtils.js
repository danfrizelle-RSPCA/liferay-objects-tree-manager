import Dagre from '@dagrejs/dagre';

/* getLayoutedElements: run Dagre layout and persist positions
- nodes, edges: arrays in the React Flow format
- options.direction: Dagre rankdir e.g. 'TB' or 'LR'
- nodeService: used to persist computed x/y positions back to API */
export const getLayoutedElements = (nodes, edges, options, nodeService) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  // build dagre graph
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => {
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 300,
      height: node.measured?.height ?? 80,
    });
  });

  // compute layout
  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 300) / 2;
      const y = position.y - (node.measured?.height ?? 80) / 2;

      // Persist the new coordinates so they are available on subsequent loads (the UI expects nodes to include x/y)
      nodeService.updateNodePosition(node.id, x, y);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};
