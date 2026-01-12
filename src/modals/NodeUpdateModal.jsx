import React, { useState, useEffect } from "react";

import ClayButton from "@clayui/button";
import ClayModal, { useModal } from "@clayui/modal";
import ClayForm, { ClayInput } from "@clayui/form";

function NodeUpdateModal(props) {
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

  const [documents, setDocuments] = useState([]);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);

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

  // ---------------------------
  // DOCUMENTS & MEDIA HANDLER
  // ---------------------------
  const openDocumentsAndMedia = () => {
    setDocModalOpen(true);
    fetchDocuments();
  };

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);

      const themeDisplay = Liferay.ThemeDisplay;
      const groupId = themeDisplay.getScopeGroupId();

      const csrfToken = Liferay.authToken; // required for POST/PUT/DELETE, but some GETs also need it

      const response = await fetch(
        `/o/headless-delivery/v1.0/sites/${groupId}/documents?pageSize=50`,
        {
          headers: {
            Accept: "application/json",
            "X-CSRF-Token": csrfToken,
          },
          credentials: "include", // important: send cookies/session info
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching documents: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(data);
      setDocuments(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleDocumentSelect = (doc) => {
    setNodeImage({
      fileEntryId: doc.id,
      title: doc.title,
      mimeType: doc.contentType,
      link: { href: doc.contentUrl },
    });
    setDocModalOpen(false);
  };

  const renderDocumentPicker = () => {
    if (!docModalOpen) return null;

    return (
      <ClayModal observer={observer} size="md" status="info">
        <ClayModal.Header>Select Image</ClayModal.Header>
        <ClayModal.Body>
          {loadingDocs ? (
            <p>Loading documents...</p>
          ) : documents.length === 0 ? (
            <p>No documents found</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  style={{
                    marginBottom: "8px",
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "5px",
                  }}
                  onClick={() => handleDocumentSelect(doc)}
                >
                  {doc.title}
                </li>
              ))}
            </ul>
          )}
        </ClayModal.Body>
        <ClayModal.Footer
          last={
            <ClayButton
              displayType="secondary"
              onClick={() => setDocModalOpen(false)}
            >
              Cancel
            </ClayButton>
          }
        />
      </ClayModal>
    );
  };

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

        <ClayForm.Group>
          <label htmlFor="nodeText">Node Text</label>
          <ClayInput
            id="nodeText"
            placeholder="Insert a text for the Node"
            value={nodeText}
            component="textarea"
            onChange={handleNodeTextChange}
            type="text"
          />
        </ClayForm.Group>

        <ClayForm.Group>
          <label htmlFor="nodeImage">Node Image</label>
          <ClayInput
            id="nodeImage"
            placeholder="Select an image from Documents and Media"
            value={nodeImage?.link?.href || ""}
            readOnly
            type="text"
          />
        </ClayForm.Group>

        <ClayButton displayType="secondary" onClick={openDocumentsAndMedia}>
          Select image
        </ClayButton>

        {renderDocumentPicker()}
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
