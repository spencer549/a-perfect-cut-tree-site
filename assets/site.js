
window.APC=(function(){
 function force(){var m=document.documentElement.dataset.motion;if(m==='off')return false;return m==='force'||!matchMedia('(prefers-reduced-motion: reduce)').matches}
 function clamp(v,a,b){return v<a?a:v>b?b:v}
 function prog(el){var r=el.getBoundingClientRect();var h=el.offsetHeight-innerHeight;if(h<=0)return r.top<=0?1:0;return clamp(-r.top/h,0,1)}
 /* wheel-driven smooth scroll (lerp on native scroll, so sticky keeps working) */
 var target=null,cur=0,raf=null;
 function tick(){cur+=(target-cur)*0.11;if(Math.abs(target-cur)<0.6){cur=target;scrollTo(0,cur);raf=null;target=null;return}scrollTo(0,cur);raf=requestAnimationFrame(tick)}
 addEventListener('wheel',function(e){if(!force()||e.ctrlKey||document.querySelector('.compare.on'))return;if(document.querySelector('dialog[open]')||Math.abs(e.deltaX)>Math.abs(e.deltaY)||(e.target.closest&&e.target.closest('.n-tw,textarea,select')))return;e.preventDefault();var dy=e.deltaMode===1?e.deltaY*32:e.deltaMode===2?e.deltaY*innerHeight:e.deltaY;if(target===null){target=scrollY;cur=scrollY}target=clamp(target+dy,0,document.documentElement.scrollHeight-innerHeight);if(!raf)raf=requestAnimationFrame(tick)},{passive:false});
 addEventListener('keydown',function(){if(raf){cancelAnimationFrame(raf);raf=null;target=null}});
 /* cursor depth, desktop only */
 var mx=0,my=0;if(matchMedia('(hover:hover) and (pointer:fine)').matches)addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-0.5;my=e.clientY/innerHeight-0.5});
 function loader(d,done){var l=d.querySelector('[data-loader]');if(!l){done();return}var seen=false;try{seen=!!sessionStorage.getItem('apc14-loaded-'+d.id)}catch(x){}if(!force()||seen){l.remove();done();return}
  var n=l.querySelector('[data-count]'),t0=performance.now(),dur=1100;
  function st(now){var p=clamp((now-t0)/dur,0,1);var ea=1-Math.pow(1-p,3);if(n)n.textContent=String(Math.round(ea*100)).padStart(3,'0');if(p<1)requestAnimationFrame(st);else{l.classList.add('out');try{sessionStorage.setItem('apc14-loaded-'+d.id,'1')}catch(x){}setTimeout(function(){l.remove();done()},650)}}
  requestAnimationFrame(st)}
 return {force:force,clamp:clamp,prog:prog,mouse:function(){return [mx,my]},loader:loader}
})();

APC.vis=function(el){var r=el.getBoundingClientRect();return r.bottom>-200&&r.top<innerHeight+200};
APC.through=function(el){var r=el.getBoundingClientRect();return APC.clamp((innerHeight-r.top)/(innerHeight+r.height),0,1)};
APC.marq=function(d){[].slice.call(d.querySelectorAll('[data-marq-t]')).forEach(function(t,i){var x=0,dir=i%2?1:-1,w=t.firstElementChild.offsetWidth||1,last=scrollY;
  function step(){if(d.classList.contains('on')&&APC.force()&&APC.vis(t)){var dy=scrollY-last;last=scrollY;x+=dir*(0.6+Math.min(Math.abs(dy),60)*0.35);if(x<=-w)x+=w;if(x>0)x-=w;t.style.transform='translate3d('+x.toFixed(1)+'px,0,0)'}else{last=scrollY}requestAnimationFrame(step)}
  requestAnimationFrame(step)})};
APC.io=function(d,sel,cls,opt){var els=[].slice.call(d.querySelectorAll(sel));if(!('IntersectionObserver' in window)){els.forEach(function(x){x.classList.add(cls)});return}
  var o=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add(cls);o.unobserve(en.target)}})},opt||{rootMargin:'0px 0px -12% 0px'});els.forEach(function(x){o.observe(x)});
  document.addEventListener('apc:show',function(){els.forEach(function(x){if(x.getBoundingClientRect().top<innerHeight*0.95&&d.classList.contains('on'))x.classList.add(cls)})})};
