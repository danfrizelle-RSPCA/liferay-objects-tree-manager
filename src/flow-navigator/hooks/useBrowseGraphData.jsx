import { useCallback, useRef, useState } from 'react';

/* Hook: useBrowseGraphData
Purpose: provide a lightweight, read-only data loader used by `FlowNavigator`.
It accepts configured service instances and exposes `startNodeId`, `nodes`, `edges` and a `loadGraphData` function which receives `treeERC` and a `setLoading` callback.

Behavior notes:
- sets `setLoading(true)` at start and `setLoading(false)` after nodes+edges are loaded or on any failure (see catch)
- identifies the start node by checking `node.nodeRoot` and sets `startNodeId` accordingly */

export const useBrowseGraphData = (
  treeService,
  nodeService,
  accordionService,
  edgeService
) => {
  const [startNodeId, setStartNodeId] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Used to ignore stale async responses when switching trees quickly.
  const latestLoadIdRef = useRef(0);

  const loadGraphData = useCallback(
    (treeERC, setLoading) => {
      const loadId = ++latestLoadIdRef.current;

      // signal consumer that loading started
      setLoading(true);

      /* 1) resolve tree ERC -> tree id
       2) fetch nodes for the tree id
       3) fetch edges for the tree id
       Note: accordion data is fetched on navigation to a node (see FlowNavigator). */

      treeService
        .getTree(treeERC)
        .then((tree) => {
          nodeService.getNodes(tree.id).then((nodeData) => {
            if (latestLoadIdRef.current !== loadId) return;

            // pick the first node flagged as root (start node)
            nodeData
              .filter((node) => {
                return node.nodeRoot;
              })
              .forEach((node) => {
                setStartNodeId(node.id);
              });

            // Set initial nodes immediately (accordions will be merged in later)
            const initialNodes = nodeData.map((node) => ({
              id: '' + node.id,
              nodeTitle: node.nodeTitle,
              nodeText: node.nodeText,
              nodeImage: node.nodeImage,
              nodeYouTubeID: node.nodeYouTubeID,
              nodeRoot: node.nodeRoot,
            }));
            setNodes(initialNodes);

            /* now fetch edges and populate state; do not block on accordions */
            edgeService.getEdges(tree.id).then((edgeData) => {
              if (latestLoadIdRef.current !== loadId) return;

              const edges = edgeData.map((edge) => ({
                id: '' + edge.id,
                source: '' + edge.sourceNodeId,
                target: '' + edge.targetNodeId,
                label: edge.edgeLabel,
              }));

              setEdges(edges);
              setLoading(false);
            });
          });
        })
        .catch((error) => {
          /* Important: network or data errors must clear loading so the UI doesn't show an indefinite spinner.
      We log the error for diagnostics and attempt to clear the caller's loading flag. */
          console.error('Failed to load browse graph data', error);
          try {
            setLoading(false);
          } catch (e) {
            // ignore if setLoading is not a function or component unmounted
          }
        });
    },
    [treeService, nodeService, edgeService]
  );

  return { startNodeId, nodes, edges, loadGraphData };
};
