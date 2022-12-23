import { useEffect, useState } from 'react';

import { getBrowserVisibilityProp, getIsDocumentHidden } from './../utils/webApiUtils';

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(getIsDocumentHidden(document));
  const onVisibilityChange = () => setIsVisible(getIsDocumentHidden(document));

  useEffect(() => {
    const visibilityChange = getBrowserVisibilityProp(document);

    if (visibilityChange) {
      document.addEventListener(visibilityChange, onVisibilityChange, false);
    }

    return () => {
      if (visibilityChange) {
        document.removeEventListener(visibilityChange, onVisibilityChange);
      }
    };
  });

  return isVisible;
}
