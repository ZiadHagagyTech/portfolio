(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const API_BASE = "https://ziad-portfolio-studio-api.ziad-hagagy-tech.workers.dev";
  const BRANCH = "feature/visual-admin-cms";
  const ALLOWED_PAGES = ["index.html","about.html","services.html","projects.html","contact.html","evaluation.html"];
  let token = "";
  let currentPath = "index.html";
  let currentHtml = "";
  let selectedElement = null;
  let bridge = null;
  let lang = "ar";
  const loginScreen = $("#loginScreen"), app = $("#app"), frame = $("#sitePreview");

  function tr(ar,en){return lang==="ar"?ar:en}
  function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
  function setMessage(el,msg,success=false){el.textContent=msg;el.classList.toggle("success",success)}
  function authHeaders(){return {"Authorization":"Bearer "+token,"Content-Type":"application/json"}}
  async function api(path,options={}) {
    if(API_BASE.includes("YOUR-WORKER-NAME")) throw new Error(tr("لازم تضبط رابط Cloudflare Worker داخل admin/admin.js أولًا.","Set the Cloudflare Worker URL in admin/admin.js first."));
    const response=await fetch(API_BASE+path,{...options,headers:{...(options.headers||{}),...(token?{"Authorization":"Bearer "+token}:{}),...(options.body?{"Content-Type":"application/json"}:{})}});
    const data=await response.json().catch(()=>({error:"Invalid response"}));
    if(!response.ok) throw new Error(data.error||("HTTP "+response.status));
    return data;
  }
  function setLanguage(next){
    lang=next;document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";
    document.querySelectorAll("[data-ar][data-en]").forEach(el=>el.textContent=el.dataset[lang]);
    $("#languageToggle").textContent=lang==="ar"?"EN":"ع";
    $("#pageSelect").querySelectorAll("option").forEach((o)=>{const parts=o.textContent.split(" · ");if(parts.length===2)o.textContent=(lang==="ar"?parts[0]:({"الرئيسية":"Home","نبذة عني":"About","الخدمات":"Services","أعمالي":"Projects","التواصل":"Contact","التقييم":"Evaluation"}[parts[0]]||parts[0]))+" · "+parts[1]});
  }
  function signInView(){loginScreen.classList.remove("hidden");app.classList.add("hidden")}
  function appView(){loginScreen.classList.add("hidden");app.classList.remove("hidden")}
  $("#loginForm").addEventListener("submit",async(e)=>{
    e.preventDefault();const msg=$("#loginMessage");setMessage(msg,tr("جارٍ تسجيل الدخول…","Signing in…"));
    try{const data=await api("/api/login",{method:"POST",body:JSON.stringify({password:$("#adminPassword").value})});token=data.token;appView();await loadPage(currentPath);setMessage(msg,"");}
    catch(err){setMessage(msg,err.message||tr("فشل تسجيل الدخول","Sign in failed"))}
  });
  $("#logoutButton").addEventListener("click",()=>{token="";currentHtml="";selectedElement=null;signInView();$("#adminPassword").value=""});
  $("#languageToggle").addEventListener("click",()=>setLanguage(lang==="ar"?"en":"ar"));
  $("#themeToggle").addEventListener("click",()=>document.body.classList.toggle("light-ui"));
  document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b===btn));
    const publish=btn.dataset.panel==="publish";$("#editorPanel").classList.toggle("hidden",publish);$("#publishPanel").classList.toggle("hidden",!publish);
  }));
  document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b===btn));
    ["content","style","structure"].forEach(t=>$("#"+t+"Tab").classList.toggle("hidden",t!==btn.dataset.tab));
  }));
  $("#loadPage").addEventListener("click",()=>loadPage($("#pageSelect").value));
  $("#refreshPreview").addEventListener("click",()=>renderPreview(currentHtml));
  $("#refreshSections").addEventListener("click",renderSections);
  $("#pageSelect").addEventListener("change",()=>{$("#publishPath").textContent=$("#pageSelect").value});
  $("#desktopView").addEventListener("click",()=>setViewport("desktop"));
  $("#tabletView").addEventListener("click",()=>setViewport("tablet"));
  $("#mobileView").addEventListener("click",()=>setViewport("mobile"));
  function setViewport(size){const wrap=$("#previewFrameWrap");wrap.classList.remove("desktop-size","tablet-size","mobile-size");wrap.classList.add(size+"-size");document.querySelectorAll(".view-button").forEach(b=>b.classList.toggle("active",b.id===size+"View"))}

  async function loadPage(path){
    if(!ALLOWED_PAGES.includes(path))return;
    currentPath=path;$("#publishPath").textContent=path;$("#previewStatus").textContent=tr("جارٍ التحميل…","Loading…");
    try{const data=await api("/api/file?path="+encodeURIComponent(path));currentHtml=data.content;selectedElement=null;renderPreview(currentHtml);$("#previewStatus").textContent=tr("تم تحميل "+path,"Loaded "+path);$("#saveToGithub").disabled=false;}
    catch(err){$("#previewStatus").textContent=tr("تعذر التحميل","Could not load");showToast(err.message)}
  }
  function renderPreview(html){
    const base=new URL("../",window.location.href).href;
    const doc=new DOMParser().parseFromString(html,"text/html");
    let baseEl=doc.querySelector("base");if(!baseEl){baseEl=doc.createElement("base");doc.head.prepend(baseEl)}baseEl.href=base;
    const bridgeScript=doc.createElement("script");bridgeScript.id="portfolio-studio-bridge";bridgeScript.textContent=bridgeSource();doc.body.appendChild(bridgeScript);
    frame.srcdoc="<!doctype html>\n"+doc.documentElement.outerHTML;
    frame.onload=()=>{try{bridge=frame.contentDocument;renderSections();wireFrameSelection();}catch(e){showToast(tr("تعذر فتح المعاينة","Preview could not be opened"))}};
  }
  function bridgeSource(){return `(()=>{let selected=null;document.addEventListener('click',e=>{const el=e.target.closest('section,header,footer,h1,h2,h3,h4,p,a,button,img,li,span,div');if(!el||el.id==='portfolio-studio-bridge'||el.closest('#portfolio-studio-bridge'))return;e.preventDefault();e.stopPropagation();if(selected)selected.style.outline=selected.dataset.studioOldOutline||'';selected=el;selected.dataset.studioOldOutline=selected.style.outline||'';selected.style.outline='2px solid #4285ff';parent.postMessage({type:'portfolio-studio-select',tag:el.tagName.toLowerCase(),id:el.id||'',className:typeof el.className==='string'?el.className.slice(0,90):'',text:(el.innerText||el.alt||'').trim().slice(0,500),href:el.getAttribute('href')||'',color:rgbHex(getComputedStyle(el).color),background:rgbHex(getComputedStyle(el).backgroundColor),fontSize:parseInt(getComputedStyle(el).fontSize)||16,padding:parseInt(getComputedStyle(el).paddingTop)||0},'*');},{capture:true});function rgbHex(v){const m=v.match(/\\d+/g);if(!m||m.length<3)return '#ffffff';return '#'+m.slice(0,3).map(n=>Number(n).toString(16).padStart(2,'0')).join('')}window.addEventListener('message',e=>{const d=e.data||{};if(d.type==='portfolio-studio-apply-text'&&selected){if(selected.tagName==='IMG'){selected.alt=d.text}else{selected.textContent=d.text}if(d.href!==undefined&&selected.tagName==='A')selected.setAttribute('href',d.href)}if(d.type==='portfolio-studio-apply-style'&&selected){selected.style.color=d.color;selected.style.backgroundColor=d.background;selected.style.fontSize=d.fontSize+'px';selected.style.padding=d.padding+'px'}if(d.type==='portfolio-studio-reorder'){const sections=[...document.querySelectorAll('body > section, body main > section')];const el=sections.find(s=>s.id===d.id);if(el&&d.beforeId){const before=sections.find(s=>s.id===d.beforeId);if(before&&before.parentElement===el.parentElement)el.parentElement.insertBefore(el,before)}else if(el)el.parentElement.appendChild(el);}});})();`}
  function wireFrameSelection(){
    window.removeEventListener("message",onFrameMessage);window.addEventListener("message",onFrameMessage);
  }
  function onFrameMessage(event){
    if(event.source!==frame.contentWindow||!event.data||event.data.type!=="portfolio-studio-select")return;
    const d=event.data;selectedElement=frame.contentDocument?.activeElement||null;
    $("#selectedLabel").textContent=(d.tag||"element")+(d.id?" #"+d.id:"")+(d.className?" · "+d.className.replace(/\s+/g," ").slice(0,45):"");
    $("#textEditor").disabled=false;$("#linkEditor").disabled=false;$("#applyContent").disabled=false;$("#textEditor").value=d.text||"";$("#linkEditor").value=d.href||"";
    $("#textColor").disabled=false;$("#backgroundColor").disabled=false;$("#fontSize").disabled=false;$("#paddingSize").disabled=false;$("#applyStyle").disabled=false;
    $("#textColor").value=safeColor(d.color);$("#backgroundColor").value=safeColor(d.background);$("#fontSize").value=d.fontSize||16;$("#paddingSize").value=d.padding||0;
  }
  function safeColor(value){return /^#[0-9a-f]{6}$/i.test(value||"")?value:"#ffffff"}
  $("#applyContent").addEventListener("click",()=>{if(!frame.contentWindow)return;frame.contentWindow.postMessage({type:"portfolio-studio-apply-text",text:$("#textEditor").value,href:$("#linkEditor").value}, "*");showToast(tr("تم تطبيق المحتوى في المعاينة","Content applied to preview"));});
  $("#applyStyle").addEventListener("click",()=>{frame.contentWindow.postMessage({type:"portfolio-studio-apply-style",color:$("#textColor").value,background:$("#backgroundColor").value,fontSize:Math.max(8,Math.min(120,Number($("#fontSize").value)||16)),padding:Math.max(0,Math.min(200,Number($("#paddingSize").value)||0))},"*");showToast(tr("تم تطبيق التصميم في المعاينة","Styles applied to preview"));});
  function renderSections(){
    const root=frame.contentDocument;if(!root)return;const list=$("#sectionsList");list.innerHTML="";
    const sections=[...root.querySelectorAll("body > section, body main > section")].filter(s=>s.id!=="portfolio-studio-bridge");
    if(!sections.length){list.innerHTML='<p class="muted small">'+tr("لم يتم العثور على أقسام section واضحة في هذه الصفحة.","No section elements were found on this page.")+'</p>';return}
    sections.forEach((section,index)=>{
      const row=document.createElement("div");row.className="section-row";row.draggable=true;row.dataset.id=section.id||"";
      const handle=document.createElement("span");handle.className="drag-handle";handle.textContent="⠿";
      const name=document.createElement("span");name.className="section-name";name.textContent=(section.id||"section-"+(index+1))+" · "+((section.innerText||"").trim().replace(/\s+/g," ").slice(0,42)||tr("بدون نص","No text"));
      const up=document.createElement("button");up.textContent="↑";up.title=tr("تحريك لأعلى","Move up");up.disabled=index===0;up.addEventListener("click",()=>moveSection(section,sections[index-1]));
      const down=document.createElement("button");down.textContent="↓";down.title=tr("تحريك لأسفل","Move down");down.disabled=index===sections.length-1;down.addEventListener("click",()=>moveSection(section,sections[index+1]));
      row.append(handle,name,up,down);row.addEventListener("click",()=>{section.scrollIntoView({behavior:"smooth",block:"center"});section.style.outline="2px solid #4285ff";setTimeout(()=>section.style.outline="",1000)});
      row.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",section.id);row.classList.add("dragging")});row.addEventListener("dragend",()=>row.classList.remove("dragging"));row.addEventListener("dragover",e=>{e.preventDefault();row.classList.add("drag-over")});row.addEventListener("dragleave",()=>row.classList.remove("drag-over"));row.addEventListener("drop",e=>{e.preventDefault();row.classList.remove("drag-over");const movingId=e.dataTransfer.getData("text/plain");const moving=sections.find(s=>s.id===movingId);if(moving&&moving!==section)moveSection(moving,section)});
      list.appendChild(row);
    });
  }
  function moveSection(section,before){if(!section||!before||section.parentElement!==before.parentElement)return;section.parentElement.insertBefore(section,before);renderSections();showToast(tr("تم تغيير ترتيب القسم في المعاينة","Section order changed in preview"))}
  function getEditedHtml(){
    const doc=frame.contentDocument;if(!doc)throw new Error("Preview is not ready");
    const bridgeNode=doc.getElementById("portfolio-studio-bridge");const parent=bridgeNode?.parentNode;const next=bridgeNode?.nextSibling;if(bridgeNode)bridgeNode.remove();
    const base=doc.querySelector("base");if(base&&base.getAttribute("href")===new URL("../",window.location.href).href)base.remove();
    const output="<!DOCTYPE html>\n"+doc.documentElement.outerHTML;
    if(base)doc.head.prepend(base);if(bridgeNode&&parent)parent.insertBefore(bridgeNode,next);
    return output;
  }
  $("#createPullRequest").addEventListener("click",async()=>{
    const btn=$("#createPullRequest");btn.disabled=true;
    try{const result=await api("/api/pull-request",{method:"POST",body:JSON.stringify({})});showToast(result.existing?tr("يوجد طلب مراجعة مفتوح بالفعل","An open review already exists"):tr("تم إنشاء طلب المراجعة","Review request created"));if(result.url)window.open(result.url,"_blank","noopener,noreferrer");}
    catch(err){showToast(err.message||tr("تعذر إنشاء طلب المراجعة","Could not create review request"))}
    finally{btn.disabled=false}
  });
  $("#saveToGithub").addEventListener("click",async()=>{
    const btn=$("#saveToGithub"),msg=$("#saveMessage");btn.disabled=true;setMessage(msg,tr("جارٍ حفظ الملف في فرع التطوير…","Saving file to development branch…"));
    try{const content=getEditedHtml();const data=await api("/api/file",{method:"PUT",body:JSON.stringify({path:currentPath,content,message:$("#commitMessage").value||"Update "+currentPath})});currentHtml=content;setMessage(msg,tr("تم الحفظ في GitHub. Commit: ","Saved to GitHub. Commit: ")+(data.commit||"OK"),true);showToast(tr("تم حفظ التغييرات في فرع التطوير","Changes saved to development branch"))}
    catch(err){setMessage(msg,err.message||tr("فشل الحفظ","Save failed"))}
    finally{btn.disabled=false}
  });
  setLanguage("ar");
})();