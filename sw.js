
const CACHE_NAME='suji-trip-v2-20261030';
const OFFLINE=['./','./index.html','./manifest.webmanifest'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c=>c.addAll(OFFLINE))
      .then(()=>self.skipWaiting())
  )
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys
          .filter(k=>k.startsWith('sansuu-game-')||k.startsWith('suji-trip-'))
          .filter(k=>k!==CACHE_NAME)
          .map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  )
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;

  e.respondWith(
    fetch(e.request)
      .then(r=>{
        if(r.ok){
          const copy=r.clone();
          caches.open(CACHE_NAME).then(c=>c.put(e.request,copy))
        }
        return r
      })
      .catch(()=>caches.match(e.request)
        .then(r=>r||caches.match('./index.html')))
  )
});
