import { useCallback, useState } from 'react';

/* Hook: useBrowseGraphData
Purpose: provide a lightweight, read-only data loader used by `GraphNavigator`.
It accepts configured service instances and exposes `startNodeId`, `nodes`, `edges` and a `loadGraphData` function which receives `treeERC` and a `setLoading` callback.

Behavior notes:
- sets `setLoading(true)` at start and `setLoading(false)` after nodes+edges are loaded or on any failure (see catch)
- identifies the start node by checking `node.nodeRoot` and sets `startNodeId` accordingly */

export const useBrowseGraphData = (treeService, nodeService, edgeService) => {
  const [startNodeId, setStartNodeId] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const loadGraphData = useCallback((treeERC, setLoading) => {
    // signal consumer that loading started
    setLoading(true);

    /* 1) resolve tree ERC -> tree id
       2) fetch nodes for the tree id
       3) fetch edges for the tree id */

    treeService.getTree(treeERC).then(tree => {
      nodeService.getNodes(tree.id).then(nodeData => {
        const nodes = nodeData.map(node => ({
          id: '' + node.id,
          nodeTitle: node.nodeTitle,
          nodeText: node.nodeText,
          nodeImage: node.nodeImage,
          nodeRoot: node.nodeRoot
        }));

        // pick the first node flagged as root (start node)
        nodeData.filter(node => {return node.nodeRoot}).forEach(node => {
          setStartNodeId(node.id);
        });

        /* now fetch edges and populate state; any failure below should be handled by the outer catch to ensure the loading indicator is cleared. */
        edgeService.getEdges(tree.id).then(edgeData => {
          const edges = edgeData.map(edge => ({
            id: '' + edge.id,
            source: '' + edge.sourceNodeId,
            target: '' + edge.targetNodeId,
            label: edge.edgeLabel
          }));
  
          setLoading(false);
          setNodes(nodes);
          setEdges(edges);
        });
      });
    }).catch(error => {
      /* Important: network or data errors must clear loading so the UI doesn't show an indefinite spinner.
      We log the error for diagnostics and attempt to clear the caller's loading flag. */
      console.error('Failed to load browse graph data', error);
      try {
        setLoading(false);
      } catch (e) {
        // ignore if setLoading is not a function or component unmounted
      }
    });
  }, [treeService, nodeService, edgeService]);

  return { startNodeId, nodes, edges, loadGraphData };
};