APC.menu=function(d){var mb=d.querySelector('[data-menu]'),nv=d.querySelector('[data-nav]');if(mb&&nv){mb.addEventListener('click',function(){var on=!nv.classList.contains('on');nv.classList.toggle('on',on);mb.setAttribute('aria-expanded',on);mb.textContent=on?'Close':'Menu'})}};

(function(){var d=document.getElementById('design-1');if(!d)return;
 var prog=d.querySelector('[data-prog]'),ghost=d.querySelector('[data-ghost]'),hero=d.querySelector('[data-hero]'),dep=d.querySelector('[data-depth] .cut'),pola=d.querySelector('[data-pola]');
 var sgh=d.querySelector('[data-sghost]'),steps=d.querySelector('[data-steps]'),track=d.querySelector('[data-track]'),rope=d.querySelector('[data-rope]');
 var rows=[].slice.call(d.querySelectorAll('[data-row]')),sp=[].slice.call(d.querySelectorAll('[data-sp]')),svcn=d.querySelector('[data-svcn]'),svccap=d.querySelector('[data-svccap]'),cur=0,hoverLock=0;
 var board=d.querySelector('[data-board]'),tks=[].slice.call(d.querySelectorAll('[data-bc]')),BS=[-60,50,-25,80];
 var grows=[].slice.call(d.querySelectorAll('[data-grow]')),map=d.querySelector('.x-map');
 function setRow(i){if(i===cur)return;rows[cur].classList.remove('on');sp[cur].classList.remove('on');cur=i;rows[i].classList.add('on');sp[i].classList.add('on');if(svcn)svcn.textContent=('0'+(i+1)).slice(-2);if(svccap)svccap.textContent=rows[i].querySelector('h3').textContent}
 rows.forEach(function(r,i){r.addEventListener('pointerenter',function(){hoverLock=performance.now();setRow(i)});r.addEventListener('focus',function(){setRow(i)})});
 var raf=null;
 function tick(){raf=null;if(!d.classList.contains('on'))return;var f=APC.force(),m=APC.mouse(),H=document.documentElement.scrollHeight-innerHeight;
  if(prog)prog.style.transform='scaleX('+(H>0?scrollY/H:0).toFixed(4)+')';
  if(hero&&APC.vis(hero)){var hp=APC.clamp(scrollY/(hero.offsetHeight||1),0,1.2);
   if(ghost)ghost.style.transform=f?'translate3d('+(-hp*40).toFixed(1)+'px,'+(hp*70).toFixed(1)+'px,0) scale('+(1+hp*.05).toFixed(3)+')':'';
   if(dep)dep.style.transform=f?'translate3d('+(m[0]*-26).toFixed(1)+'px,'+(m[1]*-16+hp*-40).toFixed(1)+'px,0) rotate('+(m[0]*1.2).toFixed(2)+'deg)':'';
   if(pola)pola.style.transform=f?'translate3d('+(m[0]*30).toFixed(1)+'px,'+(m[1]*22+hp*70).toFixed(1)+'px,0) rotate('+(6+m[0]*5).toFixed(2)+'deg)':'rotate(6deg)'}
  if(steps&&track){if(f&&innerWidth>900){var p=APC.clamp((APC.prog(steps)-0.07)/0.86,0,1);var max=track.scrollWidth-innerWidth;if(sgh)sgh.style.transform='translate3d('+((p-0.5)*-innerWidth*0.9).toFixed(1)+'px,0,0)';track.style.transform='translate3d('+(-p*Math.max(max,0)).toFixed(1)+'px,0,0)';if(rope)rope.style.strokeDashoffset=(1-APC.clamp(p*1.15,0,1)).toFixed(4)}else{track.style.transform='';if(sgh)sgh.style.transform='';if(rope)rope.style.strokeDashoffset=0}}
  if(rows.length&&innerWidth>900&&performance.now()-hoverLock>900){var best=0,bd=1e9,c=innerHeight*0.46;rows.forEach(function(r,i){var b=r.getBoundingClientRect();var dd=Math.abs(b.top+b.height/2-c);if(dd<bd){bd=dd;best=i}});if(bd<innerHeight*0.5)setRow(best)}
  if(board&&tks.length){if(f&&innerWidth>980&&APC.vis(board)){var bt=APC.through(board);tks.forEach(function(t){t.style.transform='translate3d(0,'+((bt-0.5)*BS[+t.dataset.bc]).toFixed(1)+'px,0)'})}else if(!f||innerWidth<=980){tks.forEach(function(t){t.style.transform=''})}}
  grows.forEach(function(g){if(!APC.vis(g))return;var t=APC.through(g);g.style.transform=f?'translate3d('+((t-0.5)*(+g.dataset.grow)*520).toFixed(1)+'px,0,0)':''});
  if(map&&APC.vis(map))map.style.transform=f?'rotate('+((APC.through(map)-0.5)*50).toFixed(2)+'deg)':'';
 }
 function on(){if(!raf)raf=requestAnimationFrame(tick)}
 addEventListener('scroll',on,{passive:true});addEventListener('pointermove',on,{passive:true});addEventListener('resize',on);document.addEventListener('apc:show',on);on();
 APC.marq(d);APC.menu(d);APC.io(d,'.pin,[data-marks],[data-depth],[data-hl]','in');
 setTimeout(function(){var h=d.querySelector('[data-hl]');if(h)h.classList.add('in');var dp=d.querySelector('[data-depth]');if(dp)dp.classList.add('in')},250);
})();

