import React, { useState } from 'react';

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import ClayForm, {ClayInput} from '@clayui/form';
import AccordionEditor from '../components/AccordionEditor';
import NodeFieldsForm from '../components/NodeFieldsForm';
import { useCkEditorConfig } from '../../shared/hooks/useCkEditorConfig';

function NodeCreationModal(props) {

  const { editorConfig } = useCkEditorConfig();


  const { observer, onOpenChange } = useModal({
    onClose: props.onClose
  });

  const [edgeLabel, setEdgeLabel] = useState('');
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeText, setNodeText] = useState('');
  const [nodeImage, setNodeImage] = useState('');
  const [nodeYouTubeID, setNodeYouTubeID] = useState('');

  const [accordions, setAccordions] = useState([]);
  const [accordionSaving, setAccordionSaving] = useState(false);

  const handleEdgeLabelChange = function(event) {
    setEdgeLabel(event.target.value);
  }
  
  const handleNodeImageChange = function(event) {
    setNodeImage(event.target.value);
  }

  const resetForm = () => {
    setEdgeLabel('');
    setNodeTitle('');
    setNodeText('');
    setNodeImage('');
    setNodeYouTubeID('');
    setAccordions([]);
  };

  const handleSave = async () => {
    // Create the node (+ edge) first so we have a node id for accordion creation.
    setAccordionSaving(true);
    try {
      const createdNode = await props.onNodeCreation(edgeLabel, nodeTitle, nodeText, nodeImage, nodeYouTubeID);

      const createdNodeId = createdNode?.id ?? createdNode?.nodeId;

      if (props.accordionService && createdNodeId && accordions.length > 0) {
        const toCreate = accordions
          .map((a) => ({
            title: a?.title ?? '',
            content: a?.content ?? '',
          }))
          .filter((a) => a.title.trim() || a.content.trim());

        await Promise.all(
          toCreate.map((acc) =>
            props.accordionService
              .createAccordion(createdNodeId, acc.title, acc.content)
              .catch((err) => {
                console.error('Create accordion failed', err);
              })
          )
        );
      }

      resetForm();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to create node (and accordions)', err);
      // Keep the modal open so user can retry.
    } finally {
      setAccordionSaving(false);
    }
  };

  return (
    <>
      {props.open && (
        <ClayModal
          observer={observer}
          size="lg"
          status="info"
        >
          <ClayModal.Header>Create a Question</ClayModal.Header>
          <ClayModal.Body>
            <ClayForm.Group>
              <label htmlFor="edgeLabel">Answer Label</label>
              <ClayInput
                id="edgeLabel"
                placeholder="Select a label for the Edge to the new Node"
                value={edgeLabel}
                onChange={handleEdgeLabelChange}
                type="text"
              />
            </ClayForm.Group>

            <NodeFieldsForm
              editorConfig={editorConfig}
              nodeTitle={nodeTitle}
              setNodeTitle={setNodeTitle}
              nodeText={nodeText}
              setNodeText={setNodeText}
              nodeImageValue={nodeImage}
              imagePlaceholder="Insert an image URL"
              nodeImageReadOnly={true}
              onNodeImageChange={handleNodeImageChange}
              nodeYouTubeID={nodeYouTubeID}
              setNodeYouTubeID={setNodeYouTubeID}
            />

            <AccordionEditor
              editorConfig={editorConfig}
              accordions={accordions}
              setAccordions={setAccordions}
            />
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
                
                <ClayButton disabled={accordionSaving} onClick={handleSave}>
                  {accordionSaving ? 'Saving…' : 'Save changes'}
                </ClayButton>
              </ClayButton.Group>
            }
          />
        </ClayModal>
      )}
    </>
  );
}
  
export default NodeCreationModal;
