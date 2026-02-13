import { useState } from 'react';

export const useNodeUpdate = (nodeService, nodes, setNodes) => {

    const [nodeUpdateModalOpen, setNodeUpdateModalOpen] = useState(false); // For popover position
    const [currentNode, setCurrentNode] = useState(null); // To track clicked edge

    const onNodeClick = (event, node) => {
        setCurrentNode(node);
        setNodeUpdateModalOpen(true);
    }

    const onNodeDragStop = (event, node) => {
        nodeService.updateNodePosition(node.id, node.position.x, node.position.y);
    }

    const handleNodeDelete = () => {

        const updatedNodes = nodes.filter(node => node.id !== currentNode.id);
        setNodes(updatedNodes);

        nodeService.deleteNode(currentNode.id);
    }

    const handleNodeSetAsStart = () => {

        nodeService.setNodeAsStart(currentNode.id);

        const updatedNodes = nodes.map((node) => {
            if (String(node.id) === String(currentNode.id)) {
                return { 
                    ...node, 
                    data: { 
                        ...node.data,  // Keep other properties in data intact
                        nodeRoot: true 
                    }
                };
            } else {
                return { 
                    ...node, 
                    data: { 
                        ...node.data,  // Keep other properties in data intact
                        nodeRoot: false 
                    }
                };
            }
        });

        setNodes(updatedNodes);

    }

    const handleNodeUpdate = (nodeTitle, nodeText, nodeImage, nodeYouTubeID) => {

        if (currentNode) {
            const updatedNodes = nodes.map((node) => {
              if (node.id === currentNode.id) {
                return { 
                    ...node, 
                    data: { 
                        ...node.data,  // Keep other properties in data intact
                        nodeTitle: nodeTitle, 
                        nodeText: nodeText,
                        nodeImage: nodeImage,
                        nodeYouTubeID: nodeYouTubeID
                    }
                };
              }
              return node;
            });

            nodeService.updateNode(currentNode.id, nodeTitle, nodeText, nodeImage, nodeYouTubeID);
            setNodes(updatedNodes);
          }

    }

    const handleNodeUpdateModalClose = () => {
        setNodeUpdateModalOpen(false);
    }

    
    return {onNodeClick, onNodeDragStop, handleNodeUpdateModalClose, handleNodeUpdate, handleNodeDelete, handleNodeSetAsStart, currentNode, nodeUpdateModalOpen};
};
