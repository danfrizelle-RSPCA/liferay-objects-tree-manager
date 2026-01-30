import React, { useState, useEffect } from "react";

import ClayButton from "@clayui/button";
import ClayModal, { useModal } from "@clayui/modal";
import ClayForm, { ClayInput } from "@clayui/form";

function EdgeEditionModal(props) {
  const modalSize = "lg";

  const { observer, onOpenChange } = useModal({
    onClose: props.onClose,
  });

  const [edgeLabel, setEdgeLabel] = useState("");

  useEffect(() => {
    setEdgeLabel(props.label);
  }, [props]);

  const handleEdgeLabelChange = function (event) {
    setEdgeLabel(event.target.value);
  };

  return (
    <>
      {props.open && (
        <ClayModal observer={observer} size={modalSize} status="info">
          <ClayModal.Header>Update Answer</ClayModal.Header>
          <ClayModal.Body>
            <ClayForm.Group>
              <label htmlFor="nodeLabel">Answer Name</label>
              <ClayInput
                id="nodeLabel"
                placeholder="Insert name here"
                value={edgeLabel}
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
                <ClayButton
                  displayType="danger"
                  onClick={() => {
                    props.onEdgeDeletion();
                    onOpenChange(false);
                  }}
                >
                  Delete
                </ClayButton>
              </ClayButton.Group>
            }
            last={
              <ClayButton.Group spaced>
                <ClayButton
                  onClick={() => {
                    props.onLabelChange(edgeLabel);
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

export default EdgeEditionModal;
