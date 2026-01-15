import React, { useState } from "react";

import ClayButton from "@clayui/button";
import ClayModal, { useModal } from "@clayui/modal";
import ClayForm, { ClayInput } from "@clayui/form";

function EdgeCreationModal(props) {
  const { observer, onOpenChange, open, onClose } = useModal({
    onClose: props.onClose,
  });

  const [edgeLabel, setEdgeLabel] = useState("");

  const handleEdgeLabelChange = function (event) {
    setEdgeLabel(event.target.value);
  };

  return (
    <>
      {props.open && (
        <ClayModal observer={observer} size="lg" status="info">
          <ClayModal.Header>Create a new Answer</ClayModal.Header>
          <ClayModal.Body>
            <ClayForm.Group>
              <label htmlFor="nodeLabel">Answer Name</label>
              <ClayInput
                id="nodeLabel"
                placeholder="Choose a name for the Answer"
                onChange={handleEdgeLabelChange}
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
                <ClayButton
                  onClick={() => {
                    props.onEdgeCreation(edgeLabel);
                    setEdgeLabel("");
                    onOpenChange(false);
                  }}
                >
                  Save changes
                </ClayButton>
              </ClayButton.Group>
            }
          />
        </ClayModal>
      )}
    </>
  );
}

export default EdgeCreationModal;
