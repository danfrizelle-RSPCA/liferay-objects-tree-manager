import { useCallback, useState } from 'react';

export const useTreeCreation = (treeService, nodeService, loadTreeData, loadGraphData, setLoading) => {

    const [treeCreationModalOpen, setTreeCreationModalOpen] = useState(false); // For popover position

    const onCreateTree = useCallback(() => {
        setTreeCreationModalOpen(true);
    }, []);

    const handleTreeCreationModalClose = () => {
        setTreeCreationModalOpen(false);
    }

    const handleTreeCreation = async (treeName) => {
        // Show loading immediately when the user submits.
        setLoading(true);

        try {
            const treeId = await treeService.createTree(treeName);

            // Ensure a new tree always starts with at least one node.
            const node = await nodeService.createNode(treeId, "Root", "Change me", "", "", 0, 0);
            await nodeService.setNodeAsStart(node.id);

            loadTreeData(treeId);
            await loadGraphData(treeId, setLoading);
        }
        catch (error) {
            // If tree creation fails before graph loading completes, make sure the modal closes.
            setLoading(false);
            throw error;
        }
    };
    
    return { onCreateTree, handleTreeCreationModalClose, handleTreeCreation, treeCreationModalOpen };
};
