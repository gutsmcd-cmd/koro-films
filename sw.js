const C="koro-films-v1",F=["box","floor","zoomies","pair","garden","puddle"];
const A=["./","index.html","style.css","app.js","manifest.webmanifest",...F.flatMap(f=>[`films/${f}.mp4`,`films/${f}.jpg`])];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
 const u=new URL(r.url);
 if(r.headers.get("range")&&u.pathname.endsWith(".mp4")){e.respondWith(caches.match(u.pathname.split("/").slice(-2).join("/"),{ignoreSearch:true}).then(async m=>{if(!m)return fetch(r);const b=await m.arrayBuffer(),[s,en]=/bytes=(\d+)-(\d*)/.exec(r.headers.get("range")).slice(1),st=+s,end=en?+en:b.byteLength-1;return new Response(b.slice(st,end+1),{status:206,headers:{"Content-Type":"video/mp4","Content-Range":`bytes ${st}-${end}/${b.byteLength}`,"Content-Length":String(end-st+1),"Accept-Ranges":"bytes"}})}));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).catch(()=>caches.match("index.html"))))});
