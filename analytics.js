/* Basic consent mode: no Google request before consent; no form content tracking.
   Enhanced Measurement is disabled in GA4. Never send form contents or URL queries. */
(()=>{
 const id='G-MMSSSW1LGY',key='kerstens.analytics-consent.v1',age=180*86400000;
 const lang=document.documentElement.lang||'nl';
 const words={
 nl:['Statistieken voor een betere website','Mogen we Google Analytics gebruiken om bezoeken en klikken op onze openbare pagina’s te meten? We sturen geen ingevulde formulieren of accountgegevens mee. Zonder toestemming laden we Google Analytics niet.','Weigeren','Statistieken toestaan','Cookiekeuze wijzigen','Privacy'],
 en:['Statistics for a better website','May we use Google Analytics to measure visits and clicks on our public pages? We do not send form contents or account details. Google Analytics does not load without consent.','Reject','Allow statistics','Change cookie choice','Privacy'],
 de:['Statistiken für eine bessere Website','Dürfen wir mit Google Analytics Besuche und Klicks auf unseren öffentlichen Seiten messen? Formularinhalte und Kontodaten werden nicht übermittelt. Ohne Zustimmung wird Google Analytics nicht geladen.','Ablehnen','Statistiken erlauben','Cookie-Auswahl ändern','Datenschutz'],
 fr:['Des statistiques pour améliorer le site','Pouvons-nous utiliser Google Analytics pour mesurer les visites et clics sur nos pages publiques ? Nous ne transmettons ni le contenu des formulaires ni les données de compte. Sans accord, Google Analytics ne se charge pas.','Refuser','Autoriser les statistiques','Modifier les cookies','Confidentialité'],
 es:['Estadísticas para mejorar la web','¿Podemos usar Google Analytics para medir visitas y clics en nuestras páginas públicas? No enviamos contenidos de formularios ni datos de cuenta. Google Analytics no se carga sin su permiso.','Rechazar','Permitir estadísticas','Cambiar cookies','Privacidad']
 }[lang]||null;
 if(!words)return;
 let allowed=false,loaded=false,banner;
 function choice(){try{const c=JSON.parse(localStorage.getItem(key));return c&&c.version===1&&Date.now()-c.time<age&&['yes','no'].includes(c.value)?c.value:null;}catch{return null;}}
 function event(name,extra={}){if(allowed&&loaded)window.gtag('event',name,extra);}
 function start(){
  if(loaded||!allowed||location.hostname!=='www.kerstensmediaenpresentatie.nl')return;
  loaded=true;window['ga-disable-'+id]=false;
  window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('consent','update',{analytics_storage:'granted'});
  window.gtag('js',new Date());
  let ref='';try{ref=new URL(document.referrer).origin;}catch{}
  window.gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:15552000,page_location:location.origin+location.pathname,page_referrer:ref});
  event('page_view',{page_location:location.origin+location.pathname,page_title:document.title,page_referrer:ref});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
 }
 function clearCookies(){
  const domains=['',location.hostname,'.'+location.hostname,'kerstensmediaenpresentatie.nl','.kerstensmediaenpresentatie.nl'];
  for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of domains)document.cookie=name+'=; Max-Age=0; path=/;'+(domain?' domain='+domain+';':'')+' SameSite=Lax; Secure';}
 }
 function save(value){
  try{localStorage.setItem(key,JSON.stringify({version:1,value,time:Date.now()}));}catch{}
  const wasLoaded=loaded;allowed=value==='yes';banner?.remove();banner=null;
  if(allowed)start();else{window['ga-disable-'+id]=true;clearCookies();if(wasLoaded)location.reload();}
 }
 function show(){
  if(banner){banner.querySelector('button')?.focus();return;}
  banner=document.createElement('section');banner.className='ers-consent';banner.setAttribute('role','region');banner.setAttribute('aria-label',words[0]);
  const title=document.createElement('strong');title.textContent=words[0];
  const copy=document.createElement('p');copy.textContent=words[1];
  const buttons=document.createElement('div');
  for(const [label,value] of [[words[2],'no'],[words[3],'yes']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>save(value);buttons.append(b);}
  const privacy=document.createElement('a');privacy.href=(lang==='nl'?'':'/'+lang)+'/privacy.html';privacy.textContent=words[5];
  banner.append(title,copy,buttons,privacy);document.body.append(banner);
 }
 const css=document.createElement('link');css.rel='stylesheet';css.href='/analytics.css';document.head.append(css);
 const settings=document.createElement('button');settings.type='button';settings.className='ers-cookie-settings';settings.textContent=words[4];settings.onclick=show;document.querySelector('footer')?.append(settings);
 const c=choice();allowed=c==='yes';if(c===null)show();else if(allowed)start();
 document.addEventListener('click',ev=>{
  const a=ev.target.closest?.('a[href]');if(!a)return;
  let url;try{url=new URL(a.href,location.href);}catch{return;}
  if(url.protocol==='mailto:'){event('contact_click',{contact_method:'email'});return;}
  if(url.origin!==location.origin)return;
  if(url.pathname.endsWith('/contact.html'))event('contact_page_click');
 });
 const played=new WeakSet();
 document.addEventListener('play',ev=>{const el=ev.target;if(!allowed||!loaded||el.tagName!=='AUDIO'||played.has(el))return;const src=el.querySelector('source')?.getAttribute('src')||'';const match=src.match(/voiceover-(reclame|documentaire|boodschap)\.mp3$/);if(match){played.add(el);event('demo_play',{demo_style:match[1]});}},true);
 // Revocation in another tab immediately stops this tab as well.
 window.addEventListener('storage',ev=>{if(ev.key===key){const next=choice();allowed=next==='yes';if(!allowed){window['ga-disable-'+id]=true;clearCookies();if(loaded)location.reload();}else start();}});
})();
