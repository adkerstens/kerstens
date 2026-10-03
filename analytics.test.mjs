import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync(new URL('./analytics.js',import.meta.url),'utf8');
function run(value=null,{path='/voice-over.html',time=Date.now()}={}){
 const handlers={},items=new Map(),nodes=[];
 if(value)items.set('kerstens.analytics-consent.v1',JSON.stringify({version:1,value,time}));
 class Node{constructor(tag){this.tag=tag;this.children=[];nodes.push(this);}append(...n){this.children.push(...n);}setAttribute(k,v){this[k]=v;}remove(){this.removed=true;}querySelector(){return null;}}
 const head=new Node('head'),body=new Node('body'),footer=new Node('footer');
 const document={head,body,title:'Public product',cookie:'',referrer:'https://google.com/search?q=private',documentElement:{lang:'nl'},createElement:t=>new Node(t),querySelector:s=>s==='footer'?footer:null,addEventListener:(n,f)=>handlers[n]=f};
 const location={hostname:'www.kerstensmediaenpresentatie.nl',origin:'https://www.kerstensmediaenpresentatie.nl',pathname:path,href:'https://www.kerstensmediaenpresentatie.nl'+path+'?email=secret@example.com#token',reload(){this.reloaded=true;}};
 const window={addEventListener:(n,f)=>handlers[n]=f};
 const localStorage={getItem:k=>items.get(k)||null,setItem:(k,v)=>items.set(k,v)};
 vm.runInNewContext(code,{window,document,location,localStorage,URL,Date,JSON});
 return{nodes,window,document,location,handlers,google:()=>head.children.filter(n=>n.tag==='script'),click:text=>nodes.find(n=>n.tag==='button'&&n.textContent===text)?.onclick(),events:()=>Array.from(window.dataLayer||[],a=>Array.from(a))};
}
test('no consent or refusal means no Google request',()=>{
 for(const v of [null,'no']){const x=run(v);assert.equal(x.google().length,0);assert.equal(x.events().length,0);}
 const x=run();x.click('Weigeren');assert.equal(x.google().length,0);
});
test('acceptance sends one sanitized view, no query/hash or referrer search',()=>{
 const x=run();x.click('Statistieken toestaan');assert.equal(x.google().length,1);
 const views=x.events().filter(e=>e[0]==='event'&&e[1]==='page_view');assert.equal(views.length,1);
 assert.equal(views[0][2].page_location,'https://www.kerstensmediaenpresentatie.nl/voice-over.html');
 assert.equal(views[0][2].page_referrer,'https://google.com');
 assert.ok(!JSON.stringify(x.events()).includes('secret@example.com'));
});
test('expired consent is requested again, never assumed',()=>{
 const x=run('yes',{time:Date.now()-181*86400000});assert.equal(x.google().length,0);assert.ok(x.nodes.some(n=>n.className==='ers-consent'));
});
test('revocation disables collection and reloads the loaded tag away',()=>{
 const x=run('yes');x.click('Cookiekeuze wijzigen');x.click('Weigeren');assert.equal(x.window['ga-disable-G-MMSSSW1LGY'],true);assert.equal(x.location.reloaded,true);
});
test('email click records intent, never email contents or a completed booking',()=>{
 const x=run('yes');x.handlers.click({target:{closest:()=>({href:'mailto:info@kerstensmediaenpresentatie.nl?body=private-text'})}});
 const events=x.events().filter(e=>e[0]==='event'&&e[1]==='contact_click');assert.equal(events.length,1);assert.equal(events[0][2].contact_method,'email');assert.ok(!JSON.stringify(x.events()).includes('private-text'));assert.ok(!x.events().some(e=>e[1]==='generate_lead'));
});
test('demo event accepts only a known style and once per player',()=>{
 const x=run('yes');const target={tagName:'AUDIO',querySelector:()=>({getAttribute:()=>'/voiceover-reclame.mp3'})};x.handlers.play({target});x.handlers.play({target});assert.equal(x.events().filter(e=>e[1]==='demo_play').length,1);
});
