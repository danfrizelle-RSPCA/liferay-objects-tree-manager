import React, { useState, useEffect, useRef, useMemo } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'ckeditor5/ckeditor5.css';

import ClayButton from '@clayui/button';
import ClayModal, {useModal} from '@clayui/modal';
import ClayForm, {ClayInput} from '@clayui/form';

const LICENSE_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Njk2NDQ3OTksImp0aSI6ImFiMzVlMjZjLTY1NjUtNDk0ZC05M2VmLWEyNDQ2N2U5NWEzMyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjFlMGY0MGNjIn0.60BUxFrWnIbp7G45iUw2EoMYvruOgVKqTArUAQbVdMW1gro20Q_xDQh4nN2a5hLnXfMuaDQT7vrR_dI_Wh49qQ';

function NodeCreationModal(props) {

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


  const { observer, onOpenChange, open, onClose } = useModal({
    onClose: props.onClose
  });

  const [edgeLabel, setEdgeLabel] = useState('');
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeText, setNodeText] = useState('');
  const [nodeImage, setNodeImage] = useState('');

  const handleEdgeLabelChange = function(event) {
    setEdgeLabel(event.target.value);
  }
  
  const handleNodeTitleChange = function(event) {
    setNodeTitle(event.target.value);
  }

  const handleNodeImageChange = function(event) {
    setNodeImage(event.target.value);
  }

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
            <ClayForm.Group>
              <label htmlFor="nodeTitle">Question</label>
              <ClayInput
                id="nodeTitle"
                placeholder="Insert a title for the new Node here"
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
                placeholder="Insert an image URL"
                value={nodeImage}
                // component="select"
                onChange={handleNodeImageChange}
                type="text"
                readOnly
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
                  props.onNodeCreation(edgeLabel, nodeTitle, nodeText);
                  setEdgeLabel('');
                  setNodeTitle('');
                  setNodeText('');
                  onOpenChange(false);
                }}>
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
  
export default NodeCreationModal;