import { useState, useCallback } from 'react';
import {
  addEdge,
} from '@xyflow/react';


export const useEdgeCreation = (edgeService, setEdges, treeId) => {

  const [edgeCreationModalOpen, setEdgeCreationModalOpen] = useState(false);
  const [params, setParams] = useState(null);

  const onConnect = useCallback(
    (params) => {
      setParams(params);
      setEdgeCreationModalOpen(true);
    },
    [setEdges],
  );

  const handleEdgeCreationModalClose = () => {
    setEdgeCreationModalOpen(false);
  };

  const handleEdgeCreation = (edgeLabel) => {

    params.label = edgeLabel;
    setEdges((eds) => addEdge(params, eds));
    edgeService.createEdge(treeId, params.source, params.target, edgeLabel);

  }
  
  return { onConnect, handleEdgeCreationModalClose, handleEdgeCreation, edgeCreationModalOpen };
};

