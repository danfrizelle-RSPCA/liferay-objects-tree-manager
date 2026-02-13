import { useCallback } from 'react';
import {
    useNodesState,
    useEdgesState,
  } from '@xyflow/react';

/* Hook: useGraphData
Purpose: manage React Flow nodes/edges for the editable FlowEditor.
- uses `useNodesState` / `useEdgesState` from @xyflow/react
- exposes `loadGraphData(treeId, setLoading)` to fetch nodes then edges, updates state, and calls `fitView()` to center the graph
- exposes `wipeGraphData()` to clear the canvas when no treeId is set */

export const useGraphData = (nodeService, edgeService, fitView) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /* wipeGraphData: clear nodes and edges (used when no tree is selected).
  Kept as a named callback to avoid recreating functions on each render. */
  const wipeGraphData = useCallback(() => {

    setNodes([]);
    setEdges([]);

  }, [setNodes, setEdges]);

  const loadGraphData = useCallback(async (treeId, setLoading) => {
    setLoading(true);

    try {
      const nodeData = await nodeService.getNodes(treeId);
      const nodes = nodeData.map(node => ({
        id: '' + node.id,
        type: 'custom',
        position: { x: node.xPosition, y: node.yPosition },
        draggable: true,
        data: {
          nodeTitle: node.nodeTitle,
          nodeText: node.nodeText,
          nodeImage: node.nodeImage,
          nodeRoot: node.nodeRoot,
          treeId: treeId,
          id: node.id
        }
      }));

      const edgeData = await edgeService.getEdges(treeId);
      const edges = edgeData.map(edge => ({
        id: '' + edge.id,
        source: '' + edge.sourceNodeId,
        target: '' + edge.targetNodeId,
        label: edge.edgeLabel,
        data: {
          text: edge.edgeLabel,
          treeId: treeId
        }
      }));

      setNodes(nodes);
      setEdges(edges);
      fitView();
    }
    finally {
      setLoading(false);
    }
  }, [nodeService, edgeService, fitView, setNodes, setEdges]);

  return { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, loadGraphData, wipeGraphData };
};
