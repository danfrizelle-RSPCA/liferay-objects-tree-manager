import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'ckeditor5/ckeditor5.css';

import ClayButton from '@clayui/button';
import ClayForm, { ClayInput } from '@clayui/form';
import ClayPanel from '@clayui/panel';

function AccordionEditor(props) {
  const {
    editorConfig,
    accordions,
    setAccordions,
    deletedAccordionIds,
    setDeletedAccordionIds,
    loading = false,
  } = props;

  const deletedIds = deletedAccordionIds ?? [];
  const hasDeleteTracking = typeof setDeletedAccordionIds === 'function';

  const visibleIndexes = [];
  (accordions || []).forEach((acc, index) => {
    if (!deletedIds.includes(acc?.id)) {
      visibleIndexes.push(index);
    }
  });

  return (
    <ClayPanel className="mt-3">
      <ClayPanel.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="m-0">Accordions</h4>
          <ClayButton
            displayType="secondary"
            onClick={() =>
              setAccordions((prev) => [
                ...(prev || []),
                { id: null, title: '', content: '' },
              ])
            }
          >
            Add accordion
          </ClayButton>
        </div>

        {loading && <div>Loading accordions…</div>}

        {!loading && visibleIndexes.length === 0 && (
          <div className="text-muted">No accordions</div>
        )}

        {visibleIndexes.map((originalIndex) => {
          const acc = accordions[originalIndex];

          return (
            <div
              key={`${acc?.id ?? 'new'}-${originalIndex}`}
              className="mb-3 p-2 bg-white"
              style={{ border: '1px solid #eee' }}
            >
              <ClayForm.Group>
                <label>Heading</label>
                <ClayInput
                  value={acc?.title ?? ''}
                  onChange={(e) =>
                    setAccordions((prev) =>
                      (prev || []).map((a, idx) =>
                        idx === originalIndex
                          ? { ...a, title: e.target.value }
                          : a
                      )
                    )
                  }
                />
              </ClayForm.Group>

              <ClayForm.Group>
                <label>Content</label>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={acc?.content || ''}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setAccordions((prev) =>
                      (prev || []).map((a, idx) =>
                        idx === originalIndex ? { ...a, content: data } : a
                      )
                    );
                  }}
                />
              </ClayForm.Group>

              <div className="d-flex justify-content-end">
                <ClayButton
                  displayType="link"
                  onClick={() => {
                    if (hasDeleteTracking && acc?.id) {
                      setDeletedAccordionIds((prev) => [...(prev || []), acc.id]);
                      return;
                    }

                    setAccordions((prev) =>
                      (prev || []).filter((_, idx) => idx !== originalIndex)
                    );
                  }}
                >
                  Remove
                </ClayButton>
              </div>
            </div>
          );
        })}
      </ClayPanel.Body>
    </ClayPanel>
  );
}

export default AccordionEditor;
