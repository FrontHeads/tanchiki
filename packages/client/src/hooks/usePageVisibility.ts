import { useEffect, useState } from 'react';

import { getBrowserVisibilityEventName, getIsDocumentVisible } from './../utils/webApiUtils';

export function usePageVisibility() {
  /**
   * Данный API не нужен при генерации SSR, но обращение к document
   * приводит к ошибкам в консоли. В связи с этим для SSR делаем
   * возврат isVisible: true в любом случае
   */
  const getIsVisible = typeof document === 'undefined' ? () => true : () => getIsDocumentVisible(document);

  const [isVisible, setIsVisible] = useState(getIsVisible());
  const onVisibilityChange = () => setIsVisible(getIsVisible());

  useEffect(() => {
    const visibilityChange = getBrowserVisibilityEventName(document);

    document.addEventListener(visibilityChange, onVisibilityChange, false);

    return () => {
      document.removeEventListener(visibilityChange, onVisibilityChange);
    };
  });

  return isVisible;
}
