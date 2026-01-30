import { useCallback, useState } from 'react';

export const useTreeCreation = (treeService, nodeService, loadTreeData, loadGraphData, setLoading) => {

    const [treeCreationModalOpen, setTreeCreationModalOpen] = useState(false); // For popover position

    const onCreateTree = useCallback(() => {
        setTreeCreationModalOpen(true);
    }, []);

    const handleTreeCreationModalClose = () => {
        setTreeCreationModalOpen(false);
    }

    const handleTreeCreation = (treeName) => {
        treeService.createTree(treeName).then(treeId => {
            nodeService.createNode(treeId, "Root", "Change me", 0, 0).then((node) => {
                nodeService.setNodeAsStart(node.id).then(() => {
                    loadGraphData(treeId, setLoading);
                });
            });
            loadTreeData(treeId);
        });
    }
    
    return { onCreateTree, handleTreeCreationModalClose, handleTreeCreation, treeCreationModalOpen };
};
