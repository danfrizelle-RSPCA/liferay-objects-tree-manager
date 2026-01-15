import React, { useState, useEffect, useRef, useMemo } from "react";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'ckeditor5/ckeditor5.css';

import ClayButton from "@clayui/button";
import ClayModal, { useModal } from "@clayui/modal";
import ClayForm, { ClayInput } from "@clayui/form";

const LICENSE_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Njk2NDQ3OTksImp0aSI6ImFiMzVlMjZjLTY1NjUtNDk0ZC05M2VmLWEyNDQ2N2U5NWEzMyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjFlMGY0MGNjIn0.60BUxFrWnIbp7G45iUw2EoMYvruOgVKqTArUAQbVdMW1gro20Q_xDQh4nN2a5hLnXfMuaDQT7vrR_dI_Wh49qQ';

const DUMMY_TEXT = `
  <h2>Dummy content from React</h2>
  <p>This text should appear immediately.</p>
  <p><strong>If you see this, CKEditor is wired correctly.</strong></p>
`;

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
        // initialData:
        //   '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
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

  const [advanced, setAdvanced] = useState(false);
  const [dptUrl, setDptUrl] = useState(null);
  const [modalSize, setModalSize] = useState("lg");

  const { observer, onOpenChange, open, onClose } = useModal({
    onClose: props.onClose,
  });

  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeText, setNodeText] = useState("");
  const [nodeImage, setNodeImage] = useState(null);
  const [nodeRoot, setNodeRoot] = useState(false);

  useEffect(() => {
    setNodeTitle(props.nodeTitle);
    setNodeText(props.nodeText);
    setNodeImage(props.nodeImage);
    setNodeRoot(props.nodeRoot);

    if (props.currentNode != null) {
      setDptUrl(
        props.nodeDptBaseUrl + props.currentNode.id + "?p_p_state=pop_up"
      );
    }
  }, [
    props.nodeTitle,
    props.nodeText,
    props.nodeImage,
    props.nodeRoot,
    props.currentNode,
    props.nodeDptBaseUrl,
  ]);

  useEffect(() => {
    setModalSize(advanced ? "full-screen" : "lg");
  }, [advanced]);

  const handleNodeTitleChange = (event) => setNodeTitle(event.target.value);
  const handleNodeTextChange = (event) => setNodeText(event.target.value);

  if (!props.open) return null;

  const renderBody = () => {
    if (advanced && dptUrl) {
      return <ClayModal.Body url={dptUrl} />;
    }

    return (
      <ClayModal.Body>
        <ClayForm.Group>
          <label htmlFor="nodeTitle">Node Title</label>
          <ClayInput
            id="nodeTitle"
            placeholder="Insert a title for the Node here"
            value={nodeTitle}
            onChange={handleNodeTitleChange}
            type="text"
          />
        </ClayForm.Group>

        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={nodeText || ""}
          onChange={(event, editor) => {
            setNodeText(editor.getData());
          }}
        />

        <ClayForm.Group>
          <label htmlFor="nodeImage">Node Image</label>
          <ClayInput
            id="nodeImage"
            placeholder="Select an image from Documents and Media"
            value={nodeImage?.link?.href}
            readOnly
          />
        </ClayForm.Group>
      </ClayModal.Body>
    );
  };

  return (
    <ClayModal observer={observer} size={modalSize} status="info">
      <ClayModal.Header>
        Update a Node {nodeRoot ? "[Root node]" : ""}
      </ClayModal.Header>

      {renderBody()}

      <ClayModal.Footer
        last={
          <ClayButton.Group spaced>
            <ClayButton
              displayType="danger"
              disabled={nodeRoot}
              onClick={() => {
                props.onNodeDeletion();
                onOpenChange(false);
              }}
            >
              Delete Node
            </ClayButton>

            <ClayButton
              displayType="secondary"
              onClick={() => setAdvanced(!advanced)}
            >
              Toggle Advanced
            </ClayButton>

            <ClayButton
              displayType="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </ClayButton>

            <ClayButton
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
              disabled={advanced}
              onClick={() => {
                props.onNodeUpdate(nodeTitle, nodeText, nodeImage);
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
