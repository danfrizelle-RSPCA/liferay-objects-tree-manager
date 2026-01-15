import React, { useState, useEffect } from 'react';

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import ClayForm, {ClayInput} from '@clayui/form';

function TreeCreationModal(props) {

  const { observer, onOpenChange, open, onClose } = useModal({
    onClose: props.onClose
  });

  const [treeLabel, setTreeLabel] = useState('');

  const handleTreeLabelChange = function(event) {
    setTreeLabel(event.target.value);
  }  

  return (
    <>
      {props.open && (
        <ClayModal
          observer={observer}
          size="lg"
          status="info"
        >
          <ClayModal.Header>Create a flow</ClayModal.Header>
          <ClayModal.Body>
            <ClayForm.Group>
              <label htmlFor="treeLabel">Flow Name</label>
              <ClayInput
                id="treeLabel"
                placeholder="Choose a label for the Flow"
                onChange={handleTreeLabelChange}
                type="text"
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
                <ClayButton onClick={() => {
                  props.onTreeCreation(treeLabel);
                  onOpenChange(false);
                }}
                >
                  Submit
                </ClayButton>
              </ClayButton.Group>
            }
          />
        </ClayModal>
      )}
    </>
  );
}
  
export default TreeCreationModal;