(() => {
  'use strict';
  const data = window.SKYLINK_CODE, $ = id => document.getElementById(id);
  let fileIndex = 0, selectedLine = 1, understood = [];
  try { const saved = JSON.parse(localStorage.getItem('skylink-code-reader-v1')); if (saved && Array.isArray(saved.understood)) understood = saved.understood; } catch (_) {}
  const text = (id,value) => { $(id).textContent = value; };
  const current = () => data.files[fileIndex];
  const rows = () => current().rows.filter(row => !$('code-only').checked || ['code','package','import','brace'].includes(row.kind));
  const key = () => `${current().id}:${selectedLine}`;
  function updateHash(){history.replaceState(null,'',`#${current().id}-l${selectedLine}`);}
  function readHash(){ const match = /^#([a-z]+)-l(\d+)$/.exec(location.hash); if (!match) return; const index = data.files.findIndex(f=>f.id===match[1]); if(index<0)return; fileIndex=index; selectedLine=Math.max(1,Math.min(Number(match[2]),current().rows.length)); }
  function buildDictionary(container,keys){container.replaceChildren(...keys.flatMap(k=>{const term=document.createElement('dt'),definition=document.createElement('dd');term.textContent=k;definition.textContent=data.glossary[k];return [term,definition];}));}
  function progress(){text('progress',`${understood.length} lines marked understood`);}
  function explain(){
    const f=current(),row=f.rows[selectedLine-1],available=rows(),position=available.findIndex(r=>r.line===selectedLine);
    text('selected-location',`${f.name}:${row.line}`);text('line-kind',row.kind);text('selected-code',row.raw||'(blank line)');text('what',row.what);text('why',row.why);
    text('example',row.example||'');$('example-section').hidden=!row.example;
    text('caution',row.caution||'');$('caution-section').hidden=!row.caution;
    buildDictionary($('syntax'),row.syntax);$('syntax-section').hidden=!row.syntax.length;
    $('prev').disabled=position<=0;$('next').disabled=position===available.length-1;
    $('understood').checked=understood.includes(key());$('line-jump').value=selectedLine;
    document.querySelectorAll('#source-lines button').forEach(button=>{const active=Number(button.dataset.line)===selectedLine;button.setAttribute('aria-current',String(active));});
    const active=$('source-lines').querySelector(`[data-line="${selectedLine}"]`);
    if(active){const pane=$('source-lines'),relativeTop=active.offsetTop-pane.offsetTop;if(relativeTop<pane.scrollTop||relativeTop+active.offsetHeight>pane.scrollTop+pane.clientHeight)pane.scrollTop=relativeTop-pane.clientHeight/3;}
    text('file-position',`Chapter ${fileIndex+1} / 8 | line ${selectedLine} / ${f.rows.length}`);updateHash();
  }
  function selectLine(number){selectedLine=Math.max(1,Math.min(number,current().rows.length)); if(!rows().some(r=>r.line===selectedLine)){const after=rows().find(r=>r.line>=selectedLine);selectedLine=(after||rows().at(-1)).line;}explain();}
  function renderFile(){
    const f=current();$('file-select').value=String(fileIndex);$('line-jump').max=f.rows.length;
    text('source-name',f.name);text('source-count',`${f.rows.length} original lines`);
    document.querySelectorAll('#file-tree button').forEach((button,i)=>button.setAttribute('aria-current',String(i===fileIndex)));
    $('source-lines').replaceChildren(...rows().map(row=>{const button=document.createElement('button'),number=document.createElement('span'),code=document.createElement('code');button.type='button';button.className=row.kind;button.dataset.line=row.line;button.setAttribute('aria-label',`Line ${row.line}: ${row.raw.trim()||'blank'}`);number.className='number';number.textContent=row.line;code.textContent=row.raw||' ';button.append(number,code);button.addEventListener('click',()=>selectLine(row.line));return button;}));
    text('context-title',`${f.name}: the role of this file`);text('purpose',f.purpose);text('caller',`Called by: ${f.caller}`);text('analogy',`Picture it: ${f.analogy}`);
    $('checks').replaceChildren(...f.checks.map(([question,answer])=>{const detail=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p');summary.textContent=question;p.textContent=answer;detail.append(summary,p);return detail;}));
    selectLine(selectedLine);
  }
  data.files.forEach((f,index)=>{
    const option=document.createElement('option');option.value=index;option.textContent=`${index+1}. ${f.name}`;$('file-select').append(option);
    const button=document.createElement('button'),label=document.createElement('span'),sub=document.createElement('small');button.type='button';label.textContent=`${index+1}. ${f.name}`;sub.textContent=f.path.includes('/')?f.path.split('/')[0]:'Entry point';button.append(label,sub);button.addEventListener('click',()=>{fileIndex=index;selectedLine=1;renderFile();});$('file-tree').append(button);
  });
  $('file-select').addEventListener('change',()=>{fileIndex=Number($('file-select').value);selectedLine=1;renderFile();});
  $('code-only').addEventListener('change',renderFile);
  $('line-jump').addEventListener('change',()=>{const number=Number($('line-jump').value);if(Number.isFinite(number))selectLine(Math.trunc(number));});
  $('prev').addEventListener('click',()=>{const available=rows(),i=available.findIndex(r=>r.line===selectedLine);if(i>0)selectLine(available[i-1].line);});
  $('next').addEventListener('click',()=>{const available=rows(),i=available.findIndex(r=>r.line===selectedLine);if(i+1<available.length)selectLine(available[i+1].line);});
  $('understood').addEventListener('change',()=>{understood=understood.filter(k=>k!==key());if($('understood').checked)understood.push(key());try{localStorage.setItem('skylink-code-reader-v1',JSON.stringify({understood}));}catch(_){}progress();});
  window.addEventListener('hashchange',()=>{readHash();renderFile();});
  text('total-lines',data.totals.lines);buildDictionary($('dictionary'),Object.keys(data.glossary));readHash();renderFile();progress();
})();
