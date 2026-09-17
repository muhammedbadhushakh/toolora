
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
function copyText(t){navigator.clipboard?.writeText(t).then(()=>toast('Copied'))}
function toast(m){let x=$('#toast');if(!x){x=document.createElement('div');x.id='toast';x.style='position:fixed;bottom:20px;right:20px;background:#111827;color:white;padding:10px 14px;border-radius:10px;z-index:99';document.body.appendChild(x)}x.textContent=m;setTimeout(()=>x.remove(),1300)}
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function slug(s){return s.toString().trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w\s-]/g,'').replace(/[\s_-]+/g,'-').replace(/^-+|-+$/g,'')}
function downloadText(name,text,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function fmtNum(n){return Number(n).toLocaleString(undefined,{maximumFractionDigits:8})}
function parseCsv(t){let rows=[],row=[],cell='',q=false;for(let i=0;i<t.length;i++){let c=t[i],n=t[i+1];if(c==='"'&&q&&n==='"'){cell+='"';i++;continue}if(c==='"'){q=!q;continue}if(c===','&&!q){row.push(cell);cell='';continue}if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);cell='';if(row.some(x=>x!==''))rows.push(row);row=[];continue}cell+=c}row.push(cell);if(row.some(x=>x!==''))rows.push(row);return rows}
function csvString(rows){return rows.map(r=>r.map(x=>{x=String(x??'');return /[",\n]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x}).join(',')).join('\n')}
function isoDate(d){return new Date(d).toISOString().slice(0,10)}
