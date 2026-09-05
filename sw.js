// Service Worker do Primer Barber — responsável por mostrar a notificação
// mesmo com o site fechado. Fica "adormecido" e o navegador o acorda
// quando chega um push.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = { title: 'Primer Barber', body: 'Você tem uma novidade.', url: '/' };
  try { data = { ...data, ...event.data.json() }; } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://primerbarber.com.br/icon-192.png',
      badge: 'https://primerbarber.com.br/icon-192.png',
      tag: 'primerbarber-notif',
      renotify: true,
      data: { url: data.url || '/' },
    })
  );
});

// Ao clicar na notificação, abre (ou foca) o site
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
