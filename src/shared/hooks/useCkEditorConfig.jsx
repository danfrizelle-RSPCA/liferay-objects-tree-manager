import { useEffect, useMemo, useState } from 'react';

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
          items: ['undo', 'redo', '|', 'bold', 'italic', '|', 'link'],
          shouldNotGroupWhenFull: false,
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
