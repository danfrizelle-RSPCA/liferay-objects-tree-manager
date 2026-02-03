import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

import ClayForm, { ClayInput } from '@clayui/form';

function NodeFieldsForm(props) {
  const {
    editorConfig,
    nodeTitle,
    setNodeTitle,
    nodeText,
    setNodeText,
    nodeImageValue,
    nodeImageReadOnly = true,
    onNodeImageChange,
    imagePlaceholder,
  } = props;

  return (
    <>
      <ClayForm.Group>
        <label htmlFor="nodeTitle">Question</label>
        <ClayInput
          id="nodeTitle"
          placeholder="Enter the question/title here"
          value={nodeTitle}
          onChange={(e) => setNodeTitle(e.target.value)}
          type="text"
        />
      </ClayForm.Group>

      <ClayForm.Group>
        <label>Body</label>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={nodeText || ''}
          onChange={(event, editor) => {
            setNodeText(editor.getData());
          }}
        />
      </ClayForm.Group>

      <ClayForm.Group>
        <label htmlFor="nodeImage">Image</label>
        <ClayInput
          id="nodeImage"
          placeholder={imagePlaceholder}
          value={nodeImageValue}
          readOnly={nodeImageReadOnly}
          onChange={onNodeImageChange}
        />
      </ClayForm.Group>
    </>
  );
}

export default NodeFieldsForm;
