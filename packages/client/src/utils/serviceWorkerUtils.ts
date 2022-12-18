export function registerServiceWorker(reporting = true) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then((registration) => {
        if (reporting) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }
      })
      .catch((error: string) => {
        if (reporting) {
          console.warn('ServiceWorker registration failed: ', error);
        }
      });
  } else {
    if (reporting) {
      console.warn('ServiceWorker is not supported in the browser');
    }
  }
}

export function unregisterServiceWorker(reporting = true) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          if (reporting) {
            console.log('ServiceWorker unregistered: ', registration);
          }
        }
      });
  } else {
    if (reporting) {
      console.warn('ServiceWorker is not supported in the browser');
    }
  }
}
