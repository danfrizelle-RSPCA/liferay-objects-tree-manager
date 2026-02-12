import React, { useState, useEffect } from 'react';

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import ClayForm, {ClaySelect} from '@clayui/form';

function TreeSelectionModal(props) {

  const { observer, onOpenChange } = useModal({
    onClose: props.onClose
  });

  const [treeId, setTreeId] = useState(null);
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    setTrees(props.trees)
  }, [props]);

  useEffect(() => {
    const hasProvidedTreeId = props.treeId !== null && props.treeId !== undefined;
    if (!hasProvidedTreeId && trees != null && trees.length > 0) {
      setTreeId(trees[0].id);
    } else {
      setTreeId(props.treeId);
    }
  }, [trees, props.treeId]);

  const handleTreeChange = function(event) {
    setTreeId(event.target.value);
  }

  return (
    <>
      {props.open && (
        <ClayModal
          observer={observer}
          size="lg"
          status="info"
        >
          <ClayModal.Header>Select a flow</ClayModal.Header>
          <ClayModal.Body>
            <ClayForm.Group>
              <label htmlFor="treeSelect">Flow Name</label>
              <ClaySelect aria-label="Select Flow" id="treeSelect" value={treeId} onChange={handleTreeChange}>
                {trees.map(item => (
                  <ClaySelect.Option
                    key={item.id}
                    label={item.treeLabel}
                    value={item.id}
                  />
                ))}
              </ClaySelect>
            </ClayForm.Group>        
          </ClayModal.Body>
          <ClayModal.Footer
          first={
            <ClayButton.Group spaced>
              <ClayButton
                  displayType="secondary"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
              </ClayButton>
            </ClayButton.Group>
          }
            last={
              <ClayButton.Group spaced>
                
                <ClayButton onClick={() => {
                  props.onTreeSelection(treeId);
                  onOpenChange(false);
                }}
                >
                  Select
                </ClayButton>
              </ClayButton.Group>
            }
          />
        </ClayModal>
      )}
    </>
  );
}
  
export default TreeSelectionModal;
