import { useEffect, useMemo, useState } from 'react';

import {
  BalloonToolbar,
  Bold,
  Essentials,
  FindAndReplace,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  RemoveFormat,
  Underline,
} from 'ckeditor5';

const LICENSE_KEY = 'GPL';

export const useCkEditorConfig = () => {
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
          items: [
            'undo', 'redo', '|', 'findAndReplace', '|', 'heading', '|', 'bold', 'italic', 'underline', 'removeFormat', '|', 'link', '|', 'bulletedList', 'numberedList'
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          BalloonToolbar,
          Bold,
          Essentials,
          FindAndReplace,
          Heading,
          Italic,
          Link,
          List,
          Paragraph,
          RemoveFormat,
          Underline,
        ],
        balloonToolbar: [
          'bold',
          'italic',
          '|',
          'link',
          '|',
          'bulletedList',
          'numberedList',
        ],
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph',
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1',
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2',
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3',
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4',
            },
            {
              model: 'heading5',
              view: 'h5',
              title: 'Heading 5',
              class: 'ck-heading_heading5',
            },
            {
              model: 'heading6',
              view: 'h6',
              title: 'Heading 6',
              class: 'ck-heading_heading6',
            },
          ],
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
                download: 'file',
              },
            },
          },
        },
        placeholder: 'Type or paste your content here!',
      },
    };
  }, [isLayoutReady]);

  return { editorConfig };
};
