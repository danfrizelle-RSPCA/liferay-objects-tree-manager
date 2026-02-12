import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';

import ClayButton from '@clayui/button';
import ClayForm, { ClayInput } from '@clayui/form';

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
    if (index === 0 || !deletedIds.includes(acc?.id)) {
      visibleIndexes.push(index);
    }
  });

  const hasAnyAccordions = (accordions || []).length > 0;
  const itemsToRender = hasAnyAccordions
    ? visibleIndexes.map((index) => ({ index, isPlaceholder: false }))
    : [{ index: 0, isPlaceholder: true }];

  return (
    <ClayForm.Group className="mt-3">
      {itemsToRender.map(({ index: originalIndex, isPlaceholder }, renderIndex) => {
        const acc = (accordions && accordions[originalIndex]) || {
          id: null,
          title: '',
          content: '',
        };

        const displayNumber = renderIndex + 1;

        return (
          <div key={`${acc?.id ?? 'new'}-${originalIndex + 1}`}>
            <div className="p-3 border mb-1">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Accordion {displayNumber}</h4>

                {!isPlaceholder && originalIndex !== 0 && (
                  <ClayButton
                    displayType="danger"
                    disabled={loading}
                    onClick={() => {
                      if (originalIndex === 0) {
                        return;
                      }

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
                )}
              </div>

              <label htmlFor={`acc-heading-${displayNumber}`}>Heading</label>
              <ClayInput
                id={`acc-heading-${displayNumber}`}
                value={acc?.title ?? ''}
                disabled={loading}
                onChange={(e) =>
                  setAccordions((prev) =>
                    (prev && prev.length > originalIndex
                      ? prev.map((a, idx) =>
                          idx === originalIndex
                            ? { ...a, title: e.target.value }
                            : a
                        )
                      : (() => {
                          const next = [...(prev || [])];
                          while (next.length <= originalIndex) {
                            next.push({ id: null, title: '', content: '' });
                          }
                          next[originalIndex] = {
                            ...(next[originalIndex] || {
                              id: null,
                              title: '',
                              content: '',
                            }),
                            title: e.target.value,
                          };
                          return next;
                        })())
                  )
                }
              />

              <div className="mt-3">
                <label htmlFor={`acc-content-${displayNumber}`}>Content</label>
                <CKEditor
                  id={`acc-content-${displayNumber}`}
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={acc?.content || ''}
                  disabled={loading}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setAccordions((prev) =>
                      (prev && prev.length > originalIndex
                        ? (prev || []).map((a, idx) =>
                            idx === originalIndex ? { ...a, content: data } : a
                          )
                        : (() => {
                            const next = [...(prev || [])];
                            while (next.length <= originalIndex) {
                              next.push({ id: null, title: '', content: '' });
                            }
                            next[originalIndex] = {
                              ...(next[originalIndex] || {
                                id: null,
                                title: '',
                                content: '',
                              }),
                              content: data,
                            };
                            return next;
                          })())
                    );
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
      <ClayButton
        displayType="secondary"
        className="mt-3"
        disabled={loading}
        onClick={() =>
          setAccordions((prev) => {
            const next = [...(prev || [])];

            if (next.length === 0) {
              next.push({ id: null, title: '', content: '' });
            }

            next.push({ id: null, title: '', content: '' });

            return next;
          })
        }
      >
        Add accordion
      </ClayButton>
    </ClayForm.Group>
  );
}

export default AccordionEditor;
