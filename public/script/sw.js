if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service worker registration failed:', error);
    });
}

self.addEventListener('push', (event) => {
  const data = event.data
  const message = data.text()
  self.registration.showNotification(message)
})