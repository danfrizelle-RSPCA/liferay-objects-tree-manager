import React, { useState, useEffect, useRef, useMemo } from "react";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'ckeditor5/ckeditor5.css';

import ClayButton from "@clayui/button";
import ClayModal, { useModal } from "@clayui/modal";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayIcon from '@clayui/icon';
import ClayPanel from '@clayui/panel';

const LICENSE_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Njk2NDQ3OTksImp0aSI6ImFiMzVlMjZjLTY1NjUtNDk0ZC05M2VmLWEyNDQ2N2U5NWEzMyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjFlMGY0MGNjIn0.60BUxFrWnIbp7G45iUw2EoMYvruOgVKqTArUAQbVdMW1gro20Q_xDQh4nN2a5hLnXfMuaDQT7vrR_dI_Wh49qQ';

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
  const [accordion1Heading, setAccordion1Heading] = useState("");
  const [accordion1Content, setAccordion1Content] = useState("");
  const [accordion2Heading, setAccordion2Heading] = useState("");
  const [accordion2Content, setAccordion2Content] = useState("");
  const [accordion3Heading, setAccordion3Heading] = useState("");
  const [accordion3Content, setAccordion3Content] = useState("");

  useEffect(() => {
    setNodeTitle(props.nodeTitle);
    setNodeText(props.nodeText);
    setNodeImage(props.nodeImage);
    setNodeRoot(props.nodeRoot);
    setAccordion1Heading(props.accordion1Heading || "");
    setAccordion1Content(props.accordion1Content || "");
    setAccordion2Heading(props.accordion2Heading || "");
    setAccordion2Content(props.accordion2Content || "");
    setAccordion3Heading(props.accordion3Heading || "");
    setAccordion3Content(props.accordion3Content || "");
  }, [
    props.nodeTitle,
    props.nodeText,
    props.nodeImage,
    props.nodeRoot,
    props.accordion1Heading,
    props.accordion1Content,
    props.accordion2Heading,
    props.accordion2Content,
    props.accordion3Heading,
    props.accordion3Content,
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

        {props.outgoingEdgeCount === 0 && (
        <ClayPanel.Group>
          <ClayPanel
            displayTitle="Accordion 1"
            displayType="secondary"
            collapsible
            expanded={false}
          >
            <ClayPanel.Body>
              <ClayForm.Group>
                <label htmlFor="accordion1Heading">Heading</label>
                <ClayInput
                  id="accordion1Heading"
                  placeholder="Heading for first accordion"
                  value={accordion1Heading}
                  onChange={(e) => setAccordion1Heading(e.target.value)}
                  type="text"
                />
              </ClayForm.Group>
              <ClayForm.Group>
                <label>Content</label>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={accordion1Content || ""}
                  onChange={(event, editor) => {
                    setAccordion1Content(editor.getData());
                  }}
                />
              </ClayForm.Group>
            </ClayPanel.Body>
          </ClayPanel>

          <ClayPanel
            displayTitle="Accordion 2"
            displayType="secondary"
            collapsible
            expanded={false}
          >
            <ClayPanel.Body>
              <ClayForm.Group>
                <label htmlFor="accordion2Heading">Heading</label>
                <ClayInput
                  id="accordion2Heading"
                  placeholder="Heading for second accordion"
                  value={accordion2Heading}
                  onChange={(e) => setAccordion2Heading(e.target.value)}
                  type="text"
                />
              </ClayForm.Group>
              <ClayForm.Group>
                <label>Content</label>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={accordion2Content || ""}
                  onChange={(event, editor) => {
                    setAccordion2Content(editor.getData());
                  }}
                />
              </ClayForm.Group>
            </ClayPanel.Body>
          </ClayPanel>

          <ClayPanel
            displayTitle="Accordion 3"
            displayType="secondary"
            collapsible
          >
            <ClayPanel.Body>
              <ClayForm.Group>
                <label htmlFor="accordion3Heading">Heading</label>
                <ClayInput
                  id="accordion3Heading"
                  placeholder="Heading for third accordion"
                  value={accordion3Heading}
                  onChange={(e) => setAccordion3Heading(e.target.value)}
                  type="text"
                />
              </ClayForm.Group>
              <ClayForm.Group>
                <label>Content</label>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={accordion3Content || ""}
                  onChange={(event, editor) => {
                    setAccordion3Content(editor.getData());
                  }}
                />
              </ClayForm.Group>
            </ClayPanel.Body>
          </ClayPanel>
        </ClayPanel.Group>
        )}
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
              onClick={() => {
                props.onNodeUpdate(nodeTitle, nodeText, nodeImage, accordion1Heading, accordion1Content, accordion2Heading, accordion2Content, accordion3Heading, accordion3Content);
                onOpenChange(false);
              }}
            >
              Save changes
            </ClayButton>
          </ClayButton.Group>
        }
      />
    </ClayModal>
  );
}

export default NodeUpdateModal;
