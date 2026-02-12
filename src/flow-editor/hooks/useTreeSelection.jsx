import { useCallback, useState } from 'react';

export const useTreeSelection = (setTreeId) => {

    const [treeSelectionModalOpen, setTreeSelectionModalOpen] = useState(false); // For popover position

    const onSelectTree = useCallback(() => {
        setTreeSelectionModalOpen(true);
    }, []);

    const handleTreeSelectionModalClose = () => {
        setTreeSelectionModalOpen(false);
    }

    const handleTreeSelection = (treeId) => {
        setTreeId(treeId);
    }
    
    return { onSelectTree, handleTreeSelectionModalClose, handleTreeSelection, treeSelectionModalOpen };
};
