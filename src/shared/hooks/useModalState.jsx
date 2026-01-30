import { useState, useCallback } from 'react';

export const useModalState = (nodeService, edgeService, nodes, setNodes, edges, setEdges, fitView) => {

    const [nodeCreationModalOpen, setNodeCreationModalOpen] = useState(false); // For popover position
    const [edgeEditionModalOpen, setEdgeEditionModalOpen] = useState(false); // For popover position
    const [currentNode, setCurrentNode] = useState(null); // To track clicked edge
    const [currentEdge, setCurrentEdge] = useState(null); // To track clicked edge
    const [labelInput, setLabelInput] = useState(''); // Input state for label

    const onEdgeClick = (event, edge) => {
        setLabelInput(edge.label);
        setCurrentEdge(edge);
        setEdgeEditionModalOpen(true);
    };

    const onConnectEnd = useCallback(
        (event, connectionState) => {
          if (!connectionState.isValid) {
            setCurrentNode(connectionState.fromNode);
            setNodeCreationModalOpen(true);
          }
        },
        [fitView],
      );

      const handleCloseEdgeEditionModal = () => {
        setEdgeEditionModalOpen(false);
      };

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

      const handleNodeCreationModalClose = () => {
        setNodeCreationModalOpen(false);
      }

      const handleNodeCreation = (edgeLabel, nodeTitle, nodeText, nodeImage) => {
        nodeService.createNode(nodeTitle, nodeText, nodeImage).then(newNodeData => {

          const newNode = {
            id: '' + newNodeData.id,
            type: 'custom',
            position: { x: 0, y: 0 },
            draggable: true,
            data: { 
              label: newNodeData.title, 
              title: newNodeData.title,
              text: newNodeData.text,
              id: newNodeData.id
            }
          }

          setNodes((prevNodes) => [...prevNodes, newNode]);

          edgeService.createEdge(currentNode.id, newNode.id, edgeLabel).then(newEdgeData => {

            const newEdge = {
              id: '' + newEdgeData.id,
              source: '' + newEdgeData.sourceNodeId,
              target: '' + newEdgeData.targetNodeId,
              label: newEdgeData.edgeLabel,
              data: {
                text: newEdgeData.edgeLabel
              }
            }

            setEdges((prevEdges) => [...prevEdges, newEdge]);

          });
        });
      }

    return {onEdgeClick, onConnectEnd, handleCloseEdgeEditionModal, handleEdgeLabelChange, handleNodeCreationModalClose, handleNodeCreation, edgeEditionModalOpen, nodeCreationModalOpen, labelInput, currentEdge};
};
