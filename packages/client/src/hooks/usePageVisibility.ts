import { useEffect, useState } from 'react';

import { getBrowserVisibilityEventName, getIsDocumentVisible } from '../utils/webApiUtils';

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(getIsDocumentVisible(document));
  const onVisibilityChange = () => setIsVisible(getIsDocumentVisible(document));

  useEffect(() => {
    const visibilityChange = getBrowserVisibilityEventName(document);

    document.addEventListener(visibilityChange, onVisibilityChange, false);

    return () => {
      document.removeEventListener(visibilityChange, onVisibilityChange);
    };
  });

  return isVisible;
}
