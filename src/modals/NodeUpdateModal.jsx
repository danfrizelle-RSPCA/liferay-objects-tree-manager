import React, { useState, useEffect, useRef, useMemo } from "react";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'ckeditor5/ckeditor5.css';

import ClayButton from "@clayui/button";
import ClayModal, { useModal } from "@clayui/modal";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayIcon from '@clayui/icon';
import ClayPanel from '@clayui/panel';

const LICENSE_KEY = 'GPL';

function NodeUpdateModal(props) {

  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        toolbar: {
          items: ['undo', 'redo', '|', 'bold', 'italic', '|', 'link'],
          shouldNotGroupWhenFull: false
        },
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            toggleDownloadable: {
              mode: 'manual',
              label: 'Downloadable',
              attributes: {
                download: 'file'
              }
            }
          }
        },
        placeholder: 'Type or paste your content here!'
      }
    };
  }, [isLayoutReady]);

  const [modalSize, setModalSize] = useState("lg");

  const { observer, onOpenChange, open, onClose } = useModal({
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

  useEffect(() => {
    setNodeTitle(props.nodeTitle);
    setNodeText(props.nodeText);
    setNodeImage(props.nodeImage);
    setNodeRoot(props.nodeRoot);
    // load accordions for current node if accordionService provided
    if (props.accordionService && props.currentNode && props.currentNode.id) {
      setAccordionLoading(true);
      props.accordionService.getAccordions(props.currentNode.id)
        .then(items => {
          // normalize to { id, title, content }
          setAccordions(items.map(it => ({ id: it.id, title: it.accordionHeading || it.title || '', content: it.accordionContent || it.content || '' })));
          setDeletedAccordionIds([]);
          setAccordionLoading(false);
        }).catch(err => {
          console.error('Failed to load accordions in modal', err);
          setAccordions([]);
          setAccordionLoading(false);
        });
    } else {
      setAccordions([]);
    }
  }, [
    props.nodeTitle,
    props.nodeText,
    props.nodeImage,
    props.nodeRoot,
    props.currentNode,
    props.nodeDptBaseUrl,
  ]);

  const handleNodeTitleChange = (event) => setNodeTitle(event.target.value);

  if (!props.open) return null;

  const renderBody = () => {
    return (
      <ClayModal.Body>
        <ClayForm.Group>
          <label htmlFor="nodeTitle">Question</label>
          <ClayInput
            id="nodeTitle"
            placeholder="Enter the question/title here"
            value={nodeTitle}
            onChange={handleNodeTitleChange}
            type="text"
          />
        </ClayForm.Group>
        <ClayForm.Group>
          <label>Body</label>
          <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            data={nodeText || ""}
            onChange={(event, editor) => {
              setNodeText(editor.getData());
            }}
          />
        </ClayForm.Group>

        <ClayForm.Group>
          <label htmlFor="nodeImage">Image</label>
          <ClayInput
            id="nodeImage"
            placeholder="Select an image from Documents and Media"
            value={nodeImage?.link?.href}
            readOnly
          />
        </ClayForm.Group>

        <ClayPanel className="mt-3">
          <ClayPanel.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="m-0">Accordions</h4>
              <ClayButton displayType="secondary" onClick={() => setAccordions(prev => [...prev, { id: null, title: '', content: '' }])}>Add accordion</ClayButton>
            </div>

            {accordionLoading && <div>Loading accordions…</div>}

            {!accordionLoading && accordions.length === 0 && <div className="text-muted">No accordions</div>}

            {accordions.filter(a => !deletedAccordionIds.includes(a.id)).map((acc, idx) => (
              <div key={idx} className="mb-3 p-2 bg-white" style={{ border: '1px solid #eee' }}>
                <ClayForm.Group>
                  <label>Heading</label>
                  <ClayInput value={acc.title} onChange={(e) => setAccordions(prev => prev.map((a,i)=> i===idx ? { ...a, title: e.target.value } : a))} />
                </ClayForm.Group>

                <ClayForm.Group>
                  <label>Content</label>
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={acc.content || ''}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setAccordions(prev => prev.map((a,i)=> i===idx ? { ...a, content: data } : a));
                    }}
                  />
                </ClayForm.Group>

                <div className="d-flex justify-content-end">
                  <ClayButton displayType="link" onClick={() => {
                    // mark for deletion locally; actual delete happens on main Save
                    if (acc.id) {
                      setDeletedAccordionIds(prev => [...prev, acc.id]);
                    } else {
                      // unsaved item: remove immediately
                      setAccordions(prev => prev.filter((_,i) => i !== idx));
                    }
                  }}>Remove</ClayButton>
                </div>
              </div>
            ))}
          </ClayPanel.Body>
        </ClayPanel>
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
              <ClayIcon symbol="trash"/>Delete
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
                    const created = await Promise.all(toCreate.map(acc => 
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
