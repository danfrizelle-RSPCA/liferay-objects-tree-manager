import React from 'react';

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import ClayForm, {ClayInput} from '@clayui/form';

function TreeDeletionModal(props) {

  const { observer, onOpenChange } = useModal({
    onClose: props.onClose
  });

  return (
    <>
      {props.open && (
        <ClayModal
          observer={observer}
          size="lg"
          status="info"
        >
          <ClayModal.Header>Delete a flow</ClayModal.Header>
          <ClayModal.Body>
            <ClayForm.Group>
              <label htmlFor="treeLabel">Flow Name</label>
              <ClayInput
                id="treeLabel"
                disabled={true}
                placeholder="Choose a label for the Flow"
                type="text"
                value={props.treeLabel}
              />              
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
                <ClayButton 
                  displayType="danger"
                  onClick={() => {
                    props.onTreeDeletion(props.treeId);
                    onOpenChange(false);
                  }}
                >
                  Delete
                </ClayButton>
              </ClayButton.Group>
            }
          />
        </ClayModal>
      )}
    </>
  );
}
  
export default TreeDeletionModal;
