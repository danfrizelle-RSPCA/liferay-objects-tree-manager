import { useState, useCallback } from 'react';

export const useTreeData = (treeService, setTreeId) => {
    
    const [trees, setTrees] = useState();

    const loadTreeData = useCallback((treeId) => {

        treeService.getTrees().then(data => {
            setTrees(data);
            setTreeId(treeId);
        });

    }, [treeService, setTreeId]);

    return { trees, loadTreeData };
};
