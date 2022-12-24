export const getBrowserVisibilityEventName = (document: Document & { msHidden?: boolean; webkitHidden?: boolean }) => {
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    return 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    return 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    return 'webkitvisibilitychange';
  }

  return 'visibilitychange';
};

export const getBrowserDocumentHiddenProp = (document: Document & { msHidden?: boolean; webkitHidden?: boolean }) => {
  if (typeof document.hidden !== 'undefined') {
    return 'hidden';
  } else if (typeof document.msHidden !== 'undefined') {
    return 'msHidden';
  } else if (typeof document.webkitHidden !== 'undefined') {
    return 'webkitHidden';
  }
};

export const getIsDocumentVisible = (document: Document & { msHidden?: boolean; webkitHidden?: boolean }) => {
  const visibilityElement = getBrowserDocumentHiddenProp(document);
  return visibilityElement && !document[visibilityElement];
};
