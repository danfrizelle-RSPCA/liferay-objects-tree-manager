import { useState, useCallback } from "react";

import { useReactFlow } from "@xyflow/react";

export const useNodeCreation = (
  nodeService,
  edgeService,
  setNodes,
  setEdges,
  treeId
) => {
  const [nodeCreationModalOpen, setNodeCreationModalOpen] = useState(false); // For popover position
  const [currentNode, setCurrentNode] = useState(null); // To track clicked edge
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const { screenToFlowPosition } = useReactFlow();

  const openNodeCreationModal = (x = 250, y = 250) => {
    setXPosition(x);
    setYPosition(y);
    setCurrentNode(null);
    setNodeCreationModalOpen(true);
  };

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        setCurrentNode(connectionState.fromNode);
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        setXPosition(clientX);
        setYPosition(clientY);
        setNodeCreationModalOpen(true);
      }
    },
    [screenToFlowPosition]
  );

  const handleNodeCreationModalClose = () => {
    setNodeCreationModalOpen(false);
  };

  const handleNodeCreation = (edgeLabel, nodeTitle, nodeText, nodeImage, accordion1Heading, accordion1Content, accordion2Heading, accordion2Content, accordion3Heading, accordion3Content) => {
    nodeService
      .createNode(treeId, nodeTitle, nodeText, nodeImage, xPosition, yPosition, accordion1Heading, accordion1Content, accordion2Heading, accordion2Content, accordion3Heading, accordion3Content)
      .then((newNodeData) => {
        const newNode = {
          id: "" + newNodeData.id,
          type: "custom",
          position: screenToFlowPosition({
            x: xPosition,
            y: yPosition,
          }),
          draggable: true,
          data: {
            nodeTitle: nodeTitle,
            nodeText: nodeText,
            nodeImage: nodeImage,
            accordion1Heading: accordion1Heading,
            accordion1Content: accordion1Content,
            accordion2Heading: accordion2Heading,
            accordion2Content: accordion2Content,
            accordion3Heading: accordion3Heading,
            accordion3Content: accordion3Content,
            id: newNodeData.id,
          },
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);

        edgeService
          .createEdge(treeId, currentNode.id, newNode.id, edgeLabel)
          .then((newEdgeData) => {
            const newEdge = {
              id: "" + newEdgeData.id,
              source: "" + newEdgeData.sourceNodeId,
              target: "" + newEdgeData.targetNodeId,
              label: newEdgeData.edgeLabel,
              data: {
                text: newEdgeData.edgeLabel,
              },
            };

            setEdges((prevEdges) => [...prevEdges, newEdge]);
          });
      });
  };

  return {
    onConnectEnd,
    handleNodeCreationModalClose,
    handleNodeCreation,
    nodeCreationModalOpen,
    openNodeCreationModal,
  };
};
