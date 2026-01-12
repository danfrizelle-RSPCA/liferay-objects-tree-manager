import { useState } from 'react';

export const useEdgeUpdate = (edgeService, edges, setEdges) => {

    const [edgeEditionModalOpen, setEdgeEditionModalOpen] = useState(false);
    const [currentEdge, setCurrentEdge] = useState(null);

    const onEdgeClick = (event, edge) => {
      setCurrentEdge(edge);
      setEdgeEditionModalOpen(true);
    };

    const handleEdgeEditionModalClose = () => {
      setEdgeEditionModalOpen(false);
    };

    const handleEdgeDelete = () => {

      if (currentEdge) {

        const updatedEdges = edges.filter(edge => edge.id !== currentEdge.id);
        setEdges(updatedEdges);
        
        edgeService.deleteEdge(currentEdge.id);
      }

    }

    const handleEdgeLabelChange = (newLabel) => {
      if (currentEdge) {
        const updatedEdges = edges.map((edge) => {
          if (edge.id === currentEdge.id) {
            return { ...edge, label: newLabel };
          }
          return edge;
        });
    
        edgeService.updateEdgeLabel(currentEdge.id, newLabel);
        setEdges(updatedEdges);
      }
    
    };
    
    return {onEdgeClick, handleEdgeEditionModalClose, handleEdgeLabelChange, handleEdgeDelete, edgeEditionModalOpen, currentEdge};
};