importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase config is injected at build time via sw template or set here
// Falls back gracefully if not configured
const firebaseConfig = self.FIREBASE_CONFIG || {};

try {
  if (firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const { title, body, icon } = payload.notification || {};
      self.registration.showNotification(title || 'NAMMA VOTE', {
        body: body || 'New election update',
        icon: icon || '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'nammavote-notification',
        data: payload.data || {},
        actions: [
          { action: 'open', title: 'Open App' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
      });
    });
  }
} catch (e) {
  console.log('[FCM SW] Firebase not configured:', e.message);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
