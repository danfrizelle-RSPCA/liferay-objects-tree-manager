import React, { useState, useEffect, useRef } from "react";

import ClayButton from "@clayui/button";
import ClayModal, { useModal } from "@clayui/modal";
import AccordionEditor from '../components/AccordionEditor';
import NodeFieldsForm from '../components/NodeFieldsForm';
import { useCkEditorConfig } from '../../shared/hooks/useCkEditorConfig';

function NodeUpdateModal(props) {

  const { editorConfig } = useCkEditorConfig();

  const [modalSize] = useState("lg");

  const { observer, onOpenChange } = useModal({
    onClose: props.onClose,
  });

  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeText, setNodeText] = useState("");
  const [nodeImage, setNodeImage] = useState(null);
  const [nodeRoot, setNodeRoot] = useState(false);
  const [accordions, setAccordions] = useState([]);
  const [accordionLoading, setAccordionLoading] = useState(false);
  const [accordionSaving, setAccordionSaving] = useState(false);
  const [deletedAccordionIds, setDeletedAccordionIds] = useState([]);
  const accordionLoadRequestIdRef = useRef(0);

  useEffect(() => {
    setNodeTitle(props.nodeTitle);
    setNodeText(props.nodeText);
    setNodeImage(props.nodeImage);
    setNodeRoot(props.nodeRoot);
    // load accordions for current node if accordionService provided
    if (props.accordionService && props.currentNode && props.currentNode.id) {
      // Immediately clear old node accordions so we don't show stale content while loading.
      setAccordions([]);
      setDeletedAccordionIds([]);

      const requestId = ++accordionLoadRequestIdRef.current;
      setAccordionLoading(true);
      props.accordionService.getAccordions(props.currentNode.id)
        .then(items => {
          if (accordionLoadRequestIdRef.current !== requestId) {
            return;
          }
          // normalize to { id, title, content }
          setAccordions(items.map(it => ({ id: it.id, title: it.accordionHeading || it.title || '', content: it.accordionContent || it.content || '' })));
          setDeletedAccordionIds([]);
          setAccordionLoading(false);
        }).catch(err => {
          if (accordionLoadRequestIdRef.current !== requestId) {
            return;
          }
          console.error('Failed to load accordions in modal', err);
          setAccordions([]);
          setAccordionLoading(false);
        });
    } else {
      setAccordions([]);
      setDeletedAccordionIds([]);
      setAccordionLoading(false);
    }
  }, [
    props.nodeTitle,
    props.nodeText,
    props.nodeImage,
    props.nodeRoot,
    props.currentNode,
    props.accordionService
  ]);

  if (!props.open) return null;

  const renderBody = () => {
    return (
      <ClayModal.Body>
        <NodeFieldsForm
          editorConfig={editorConfig}
          nodeTitle={nodeTitle}
          setNodeTitle={setNodeTitle}
          nodeText={nodeText}
          setNodeText={setNodeText}
          nodeImageValue={nodeImage?.link?.href || ''}
          imagePlaceholder="Select an image from Documents and Media"
          nodeImageReadOnly={true}
        />

        <AccordionEditor
          editorConfig={editorConfig}
          accordions={accordions}
          setAccordions={setAccordions}
          deletedAccordionIds={deletedAccordionIds}
          setDeletedAccordionIds={setDeletedAccordionIds}
          loading={accordionLoading}
        />
      </ClayModal.Body>
    );
  };

  return (
    <ClayModal observer={observer} size={modalSize} status="info">
      <ClayModal.Header>
        Update a Question{nodeRoot ? "*" : ""}
      </ClayModal.Header>

      {renderBody()}

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
              disabled={nodeRoot}
              onClick={() => {
                props.onNodeDeletion();
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
              disabled={nodeRoot}
              displayType="secondary"
              onClick={() => {
                props.onNodeSetAsStart();
                setNodeRoot(true);
                onOpenChange(false);
              }}
            >
              Set as start node
            </ClayButton>

            <ClayButton
              disabled={accordionSaving}
              onClick={async () => {
                // First persist accordions (create or update) if service is available
                if (props.accordionService) {
                  setAccordionSaving(true);
                  try {
                    const toDelete = deletedAccordionIds.slice();
                    const toCreate = accordions.filter(a => !a.id);
                    const toUpdate = accordions.filter(a => a.id && !deletedAccordionIds.includes(a.id));

                    // create new accordions
                    await Promise.all(toCreate.map(acc => 
                      props.accordionService.createAccordion(props.currentNode.id, acc.title, acc.content)
                        .then(newItem => ({ ...acc, id: newItem.id }))
                        .catch(err => { console.error('Create failed', err); return null; })
                    ));

                    // update existing accordions
                    await Promise.all(toUpdate.map(acc => 
                      props.accordionService.updateAccordion(acc.id, acc.title, acc.content).catch(err => { console.error('Update failed', err); })
                    ));

                    // delete marked accordions
                    await Promise.all(toDelete.map(id => 
                      props.accordionService.deleteAccordion(id).catch(err => { console.error('Delete failed', err); })
                    ));

                    // reload authoritative accordions from server to ensure relationship fields etc are present
                    try {
                      const refreshed = await props.accordionService.getAccordions(props.currentNode.id);
                      setAccordions(refreshed.map(it => ({ id: it.id, title: it.accordionHeading || it.title || '', content: it.accordionContent || it.content || '' })));
                      setDeletedAccordionIds([]);
                    } catch (refreshErr) {
                      console.warn('Failed to refresh accordions after save', refreshErr);
                    }
                  } catch (err) {
                    console.error('Failed to save accordions', err);
                    // continue to attempt node save even if accordions fail
                  } finally {
                    setAccordionSaving(false);
                  }
                }

                // Persist node changes
                props.onNodeUpdate(nodeTitle, nodeText, nodeImage);
                onOpenChange(false);
              }}
            >
              {accordionSaving ? 'Saving…' : 'Save changes'}
            </ClayButton>
          </ClayButton.Group>
        }
      />
    </ClayModal>
  );
}

export default NodeUpdateModal;
