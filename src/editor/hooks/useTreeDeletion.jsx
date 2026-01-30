import { useCallback, useState } from 'react';

export const useTreeDeletion = (treeService, loadTreeData) => {

    const [treeDeletionModalOpen, setTreeDeletionModalOpen] = useState(false); // For popover position

    const onDeleteTree = useCallback(() => {
        setTreeDeletionModalOpen(true);
    }, []);

    const handleTreeDeletionModalClose = () => {
        setTreeDeletionModalOpen(false);
    }

    const handleTreeDeletion = (treeId) => {
        treeService.deleteTree(treeId).then(() => {
            loadTreeData(undefined);
        });
    }
    
    return { onDeleteTree, handleTreeDeletionModalClose, handleTreeDeletion, treeDeletionModalOpen };
};
