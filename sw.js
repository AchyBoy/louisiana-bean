// Order alerts for the shop's Home Screen app (orders.html). Push + tap only, no caching.
self.addEventListener('install', function(){ self.skipWaiting() });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()) });
self.addEventListener('push', function(e){
  var d = {}; try { d = e.data ? e.data.json() : {} } catch (x) { d = { title: 'New order', body: e.data && e.data.text() } }
  e.waitUntil(Promise.all([
    self.registration.showNotification(d.title || 'New order', { body: d.body || '', tag: d.tag || undefined, icon: '/img/orders-icon-192.png', badge: '/img/orders-icon-192.png', data: { url: d.url || '/orders.html' }, renotify: !!d.tag }),
    self.clients.matchAll({ type: 'window' }).then(function(cs){ cs.forEach(function(c){ c.postMessage({ type: 'order-push' }) }) })
  ]));
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/orders.html';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(cs){
    for (var i = 0; i < cs.length; i++) { if (cs[i].url.indexOf('/orders') > -1 && 'focus' in cs[i]) return cs[i].focus() }
    return self.clients.openWindow(url);
  }));
});