(function(){var d=document.getElementById('design-1');if(!d)return;APC.io(d,'.x-stump','in',{rootMargin:'0px 0px -10% 0px'})})();

document.documentElement.dataset.motion='force';
(function(){if(!('IntersectionObserver' in window)){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});window.IntersectionObserver=function(){this.observe=this.unobserve=function(){}}}
 var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px'});
 document.querySelectorAll('.design.on .rv').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight*0.95)el.classList.add('in');else io.observe(el)});
 document.querySelectorAll('.design').forEach(function(d){d.addEventListener('click',function(ev){var a=ev.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href').slice(1);if(!id)return;var t=d.querySelector('#'+CSS.escape(id));if(t){ev.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+scrollY-82,behavior:'smooth'})}})});
 if(location.hash){var t=document.getElementById(location.hash.slice(1));if(t)setTimeout(function(){window.scrollTo({top:t.getBoundingClientRect().top+scrollY-82,behavior:'instant'})},60)}
 var tk=0;addEventListener('scroll',function(){if(tk)return;tk=requestAnimationFrame(function(){tk=0;document.querySelectorAll('.design.on .rv:not(.in)').forEach(function(el){if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in')})})},{passive:true});
 var mb=document.querySelector('[data-more]');
 if(mb){document.querySelectorAll('[data-wall] [data-late]').forEach(function(el){el.hidden=true});mb.hidden=false}
 if(mb)mb.addEventListener('click',function(){var h=[].slice.call(document.querySelectorAll('[data-wall] [hidden]'));h.slice(0,30).forEach(function(el){el.hidden=false});if(h[0]){h[0].setAttribute('tabindex','-1');h[0].focus({preventScroll:true})}if(h.length<=30)mb.parentNode.hidden=true});
 document.querySelectorAll('[data-gcar]').forEach(function(c){var t=c.querySelector('[data-track]'),pv=c.querySelector('[data-prev]'),nx=c.querySelector('[data-next]'),bar=c.querySelector('.n-car-b');
  var step=function(){var k=t.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(t).columnGap||0):t.clientWidth};
  var upd=function(){var max=t.scrollWidth-t.clientWidth;bar.hidden=max<8;pv.disabled=t.scrollLeft<8;nx.disabled=t.scrollLeft>max-8};
  pv.addEventListener('click',function(){t.scrollBy({left:-step(),behavior:'smooth'})});nx.addEventListener('click',function(){t.scrollBy({left:step(),behavior:'smooth'})});
  t.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd()});
 document.querySelectorAll('[data-clip]').forEach(function(c){var b=c.parentNode.querySelector('[data-clipb]');if(!b||c.scrollHeight<430)return;c.classList.add('js');b.hidden=false;c.addEventListener('focusin',function(){if(!c.classList.contains('open')){b.click();c.scrollTop=0}});
  b.addEventListener('click',function(){var o=c.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');b.textContent=o?'Show Less':'Read More';if(!o){var y=c.getBoundingClientRect().top+scrollY-140;if(scrollY>y)window.scrollTo({top:y,behavior:'instant'})}})});
 if(location.hash){var ht=document.getElementById(location.hash.slice(1)),hc=ht&&ht.closest('[data-clip]');if(hc)hc.classList.add('open')}
 var lb=document.querySelector('[data-lbd]');
 if(lb){var bs=[].slice.call(document.querySelectorAll('[data-lb]')),im=lb.querySelector('img'),cp=lb.querySelector('figcaption'),cur=0,last=null;
  var show=function(i){cur=(i+bs.length)%bs.length;var t=bs[cur].querySelector('img');im.src=t.currentSrc||t.src;im.alt=t.alt;cp.textContent=t.alt};
  bs.forEach(function(b,i){b.addEventListener('click',function(){last=b;show(i);lb.showModal()})});
  lb.querySelector('[data-lbx]').addEventListener('click',function(){lb.close()});
  lb.querySelector('[data-lbp]').addEventListener('click',function(){show(cur-1)});
  lb.querySelector('[data-lbn]').addEventListener('click',function(){show(cur+1)});
  lb.addEventListener('click',function(ev){if(ev.target===lb)lb.close()});
  lb.addEventListener('keydown',function(ev){if(ev.key==='ArrowLeft')show(cur-1);if(ev.key==='ArrowRight')show(cur+1)});
  lb.addEventListener('close',function(){if(last)last.focus()})}
 document.dispatchEvent(new CustomEvent('apc:show'));
})();

(function(){var MAXP=10,MAXPM=20,MAXVM=200;
function msg(f,k,t){var i=f.querySelector('[name="'+k+'"]');if(!i)return;var er=document.getElementById(i.id+'-err');i.setAttribute('aria-invalid',t?'true':'false');if(er){er.textContent=t||'';er.hidden=!t}}
function upst(f){var box=f.querySelector('[data-upst]');if(!box)return;box.innerHTML='';[].slice.call(f.querySelectorAll('[data-up]')).forEach(function(inp){var fs=[].slice.call(inp.files||[]);if(!fs.length&&!inp._bad)return;var p=document.createElement('p');
 if(inp._bad){var s=document.createElement('span');s.className='bad';s.textContent=inp._bad;p.appendChild(s)}else{p.appendChild(document.createTextNode(fs.length+(inp.dataset.up==='photos'?(fs.length===1?' photo':' photos'):' video')+' ready: '+fs.map(function(x){return x.name}).join(', ')))}
 var b=document.createElement('button');b.type='button';var again=!!inp._bad;b.textContent=again?'Choose again':'Remove';b.addEventListener('click',function(){inp.value='';inp._bad='';upst(f);if(again)inp.click()});p.appendChild(b);box.appendChild(p)})}
function check(inp){var fs=[].slice.call(inp.files||[]),ph=inp.dataset.up==='photos',bad='';
 if(ph&&fs.length>MAXP)bad='Please choose up to '+MAXP+' photos.';
 fs.forEach(function(x){if(bad)return;if(ph&&!/^image\//.test(x.type))bad=x.name+' is not a photo. Please choose JPG, PNG or HEIC images.';else if(!ph&&!/^video\//.test(x.type))bad=x.name+' is not a video file.';else if(x.size>(ph?MAXPM:MAXVM)*1048576)bad=x.name+' is larger than '+(ph?MAXPM:MAXVM)+' MB. Please choose a smaller file.'});
 inp._bad=bad;if(bad)inp.value='';upst(inp.form)}
function val(f,quiet){var ok=true,first=null,ph=f.querySelector('[name="phone"]'),ad=f.querySelector('[name="address"]'),em=f.querySelector('[name="email"]');
 var d=(ph.value.match(/\d/g)||[]).length;if(d<10){ok=false;first=first||ph;msg(f,'phone',ph.value.trim()?'Please enter a 10-digit phone number.':'Please enter a phone number so we can call you back.')}else msg(f,'phone','');
 if(ad.value.trim().length<6){ok=false;first=first||ad;msg(f,'address','Please enter the property address where the tree is.')}else msg(f,'address','');
 if(em.value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())){ok=false;first=first||em;msg(f,'email','Please check the email address.')}else msg(f,'email','');
 if(!quiet&&first)first.focus();return ok}
document.addEventListener('change',function(e){var t=e.target;if(!t.matches)return;if(t.matches('form[data-f20] [data-up]'))check(t);else if(t.matches('form[data-f20] input[aria-invalid="true"]'))val(t.form,true)});
document.addEventListener('input',function(e){var t=e.target;if(t.matches&&t.matches('form[data-f20] input[aria-invalid="true"]'))val(t.form,true)});
document.addEventListener('submit',function(e){var f=e.target;if(!f.matches||!f.matches('form[data-f20]'))return;e.preventDefault();var st=f.querySelector('[data-fst]');st.innerHTML='';
 if(!val(f))return;var n=0;[].slice.call(f.querySelectorAll('[data-up]')).forEach(function(i){n+=(i.files||[]).length});
 st.innerHTML='<b>Thanks, your request is in.</b><span></span><small>Mockup preview: nothing is sent from this page.</small>';
 st.querySelector('span').textContent='An arborist will review '+(n?n+(n===1?' file':' files')+' and ':'')+'your details, then call you at '+f.querySelector('[name="phone"]').value.trim()+'.';st.setAttribute('tabindex','-1');st.focus()},true);
})();

(function(){var dlg=document.querySelector('[data-fmd]');if(!dlg||!dlg.showModal)return;var last=null;
function svcOf(a){var c=a.closest('.x-tk,.x-tkw,.s-slat,.s-card-svc,article');if(!c)return '';var h=c.querySelector('h3');return h?h.textContent.trim():''}
function open(a){last=a;var s=svcOf(a),sel=dlg.querySelector('select');
 if(sel&&s){for(var i=0;i<sel.options.length;i++){if(sel.options[i].text.trim()===s){sel.selectedIndex=i;break}}}
 document.documentElement.classList.add('n-fm-lock');dlg.showModal();var f=dlg.querySelector('input[name="name"]');if(f)f.focus({preventScroll:true})}
function close(){if(dlg.open)dlg.close()}
dlg.addEventListener('close',function(){document.documentElement.classList.remove('n-fm-lock');if(last&&last.focus)last.focus({preventScroll:true})});
dlg.addEventListener('click',function(e){if(e.target===dlg)close();if(e.target.closest('[data-fmx]'))close()});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||dlg.contains(a))return;
 var h=a.getAttribute('href')||'',k=dlg.getAttribute('data-fmd');if(h.slice(-(k.length+6))!=='#'+k+'-form')return;e.preventDefault();e.stopPropagation();open(a)},true);
if(location.hash==='#'+dlg.getAttribute('data-fmd')+'-form')setTimeout(function(){open(null)},300);
})();

(function(){function bal(){[].slice.call(document.querySelectorAll('[data-bal]')).forEach(function(g){var cols=[].slice.call(g.children);if(cols.length<2)return;
 if(getComputedStyle(g).gridTemplateColumns.split(' ').length<2)return;var tiles=[];cols.forEach(function(c){[].slice.call(c.children).forEach(function(t){tiles.push(t)})});
 tiles.forEach(function(t,i){if(t.dataset.o==null)t.dataset.o=i});var hs=cols.map(function(){return 0}),as=cols.map(function(){return []});
 tiles.slice().sort(function(a,b){return b.offsetHeight-a.offsetHeight}).forEach(function(t){var k=hs.indexOf(Math.min.apply(null,hs));as[k].push(t);hs[k]+=t.offsetHeight+44});
 as.forEach(function(a,k){a.sort(function(x,y){return x.dataset.o-y.dataset.o}).forEach(function(t){cols[k].appendChild(t)})});
 var old=g.querySelector('.n-tl-fill');if(old)old.remove();var H=cols.map(function(c){return c.offsetHeight}),mx=Math.max.apply(null,H),mn=Math.min.apply(null,H);
 var tp=g.parentNode.querySelector('template[data-fill]');if(tp&&mx-mn>200){cols[H.indexOf(mn)].appendChild(tp.content.firstElementChild.cloneNode(true))}})}
if(document.readyState!=='loading')bal();else document.addEventListener('DOMContentLoaded',bal);addEventListener('load',bal);var to;addEventListener('resize',function(){clearTimeout(to);to=setTimeout(bal,150)})})();

(function(){var dds=[].slice.call(document.querySelectorAll('[data-dd]'));
 function set(d,on){d.classList.toggle('open',on);d.querySelector('.nv-dd-b').setAttribute('aria-expanded',on?'true':'false')}
 function closeAll(x){dds.forEach(function(d){if(d!==x)set(d,false)})}
 dds.forEach(function(d){var b=d.querySelector('.nv-dd-b');
  b.addEventListener('click',function(){var on=!d.classList.contains('open');closeAll(d);set(d,on)});
  d.addEventListener('focusout',function(ev){if(matchMedia('(min-width:1181px)').matches&&!d.contains(ev.relatedTarget))set(d,false)})});
 document.addEventListener('click',function(ev){if(!(ev.target.closest&&ev.target.closest('[data-dd]'))&&matchMedia('(min-width:1181px)').matches)closeAll()});
 document.addEventListener('keydown',function(ev){if(ev.key!=='Escape')return;var d=document.activeElement&&document.activeElement.closest&&document.activeElement.closest('[data-dd]');
  if(d&&d.classList.contains('open')){set(d,false);d.querySelector('.nv-dd-b').focus()}else closeAll()});
})();
