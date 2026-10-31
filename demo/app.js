(() => {
  const KEY = 'loopguard-demo-v1';
  const today = '2026-10-31';
  const seed = {
    role: 'admin',
    customers: [
      {id:'c1',name:'Northstar Studio',email:'finance@northstar.studio',initials:'NS',color:'green',segment:'Agency',since:'2024-03-14'},
      {id:'c2',name:'Lena Ortiz',email:'lena@orbitcoffee.co',initials:'LO',color:'blue',segment:'Small business',since:'2025-02-02'},
      {id:'c3',name:'Meridian Labs',email:'ap@meridianlabs.io',initials:'ML',color:'violet',segment:'Enterprise',since:'2023-08-19'},
      {id:'c4',name:'Goodwell Market',email:'ops@goodwell.market',initials:'GM',color:'amber',segment:'Retail',since:'2025-09-08'},
      {id:'c5',name:'Cedar & Co',email:'accounts@cedarco.ae',initials:'CC',color:'rose',segment:'Professional services',since:'2024-12-04'},
      {id:'c6',name:'Orbit Coffee',email:'hello@orbitcoffee.co',initials:'OC',color:'blue',segment:'Small business',since:'2026-01-22'}
    ],
    products: [
      {id:'p1',name:'Brightloop Core',description:'The workspace for teams that run on recurring revenue.',price:249,cost:72,billing:'monthly',units:23,icon:'◈',variants:'Starter · Growth · Scale'},
      {id:'p2',name:'Analytics Plus',description:'Deeper insights, forecasting, and cohort reporting.',price:89,cost:21,billing:'monthly',units:16,icon:'⌁',variants:'Standard · Odoo brand + 560'},
      {id:'p3',name:'Priority Support',description:'A named specialist and a two-hour response target.',price:1200,cost:440,billing:'yearly',units:8,icon:'✳',variants:'Business · Enterprise'},
      {id:'p4',name:'Team Seats',description:'Flexible seats for growing customer operations teams.',price:18,cost:4,billing:'monthly',units:44,icon:'♙',variants:'1–25 · 26–100 · 100+'}
    ],
    subscriptions: [
      {id:'BL-2048',customer:'c1',product:'p1',plan:'Growth · Monthly',amount:249,quantity:1,status:'Active',start:'2025-03-01',nextInvoice:'2026-11-01',end:'2027-03-01',risk:18,reason:'Billing is current; renewal window begins in 121 days.',owner:'Amina Malik',paymentTerms:'Net 15'},
      {id:'BL-2047',customer:'c2',product:'p1',plan:'Starter · Monthly',amount:249,quantity:1,status:'Active',start:'2026-02-01',nextInvoice:'2026-10-01',end:'2026-11-15',risk:87,reason:'Invoice INV-1082 is 30 days overdue · contract ends in 15 days.',owner:'Ravi Menon',paymentTerms:'Due on receipt'},
      {id:'BL-2046',customer:'c3',product:'p2',plan:'Scale · Annual',amount:1068,quantity:1,status:'Active',start:'2025-11-02',nextInvoice:'2026-11-02',end:'2026-11-02',risk:58,reason:'Annual renewal is in 2 days · confirm seats and renewal contact.',owner:'Amina Malik',paymentTerms:'Net 30'},
      {id:'BL-2045',customer:'c4',product:'p4',plan:'Team · Monthly',amount:540,quantity:30,status:'Active',start:'2026-06-20',nextInvoice:'2026-10-20',end:'2027-06-20',risk:49,reason:'Invoice INV-1087 is 11 days overdue.',owner:'Jordan Lee',paymentTerms:'Net 15'},
      {id:'BL-2044',customer:'c5',product:'p3',plan:'Enterprise · Annual',amount:1200,quantity:1,status:'Paused',start:'2025-12-05',nextInvoice:'2026-12-05',end:'2026-12-05',risk:43,reason:'Contract is paused · check-in recommended before renewal.',owner:'Ravi Menon',paymentTerms:'Net 30'},
      {id:'BL-2043',customer:'c6',product:'p1',plan:'Growth · Monthly',amount:498,quantity:2,status:'Active',start:'2026-02-01',nextInvoice:'2026-10-31',end:'2027-02-01',risk:8,reason:'Billing is current.',owner:'Jordan Lee',paymentTerms:'Due on receipt'}
    ],
    invoices: [
      {id:'INV-1089',subscription:'BL-2048',customer:'c1',date:'2026-10-01',due:'2026-10-16',amount:249,status:'Paid',cycle:'BL-2048:2026-10'},
      {id:'INV-1087',subscription:'BL-2045',customer:'c4',date:'2026-10-20',due:'2026-10-20',amount:540,status:'Overdue',cycle:'BL-2045:2026-10'},
      {id:'INV-1082',subscription:'BL-2047',customer:'c2',date:'2026-10-01',due:'2026-10-01',amount:249,status:'Overdue',cycle:'BL-2047:2026-10'},
      {id:'INV-1079',subscription:'BL-2046',customer:'c3',date:'2026-09-02',due:'2026-10-02',amount:1068,status:'Paid',cycle:'BL-2046:2026-09'},
      {id:'INV-1072',subscription:'BL-2044',customer:'c5',date:'2026-10-05',due:'2026-11-04',amount:1200,status:'Confirmed',cycle:'BL-2044:2026-10'}
    ],
    discounts: [
      {id:'SEAT-10',name:'More room to grow',kind:'Percentage',value:10,minimum:10,uses:4,limit:20,ends:'2026-12-31',status:'Active'},
      {id:'WELCOME25',name:'First year, together',kind:'Fixed amount',value:25,minimum:1,uses:7,limit:15,ends:'2026-11-30',status:'Active'},
      {id:'LEGACY15',name:'Founding customer',kind:'Percentage',value:15,minimum:1,uses:15,limit:15,ends:'2026-08-31',status:'Expired'}
    ],
    payments: [
      {id:'PAY-5504',invoice:'INV-1089',customer:'c1',date:'2026-10-02',method:'Bank transfer',amount:249,note:'October renewal · reference 00841'},
      {id:'PAY-5501',invoice:'INV-1079',customer:'c3',date:'2026-09-03',method:'Card',amount:1068,note:'Annual renewal'},
      {id:'PAY-5498',invoice:'INV-1066',customer:'c4',date:'2026-09-20',method:'Bank transfer',amount:540,note:'Paid in full'}
    ]
  };
  let db = load();
  let page = location.hash.slice(1) || 'dashboard';
  let filter = 'all';
  let query = '';

  function load(){ try { const saved=JSON.parse(localStorage.getItem(KEY)); return saved ? {...structuredClone(seed),...saved} : structuredClone(seed); } catch { return structuredClone(seed); } }
  function persist(){ localStorage.setItem(KEY,JSON.stringify(db)); }
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  const cash=(n,dec=0)=>new Intl.NumberFormat('en-AE',{style:'currency',currency:'AED',maximumFractionDigits:dec}).format(Number(n)||0);
  const person=id=>db.customers.find(x=>x.id===id)||{name:'Customer',email:'',initials:'CU',color:'green'};
  const product=id=>db.products.find(x=>x.id===id)||{name:'Subscription product'};
  const sub=id=>db.subscriptions.find(x=>x.id===id);
  const paidAmount=i=>db.payments.filter(p=>p.invoice===i.id).reduce((a,p)=>a+p.amount,0);
  const invoiceBalance=i=>Math.max(0,i.amount-paidAmount(i));
  const fmtDate=d=>d?new Date(`${d}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—';
  const statusClass=s=>String(s||'').toLowerCase().replace(/[^a-z]+/g,'-');
  function risk(s){
    let points=0, reasons=[];
    const open=db.invoices.filter(i=>i.subscription===s.id&&['Overdue','Confirmed','Draft'].includes(i.status)&&invoiceBalance(i)>0);
    const overdue=open.filter(i=>i.status==='Overdue');
    if(overdue.length){let days=Math.max(0,...overdue.map(i=>Math.floor((new Date(today)-new Date(i.due+'T00:00:00'))/86400000)));points+=Math.min(55,25+Math.min(3,Math.floor(days/7))*10);reasons.push(`${overdue.length} overdue invoice${overdue.length>1?'s':''} · ${cash(overdue.reduce((a,i)=>a+invoiceBalance(i),0))} outstanding`);}
    else if(open.length){points+=18;reasons.push(`${open.length} invoice${open.length>1?'s':''} awaiting payment`);}
    const days=s.end?Math.floor((new Date(s.end+'T00:00:00')-new Date(today+'T00:00:00'))/86400000):9999;
    if(days<0){points+=28;reasons.push(`Contract ended ${Math.abs(days)} days ago`)}else if(days<=14){points+=25;reasons.push(`Contract ends in ${days} days`)}else if(days<=45){points+=12;reasons.push(`Renewal window opens in ${days} days`)}
    const nextDays=s.nextInvoice?Math.floor((new Date(today+'T00:00:00')-new Date(s.nextInvoice+'T00:00:00'))/86400000):0;
    if(nextDays>0&&s.status==='Active'&&!open.some(i=>i.status==='Overdue')){points+=18;reasons.push(`Next billing date is ${nextDays} days late`)}
    if(s.status==='Paused'){points+=20;reasons.push('Subscription is paused · confirm customer intent')}
    points=Math.min(points,100);
    const level=points>=75?'critical':points>=50?'high':points>=25?'watch':'low';
    const action=overdue.length?'Call customer and agree a payment date':days<=45?'Send renewal options and confirm seat needs':s.status==='Paused'?'Check in and agree a restart or close date':points>=25?'Review account health and schedule a check-in':'Keep on the standard renewal cadence';
    return {points,level,reasons:reasons.length?reasons.join(' · '):'Billing is current · renewal is on track',action,overdue:overdue.reduce((a,i)=>a+i.amount,0)};
  }
  function activeSubs(){return db.subscriptions.filter(s=>s.status==='Active');}
  function totals(){const overdue=db.invoices.filter(i=>i.status==='Overdue').reduce((a,i)=>a+invoiceBalance(i),0);const mrr=activeSubs().reduce((a,s)=>a+(s.plan.toLowerCase().includes('annual')?s.amount/12:s.amount),0);const atRisk=db.subscriptions.reduce((a,s)=>a+(risk(s).points>=50?s.amount:0),0);return {active:activeSubs().length,mrr,overdue,atRisk};}
  function initialsClass(p){return `avatar avatar-${esc(p.color||'green')}`;}
  function customerCell(p){return `<div class="customer-cell"><span class="${initialsClass(p)}">${esc(p.initials)}</span><span>${esc(p.name)}<span class="cell-secondary">${esc(p.email)}</span></span></div>`;}
  function status(s){return `<span class="status status-${statusClass(s)}">${esc(s)}</span>`;}
  function header(kicker,title,desc,actions=''){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${desc}</p></div><div class="heading-actions">${actions}</div></div>`;}
  function stat(label,value,note,icon='◫',trend='',tone='positive'){return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-symbol">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-foot">${trend?`<b class="${tone}">${trend}</b>`:''}<span>${note}</span></div><i class="stat-accent"></i></article>`;}
  function tablePanel(title,subtitle,columns,rows,opts={}){
    const actions=`<div class="table-toolbar">${opts.search!==false?`<label class="search-box"><input id="tableSearch" value="${esc(query)}" placeholder="Search ${opts.searchLabel||'records'}…"></label>`:''}${opts.filters?`<select class="filter-select" id="tableFilter">${opts.filters.map(f=>`<option value="${f.value}" ${filter===f.value?'selected':''}>${f.label}</option>`).join('')}</select>`:''}</div>`;
    const head=columns.map(c=>`<th>${c.label}</th>`).join('');
    const body=rows.length?rows.map(row=>`<tr>${columns.map(c=>`<td>${c.render(row)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${columns.length}"><div class="empty-state">Nothing to show here yet.</div></td></tr>`;
    return `<section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">${title}</div><div class="panel-subtitle">${subtitle}</div></div>${actions}</div><div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div><div class="panel-foot"><span>Showing ${rows.length} ${opts.recordLabel||'records'}</span><span>Live demo data · ${esc(today)}</span></div></section>`;
  }
  const rowAction=(action,id,label='•••')=>`<button class="row-action" data-action="${action}" data-id="${esc(id)}" aria-label="${esc(action)}">${label}</button>`;
  function subRows(list=db.subscriptions){
    return list.filter(s=>{
      if(db.role==='customer'&&s.customer!=='c2')return false;
      const p=person(s.customer),match=`${s.id} ${p.name} ${p.email} ${product(s.product).name}`.toLowerCase().includes(query.toLowerCase());
      return match&&(filter==='all'||s.status.toLowerCase()===filter||risk(s).level===filter);
    });
  }
  const subColumns=[
    {label:'Customer',render:s=>customerCell(person(s.customer))},
    {label:'Subscription',render:s=>`<span class="mono">${esc(s.id)}</span><div class="cell-secondary">${esc(s.plan)}</div>`},
    {label:'Amount',render:s=>`<span class="mono">${cash(s.amount)}</span>`},
    {label:'Next billing',render:s=>fmtDate(s.nextInvoice)},
    {label:'Renewal health',render:s=>{const r=risk(s);return `<span class="risk-bar"><i class="${r.level}" style="width:${r.points}%"></i></span><span class="mono">${r.points}</span>`}},
    {label:'Status',render:s=>status(s.status)},
    {label:'Rescue stage',render:s=>status(s.caseStage==='working'?'In progress':s.caseStage==='saved'?'Renewed':s.caseStage==='closed'?'Closed':risk(s).points>=25?'Needs review':'On track')},
    {label:'',render:s=>rowAction('submenu',s.id)}
  ];
  function overview(){
    const t=totals();const top=[...db.subscriptions].map(s=>({s,r:risk(s)})).filter(x=>x.r.points>=25).sort((a,b)=>b.r.points-a.r.points).slice(0,4);
    const rows=[...db.subscriptions].sort((a,b)=>new Date(a.nextInvoice)-new Date(b.nextInvoice)).slice(0,5);
    return `${header('SATURDAY, OCTOBER 31, 2026','Good morning, Amina <span style="color:#3d9762">↗</span>','Your recurring revenue, at a glance.',`<button class="btn" data-action="export">↧ &nbsp;Export report</button><button class="btn btn-primary" data-action="new-sub">＋ &nbsp;New subscription</button>`)}
      <div class="stat-grid">${stat('Monthly recurring revenue',cash(t.mrr),'vs last month','↗','↗ 8.2%')}${stat('Active subscriptions',t.active.toLocaleString('en'),'across 6 customers','↻','↗ 3 new')}${stat('Revenue at risk',cash(t.atRisk),'needs a human touch','⌁','3 contracts','negative')}${stat('Overdue invoices',cash(t.overdue),'2 invoices need follow-up','◴','2 open','negative')}</div>
      <div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><div class="panel-title">Revenue, in rhythm</div><div class="panel-subtitle">Collected vs. recurring revenue · last 7 months</div></div><div class="chart-legend"><span class="legend-item"><i class="legend-dot"></i>Collected</span><span class="legend-item"><i class="legend-dot gray"></i>MRR</span><select class="filter-select"><option>Last 7 months</option><option>This year</option></select></div></div><div class="chart-wrap"><svg class="revenue-chart" viewBox="0 0 660 145" preserveAspectRatio="none" role="img" aria-label="Revenue trend rises from April to October"><defs><linearGradient id="fadeGreen" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5db47b" stop-opacity=".18"/><stop offset="1" stop-color="#5db47b" stop-opacity="0"/></linearGradient></defs><line class="chart-grid" x1="38" y1="18" x2="650" y2="18"/><line class="chart-grid" x1="38" y1="51" x2="650" y2="51"/><line class="chart-grid" x1="38" y1="84" x2="650" y2="84"/><line class="chart-grid" x1="38" y1="117" x2="650" y2="117"/><text class="chart-label" x="0" y="21">14k</text><text class="chart-label" x="0" y="54">10k</text><text class="chart-label" x="5" y="87">6k</text><text class="chart-label" x="5" y="120">2k</text><path class="chart-area" d="M42 104 L137 91 L232 96 L327 74 L422 70 L517 48 L612 34 L612 117 L42 117Z"/><path class="chart-line-alt" d="M42 108 L137 104 L232 97 L327 94 L422 87 L517 76 L612 71"/><path class="chart-line" d="M42 104 L137 91 L232 96 L327 74 L422 70 L517 48 L612 34"/><circle cx="612" cy="34" r="4" fill="#39a36a" stroke="#fff" stroke-width="2"/><text class="chart-label" x="37" y="139">APR</text><text class="chart-label" x="132" y="139">MAY</text><text class="chart-label" x="227" y="139">JUN</text><text class="chart-label" x="322" y="139">JUL</text><text class="chart-label" x="417" y="139">AUG</text><text class="chart-label" x="512" y="139">SEP</text><text class="chart-label" x="607" y="139">OCT</text></svg></div><div class="panel-foot"><span>Collected this month <b style="color:#263b2f">AED 13,840</b></span><span>Forecast <b style="color:#263b2f">AED 15,260</b> &nbsp;↗</span></div></section>
      <section class="panel"><div class="panel-head"><div><div class="panel-title">Renewal radar</div><div class="panel-subtitle">Three accounts need attention</div></div><a class="panel-link" href="#renewals">View all →</a></div><div class="radar-list">${top.map(({s,r})=>`<div class="radar-row"><span class="risk-score ${r.level}">${r.points}</span><div class="radar-copy"><b>${esc(person(s.customer).name)}</b><small>${esc(r.reasons.split(' · ')[0])}</small></div><span class="money-mini">${cash(s.amount)}</span></div>`).join('')}</div><div class="panel-foot"><span>Annual value exposed</span><b style="color:#a8661c">${cash(top.reduce((a,x)=>a+x.s.amount,0))}</b></div></section></div>
      ${tablePanel('Upcoming billing','The next subscriptions in your billing queue',subColumns,rows,{search:false,recordLabel:'subscriptions',filters:[{value:'all',label:'All statuses'}]})}`;
  }
  function subscriptionsPage(radar=false){
    const list=radar?db.subscriptions.filter(s=>(db.role!=='customer'||s.customer==='c2')&&risk(s).points>=25).sort((a,b)=>risk(b).points-risk(a).points):subRows();
    const actions=db.role==='customer'?'':radar?`<button class="btn" data-action="export">↧ &nbsp;Export risk list</button><button class="btn btn-primary" data-action="scan">⟳ &nbsp;Run risk scan</button>`:`<button class="btn" data-action="bill-due">▤ &nbsp;Bill due subscriptions</button><button class="btn btn-primary" data-action="new-sub">＋ &nbsp;New subscription</button>`;
    const description=radar?'A ranked queue of accounts that could churn, with a reason and a next best action.':'Plans, renewals and recurring commitments in one place.';
    const cols=radar?[
      {label:'Customer',render:s=>customerCell(person(s.customer))},
      {label:'Risk',render:s=>{const r=risk(s);return `<span class="status status-${r.level==='critical'?'critical':r.level==='high'?'overdue':'pending'}">${r.level.toUpperCase()} · ${r.points}</span>`}},
      {label:'Annual value',render:s=>`<span class="mono">${cash(s.amount*(s.plan.toLowerCase().includes('annual')?1:12))}</span>`},
      {label:'Why it surfaced',render:s=>`<span style="white-space:normal;min-width:170px;display:inline-block;max-width:240px">${esc(risk(s).reasons)}</span>`},
      {label:'Next best action',render:s=>`<span style="white-space:normal;min-width:170px;display:inline-block;max-width:240px">${esc(risk(s).action)}</span>`},
      {label:'Owner',render:s=>esc(s.owner)},
      {label:'',render:s=>rowAction('rescue',s.id,'Open →')}
    ]:subColumns;
    const subtitle=radar?`${list.length} accounts · ranked by urgency and recoverable value`:`${db.subscriptions.length} contracts · renewals and billing status`;
    return `${header(radar?'RETENTION INTELLIGENCE':'RECURRING REVENUE',radar?'Renewal radar':'Subscriptions',description,actions)}${radar?`<div class="role-banner">✦ &nbsp;Risk score combines unpaid invoice age, upcoming contract end dates and late billing. Scores refresh when billing or contract details change.</div><div class="stat-grid">${stat('Revenue exposed',cash(list.reduce((a,s)=>a+s.amount*(s.plan.toLowerCase().includes('annual')?1:12),0)),'annualized contract value','⌁','','negative')}${stat('Critical accounts',list.filter(s=>risk(s).level==='critical').length,'same-day outreach recommended','⚑','','negative')}${stat('Overdue balance',cash(db.invoices.filter(i=>i.status==='Overdue').reduce((a,i)=>a+i.amount,0)),'across 2 customers','◴','','negative')}${stat('Saved this month','AED 4,920','2 contracts renewed','↗','↗ 1.3%')}</div>`:''}${tablePanel(radar?'Accounts to rescue':'All subscriptions',subtitle,cols,list,{recordLabel:radar?'accounts':'subscriptions',filters:radar?null:[{value:'all',label:'All statuses'},{value:'active',label:'Active'},{value:'paused',label:'Paused'},{value:'closed',label:'Closed'}]})}`;
  }
  function invoicesPage(){
    let list=db.invoices.filter(i=>(db.role!=='customer'||i.customer==='c2')&&(filter==='all'||i.status.toLowerCase()===filter)).filter(i=>`${i.id} ${person(i.customer).name} ${i.subscription}`.toLowerCase().includes(query.toLowerCase()));
    const cols=[{label:'Invoice',render:i=>`<span class="mono">${esc(i.id)}</span><div class="cell-secondary">${esc(i.subscription)}</div>`},{label:'Customer',render:i=>customerCell(person(i.customer))},{label:'Invoice date',render:i=>fmtDate(i.date)},{label:'Due date',render:i=>fmtDate(i.due)},{label:'Amount',render:i=>`<span class="mono">${cash(i.amount)}</span>${paidAmount(i)?`<div class="cell-secondary">${cash(invoiceBalance(i))} remaining</div>`:''}`},{label:'Status',render:i=>status(i.status)},{label:'',render:i=>db.role!=='customer'&&i.status!=='Paid'?rowAction('pay-invoice',i.id,'Record payment'):''}];
    const t=totals();const stats=db.role==='customer'?'':`<div class="stat-grid">${stat('Collected this month','AED 13,840','from 42 invoices','✓','↗ 8.4%')}${stat('Outstanding',cash(db.invoices.filter(i=>!['Paid','Cancelled'].includes(i.status)).reduce((a,i)=>a+invoiceBalance(i),0)),'all unpaid invoices','▤')}${stat('Overdue',cash(t.overdue),'2 invoices · 2 customers','◴','','negative')}${stat('Collection rate','96.4%','within payment terms','↗','↗ 1.8%')}</div>`;return `${header('ACCOUNTS RECEIVABLE',db.role==='customer'?'Your invoices':'Invoices',db.role==='customer'?'Your invoice history and payment status.':'Every recurring charge, traceable back to the subscription.',db.role==='customer'?'':`<button class="btn btn-primary" data-action="bill-due">＋ &nbsp;Generate due invoices</button>`)}${stats}${tablePanel(db.role==='customer'?'Invoice history':'Invoice register',`${list.length} ${db.role==='customer'?'invoices':'invoices · duplicate billing cycles blocked'}`,cols,list,{filters:[{value:'all',label:'All statuses'},{value:'overdue',label:'Overdue'},{value:'confirmed',label:'Confirmed'},{value:'paid',label:'Paid'}],recordLabel:'invoices'})}`;
  }
  function customersPage(){
    const list=db.customers.filter(p=>`${p.name} ${p.email} ${p.segment}`.toLowerCase().includes(query.toLowerCase())).filter(p=>db.role!=='customer'||p.id==='c2');
    const cols=[{label:'Customer',render:p=>customerCell(p)},{label:'Segment',render:p=>esc(p.segment)},{label:'Subscriptions',render:p=>db.subscriptions.filter(s=>s.customer===p.id).length},{label:'Monthly value',render:p=>`<span class="mono">${cash(db.subscriptions.filter(s=>s.customer===p.id&&s.status==='Active').reduce((a,s)=>a+(s.plan.toLowerCase().includes('annual')?s.amount/12:s.amount),0))}</span>`},{label:'Outstanding',render:p=>`<span class="mono">${cash(db.invoices.filter(i=>i.customer===p.id&&i.status==='Overdue').reduce((a,i)=>a+i.amount,0))}</span>`},{label:'Since',render:p=>fmtDate(p.since)},{label:'',render:p=>rowAction('customer',p.id,'View →')}];
    return `${header('CUSTOMER SUCCESS',db.role==='customer'?'Your account':'Customers',db.role==='customer'?'Your subscriptions and billing, all in one place.':'A clear view of every relationship and its recurring value.',db.role==='customer'?'':`<button class="btn btn-primary" data-action="new-customer">＋ &nbsp;Add customer</button>`)}${db.role==='customer'?`<div class="customer-hero"><div class="eyebrow">CUSTOMER PORTAL</div><h2>Good afternoon, Lena.</h2><p>Thanks for building with Brightloop. Your workspace and upcoming billing details are below.</p><button class="btn" data-action="portal-help">✉ &nbsp;Contact our team</button></div>`:''}${tablePanel(db.role==='customer'?'Account overview':'Customer directory',`${list.length} ${db.role==='customer'?'account':'customers'} · subscription and balance summary`,cols,list,{recordLabel:'customers'})}`;
  }
  function productsPage(){
    const cadence={daily:'day',weekly:'week',monthly:'month',yearly:'year'};const cards=db.products.filter(p=>`${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())).map(p=>`<article class="product-card"><div class="product-top"><span class="product-icon">${esc(p.icon)}</span><button class="row-action" data-action="edit-product" data-id="${esc(p.id)}">•••</button></div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="product-price">${cash(p.price)} <small>/ ${esc(cadence[p.billing]||p.billing)}</small></div><div class="product-meta"><span>${esc(p.variants)}</span><b>${p.units} subscribers</b></div></article>`).join('');
    return `${header('CATALOG & PRICING','Products & plans','Set up recurring products, billing intervals, variants and unit economics.',`<button class="btn btn-primary" data-action="new-product">＋ &nbsp;New product</button>`)}<div class="section-grid">${cards||'<div class="empty-state">No matching products.</div>'}</div><section class="panel" style="margin-top:15px"><div class="panel-head"><div><div class="panel-title">Plan cadence</div><div class="panel-subtitle">Available billing intervals used across the catalog</div></div></div><div class="panel-foot" style="padding:15px 17px"><span>Daily · Weekly · Monthly · Yearly</span><span>Minimum quantity enforced per plan</span></div></section>`;
  }
  function discountsPage(){
    const cards=db.discounts.filter(d=>`${d.id} ${d.name}`.toLowerCase().includes(query.toLowerCase())).map(d=>`<article class="discount-card"><span class="discount-icon">${d.kind==='Percentage'?'%':'−'}</span><div><h3>${esc(d.name)} <span class="mono">${esc(d.id)}</span></h3><p>${d.kind==='Percentage'?`${d.value}% off`:`${cash(d.value)} off`} · min. ${d.minimum} item(s) · ${d.uses}/${d.limit} used · ends ${fmtDate(d.ends)}</p></div>${status(d.status)}</article>`).join('');
    return `${header('PRICING RULES','Discounts','Rules are automatically applied to eligible recurring invoices.',`<button class="btn btn-primary" ${db.role!=='admin'?'disabled':''} data-action="new-discount">＋ &nbsp;Create discount</button>`)}${db.role!=='admin'?'<div class="role-banner">Only administrators can create and edit discount rules.</div>':''}<div style="display:grid;gap:10px">${cards||'<div class="empty-state">No matching discount rules.</div>'}</div>`;
  }
  function paymentsPage(){
    const cols=[{label:'Payment',render:p=>`<span class="mono">${esc(p.id)}</span><div class="cell-secondary">${esc(p.method)}</div>`},{label:'Customer',render:p=>customerCell(person(p.customer))},{label:'Invoice',render:p=>`<span class="mono">${esc(p.invoice)}</span>`},{label:'Date',render:p=>fmtDate(p.date)},{label:'Amount',render:p=>`<span class="mono">${cash(p.amount)}</span>`},{label:'Note',render:p=>esc(p.note)}];
    return `${header('CASH APPLICATION','Payments','Match each incoming payment to the invoice it settles.',`<button class="btn btn-primary" data-action="new-payment">＋ &nbsp;Record payment</button>`)}<div class="stat-grid">${stat('Received this month','AED 13,840','42 payments reconciled','⇢','↗ 8.4%')}${stat('Payment methods','4','card · bank · transfer · cash','▣')}${stat('Unmatched','AED 0','all payments reconciled','✓')}${stat('Median time to pay','4.2 days','from invoice date','◷','↓ 0.8 days')}</div>${tablePanel('Payment ledger',`${db.payments.length} recorded payments`,cols,db.payments.filter(p=>`${p.id} ${p.invoice} ${person(p.customer).name}`.toLowerCase().includes(query.toLowerCase())),{recordLabel:'payments'})}`;
  }
  function reportsPage(){
    const t=totals();const metrics=[['Recurring revenue',cash(t.mrr*12),'Annualized run rate',[14420,15240,15880,16190,17040,18220,19470]],['Collections',cash(db.payments.reduce((a,p)=>a+p.amount,0)),'Payments recorded in this demo',[31,43,58,45,68,72,84]],['Overdue balance',cash(t.overdue),'Across open customer invoices',[12,25,22,31,42,38,60]],['Retention health',`${Math.round(db.subscriptions.filter(s=>risk(s).points<50).length/db.subscriptions.length*100)}%`,'Contracts below high-risk threshold',[65,68,67,72,76,79,84]]];
    const months=['A','M','J','J','A','S','O'];
    return `${header('FINANCE & RETENTION','Reports','A live summary of recurring revenue, collections, and account health.',`<button class="btn" data-action="export">↧ &nbsp;Download CSV</button>`)}<div class="report-grid">${metrics.map(([label,value,note,vals])=>{const max=Math.max(...vals);return `<article class="report-card"><h3>${label}</h3><p>${note}</p><div class="report-big">${value}</div><div class="report-note">October 2026 · vs. prior period <b class="positive">↗ 8.2%</b></div><div class="report-bars">${vals.map((v,i)=>`<i style="height:${Math.max(12,Math.round(v/max*100))}%"><span>${months[i]}</span></i>`).join('')}</div></article>`;}).join('')}</div><section class="panel" style="margin-top:16px"><div class="panel-head"><div><div class="panel-title">Revenue rescue forecast</div><div class="panel-subtitle">The value currently exposed to renewal or payment risk</div></div><b class="mono" style="color:#b37428">${cash(t.atRisk*12)} annualized</b></div><div class="panel-foot"><span>High and critical contracts: ${db.subscriptions.filter(s=>risk(s).points>=50).length}</span><span>Open overdue invoices: ${db.invoices.filter(i=>i.status==='Overdue').length}</span></div></section>`;
  }
  function settingsPage(){return `${header('WORKSPACE','Settings','Configure the demo workspace and its access views.')}<section class="settings-card"><h3>Role based demo views</h3><p>Switch between Admin, Operations, and Customer to preview what each person sees. In the Odoo add-on, access follows Odoo's user groups and customer portal permissions.</p><button class="btn" data-action="role-menu">Switch demo profile</button></section><section class="settings-card"><h3>Demo data</h3><p>All sample records are fictional and stored in this browser only.</p><button class="btn btn-danger" data-action="reset">Reset demo data</button></section><section class="settings-card"><h3>Odoo companion</h3><p>The LoopGuard add-on folder contains the installable Odoo extension and daily subscription risk scan.</p><span class="mono">loopguard_subscription/ · version 19.0.1.0.0</span></section>`;}
  function pageName(p){return ({dashboard:'Overview',subscriptions:'Subscriptions',renewals:'Renewal radar',invoices:'Invoices',customers:'Customers',products:'Products & plans',discounts:'Discounts',payments:'Payments',reports:'Reports',settings:'Settings'})[p]||'Overview';}
  function render(){
    page=location.hash.slice(1)||'dashboard';if(!['dashboard','subscriptions','renewals','invoices','customers','products','discounts','payments','reports','settings'].includes(page))page='dashboard';
    document.querySelectorAll('[data-page]').forEach(a=>{
      const customerPages=['subscriptions','invoices','customers'];
      const opsPages=['dashboard','subscriptions','renewals','invoices','customers','payments'];
      a.hidden=db.role==='customer'?!customerPages.includes(a.dataset.page):db.role==='ops'?!opsPages.includes(a.dataset.page):false;
      a.classList.toggle('active',a.dataset.page===page);
    });
    document.getElementById('breadcrumbCurrent').textContent=pageName(page);
    document.getElementById('profileName').textContent=db.role==='customer'?'Lena Ortiz':db.role==='ops'?'Ravi Menon':'Amina Malik';
    document.getElementById('profileRole').textContent=db.role==='customer'?'Customer portal':db.role==='ops'?'Operations · limited':'Administrator';
    document.getElementById('riskCount').textContent=db.subscriptions.filter(s=>risk(s).points>=50).length;
    document.getElementById('subCount').textContent=db.subscriptions.length;
    document.getElementById('invoiceCount').textContent=db.invoices.filter(i=>i.status==='Overdue').length;
    const root=document.getElementById('viewRoot');
    if(db.role==='customer'&&!['subscriptions','invoices','customers'].includes(page)){page='customers';location.hash='#customers';}
    if(db.role==='ops'&&!['dashboard','subscriptions','renewals','invoices','customers','payments'].includes(page)){page='renewals';location.hash='#renewals';}
    root.innerHTML=page==='dashboard'?overview():page==='subscriptions'?subscriptionsPage():page==='renewals'?subscriptionsPage(true):page==='invoices'?invoicesPage():page==='customers'?customersPage():page==='products'?productsPage():page==='discounts'?discountsPage():page==='payments'?paymentsPage():page==='reports'?reportsPage():settingsPage();
  }
  function toast(message,isError=false){const box=document.createElement('div');box.className=`toast${isError?' error':''}`;box.textContent=message;document.getElementById('toastRoot').append(box);setTimeout(()=>box.remove(),2800);}
  function nextId(prefix,arr){return `${prefix}-${String(1100+arr.length+Math.floor(Math.random()*60)).padStart(4,'0')}`;}
  function modal(title,body,onSave,label='Save changes'){
    const root=document.getElementById('modalRoot');root.innerHTML=`<div class="modal-backdrop" data-close="1"><form class="modal" id="editForm"><div class="modal-head"><h2>${title}</h2><button type="button" class="modal-close" data-close="1">×</button></div><div class="modal-body">${body}</div><div class="modal-foot"><button type="button" class="btn" data-close="1">Cancel</button><button class="btn btn-primary" type="submit">${label}</button></div></form></div>`;
    root.querySelector('#editForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);if(onSave(Object.fromEntries(fd.entries()))!==false){root.innerHTML='';persist();render();}});
  }
  const field=(label,name,value='',type='text',opts={})=>`<div class="field ${opts.full?'full':''}"><label>${label}</label>${type==='select'?`<select name="${name}" ${opts.required?'required':''}>${opts.options.map(o=>`<option value="${esc(o.value)}" ${String(o.value)===String(value)?'selected':''}>${esc(o.label)}</option>`).join('')}</select>`:type==='textarea'?`<textarea name="${name}">${esc(value)}</textarea>`:`<input name="${name}" type="${type}" value="${esc(value)}" ${opts.required?'required':''} ${opts.min!==undefined?`min="${opts.min}"`:''} ${opts.step?`step="${opts.step}"`:''}>`}</div>`;
  function newSub(){
    if(db.role==='customer'){toast('Ask the Brightloop team to add a subscription.',true);return;}
    const customerOpts=db.customers.map(p=>({value:p.id,label:p.name}));const productOpts=db.products.map(p=>({value:p.id,label:p.name}));
    modal('Create subscription',`<div class="form-grid">${field('Customer','customer','c1','select',{options:customerOpts,required:true})}${field('Product','product','p1','select',{options:productOpts,required:true})}${field('Plan','plan','Growth · Monthly','text',{required:true})}${field('Quantity','quantity',1,'number',{required:true,min:1})}${field('Monthly / annual price (AED)','amount',249,'number',{required:true,min:0,step:0.01})}${field('Status','status','Quotation','select',{options:['Draft','Quotation','Confirmed','Active'].map(x=>({value:x,label:x}))})}${field('Start date','start',today,'date')}${field('Next invoice','nextInvoice','2026-11-01','date')}${field('Expiry date','end','2027-10-31','date')}${field('Payment terms','paymentTerms','Net 15','text')}${field('Assigned to','owner','Amina Malik','text')}${field('Notes','notes','','textarea',{full:true})}</div>`,v=>{
      const id=`BL-${2049+db.subscriptions.length}`;db.subscriptions.unshift({...v,id,quantity:Number(v.quantity),amount:Number(v.amount),risk:0,reason:'New account · awaiting initial activation'});toast(`${id} added to subscriptions.`);return true;
    },'Create subscription');
  }
  function newCustomer(){modal('Add customer',`<div class="form-grid">${field('Company / name','name','','text',{required:true})}${field('Email','email','','email',{required:true})}${field('Segment','segment','Small business','text')}${field('First contract date','since',today,'date')}</div>`,v=>{const initials=v.name.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();db.customers.unshift({id:`c${Date.now()}`,name:v.name,email:v.email,initials,color:'green',segment:v.segment,since:v.since});toast('Customer profile created.');return true;});}
  function newProduct(){modal('Add recurring product',`<div class="form-grid">${field('Product name','name','','text',{required:true})}${field('Type','type','Service','select',{options:['Service','Software','Seat','Support'].map(x=>({value:x,label:x}))})}${field('Sales price (AED)','price',100,'number',{required:true,min:0,step:0.01})}${field('Cost price (AED)','cost',30,'number',{min:0,step:0.01})}${field('Billing cadence','billing','monthly','select',{options:[{value:'daily',label:'Daily'},{value:'weekly',label:'Weekly'},{value:'monthly',label:'Monthly'},{value:'yearly',label:'Yearly'}]})}${field('Variants','variants','Standard','text')}${field('Notes','description','','textarea',{full:true})}</div>`,v=>{db.products.unshift({id:`p${Date.now()}`,name:v.name,description:v.description,price:Number(v.price),cost:Number(v.cost),billing:v.billing,units:0,icon:'◇',variants:v.variants});toast('Product and recurring price added.');return true;});}
  function newDiscount(){if(db.role!=='admin'){toast('Only the admin can create discount rules.',true);return;}modal('Create discount rule',`<div class="form-grid">${field('Rule name','name','','text',{required:true})}${field('Code','id','','text',{required:true})}${field('Discount type','kind','Percentage','select',{options:['Percentage','Fixed amount'].map(x=>({value:x,label:x}))})}${field('Value','value',10,'number',{required:true,min:0,step:0.01})}${field('Minimum quantity','minimum',1,'number',{min:1})}${field('Usage limit','limit',20,'number',{min:1})}${field('Valid until','ends','2026-12-31','date')}</div>`,v=>{db.discounts.unshift({...v,value:Number(v.value),minimum:Number(v.minimum),limit:Number(v.limit),uses:0,status:'Active'});toast('Discount rule created.');return true;});}
  function createInvoice(s){
    const cycle=s.id+':'+s.nextInvoice.slice(0,7);
    if(db.invoices.some(i=>i.cycle===cycle)){toast(`${s.id} is already billed for this cycle.`,true);return;}
    const applicable=db.discounts.find(d=>d.status==='Active'&&d.uses<d.limit&&new Date(d.ends+'T00:00:00')>=new Date(today+'T00:00:00')&&s.quantity>=d.minimum);
    let amount=s.amount;
    if(applicable){amount=applicable.kind==='Percentage'?amount*(1-applicable.value/100):Math.max(0,amount-applicable.value);applicable.uses+=1;}
    const date=s.nextInvoice||today;const due=new Date(`${date}T00:00:00`);due.setDate(due.getDate()+(s.paymentTerms.includes('30')?30:s.paymentTerms.includes('15')?15:0));
    const invoice={id:nextId('INV',db.invoices),subscription:s.id,customer:s.customer,date,due:due.toISOString().slice(0,10),amount,status:'Confirmed',cycle};db.invoices.unshift(invoice);s.nextInvoice=new Date(new Date(date+'T00:00:00').getTime()+30*86400000).toISOString().slice(0,10);toast(`Invoice ${invoice.id} generated${applicable?` · ${applicable.name} applied`:''}.`);persist();render();
  }
  function billDue(){const due=db.subscriptions.filter(s=>s.status==='Active'&&s.nextInvoice<=today&&!db.invoices.some(i=>i.cycle===s.id+':'+s.nextInvoice.slice(0,7)));if(!due.length){toast('No active subscriptions are due for billing.');return;}due.forEach(s=>{const cycle=s.id+':'+s.nextInvoice.slice(0,7);let amount=s.amount;const d=db.discounts.find(x=>x.status==='Active'&&x.uses<x.limit&&new Date(x.ends+'T00:00:00')>=new Date(today+'T00:00:00')&&s.quantity>=x.minimum);if(d){amount=d.kind==='Percentage'?amount*(1-d.value/100):Math.max(0,amount-d.value);d.uses++;}const date=s.nextInvoice;const dueDate=new Date(date+'T00:00:00');dueDate.setDate(dueDate.getDate()+15);db.invoices.unshift({id:nextId('INV',db.invoices),subscription:s.id,customer:s.customer,date,due:dueDate.toISOString().slice(0,10),amount,status:'Confirmed',cycle});const n=new Date(date+'T00:00:00');n.setDate(n.getDate()+30);s.nextInvoice=n.toISOString().slice(0,10);});persist();render();toast(`${due.length} invoice${due.length===1?'':'s'} generated · duplicate cycles skipped.`);}
  function recordPayment(invoiceId){const inv=db.invoices.find(i=>i.id===invoiceId);if(!inv)return;modal(`Record payment · ${inv.id}`,`<div class="form-grid">${field('Amount (AED)','amount',invoiceBalance(inv),'number',{required:true,min:0,step:.01})}${field('Payment method','method','Bank transfer','select',{options:['Bank transfer','Card','Cash','Cheque','Direct debit'].map(x=>({value:x,label:x}))})}${field('Payment date','date',today,'date',{required:true})}${field('Reference / note','note','Payment received')}</div>`,v=>{db.payments.unshift({id:nextId('PAY',db.payments),invoice:inv.id,customer:inv.customer,date:v.date,method:v.method,amount:Number(v.amount),note:v.note});if(paidAmount(inv)>=inv.amount)inv.status='Paid';else inv.status=inv.due<today?'Overdue':'Confirmed';toast(inv.status==='Paid'?`${inv.id} settled and marked paid.`:'Partial payment recorded.');return true;},'Apply payment');}
  function customerModal(id){const p=person(id);const subs=db.subscriptions.filter(s=>s.customer===id);modal(esc(p.name),`<div class="sub-detail"><div class="sub-detail-grid"><span><small>Customer since</small><b>${fmtDate(p.since)}</b></span><span><small>Segment</small><b>${esc(p.segment)}</b></span><span><small>Active contracts</small><b>${subs.filter(s=>s.status==='Active').length}</b></span></div></div>${subs.map(s=>`<div class="sub-detail"><b>${esc(s.id)} · ${esc(product(s.product).name)}</b><div class="sub-detail-grid" style="margin-top:9px"><span><small>Plan</small><b>${esc(s.plan)}</b></span><span><small>Next billing</small><b>${fmtDate(s.nextInvoice)}</b></span><span><small>Risk signal</small><b>${risk(s).points} · ${risk(s).level}</b></span></div><p style="font-size:9px;color:#758078;line-height:1.5">${esc(risk(s).reasons)}</p></div>`).join('')||'<p>No subscriptions yet.</p>'}`,()=>true,'Done');document.querySelector('#editForm .modal-foot').innerHTML='<button type="button" class="btn btn-primary" data-close="1">Done</button>';}
  function rescueModal(id){const s=sub(id),r=risk(s);if(!s)return;modal(`Rescue plan · ${person(s.customer).name}`,`<div class="role-banner"><b>${r.points} · ${r.level.toUpperCase()}</b> &nbsp; ${esc(r.reasons)}</div><div class="sub-detail"><div class="sub-detail-grid"><span><small>Subscription</small><b>${esc(s.id)}</b></span><span><small>Contract value</small><b>${cash(s.amount*(s.plan.toLowerCase().includes('annual')?1:12))} / yr</b></span><span><small>Assigned to</small><b>${esc(s.owner)}</b></span></div></div><div class="settings-card"><h3>Recommended next step</h3><p>${esc(r.action)}</p></div><div class="form-grid">${field('Follow-up status','stage',s.caseStage||'working','select',{options:[{value:'new',label:'Needs review'},{value:'working',label:'In progress'},{value:'saved',label:'Renewed / saved'},{value:'closed',label:'Closed'}]})}${field('Follow-up note','note',s.caseNote||'','textarea',{full:true})}</div>`,v=>{s.caseStage=v.stage;s.caseNote=v.note;if(v.stage==='saved')s.status='Active';toast(v.stage==='saved'?'Renewal marked saved. Nice work.':'Follow-up updated.');return true;},'Update case');}
  function editSub(id){const s=sub(id);if(!s)return;modal(`Update ${s.id}`,`<div class="form-grid">${field('Plan','plan',s.plan)}${field('Amount (AED)','amount',s.amount,'number',{min:0,step:.01})}${field('Status','status',s.status,'select',{options:['Draft','Quotation','Confirmed','Active','Paused','Closed'].map(x=>({value:x,label:x}))})}${field('Quantity','quantity',s.quantity,'number',{min:1})}${field('Next invoice','nextInvoice',s.nextInvoice,'date')}${field('Expiry date','end',s.end,'date')}${field('Assigned to','owner',s.owner)}${field('Payment terms','paymentTerms',s.paymentTerms)}</div>`,v=>{Object.assign(s,v,{amount:Number(v.amount),quantity:Number(v.quantity)});toast(`${s.id} updated.`);return true;});}
  function showProfileMenu(){const old=document.getElementById('roleMenu');if(old){old.remove();return;}const b=document.getElementById('profileButton'),r=b.getBoundingClientRect(),menu=document.createElement('div');menu.id='roleMenu';menu.className='role-menu';menu.innerHTML=`<button data-role="admin">Amina Malik <small>Administrator · full workspace</small></button><button data-role="ops">Ravi Menon <small>Operations · manage accounts</small></button><button data-role="customer">Lena Ortiz <small>Customer portal · own records only</small></button>`;document.body.append(menu);menu.style.left=`${Math.max(10,r.left)}px`;menu.style.bottom=`${window.innerHeight-r.top+7}px`;menu.addEventListener('click',e=>{const b=e.target.closest('[data-role]');if(b){db.role=b.dataset.role;location.hash=db.role==='customer'?'#customers':db.role==='ops'?'#renewals':'#dashboard';persist();menu.remove();render();toast(`Switched to ${b.textContent.trim().split('\n')[0]}.`);}});}
  function exportCsv(){const rows=[['subscription','customer','plan','status','amount_aed','next_invoice','risk_score','risk_reason'],...db.subscriptions.map(s=>[s.id,person(s.customer).name,s.plan,s.status,s.amount,s.nextInvoice,risk(s).points,risk(s).reasons])];const csv=rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='loopguard-subscriptions.csv';a.click();URL.revokeObjectURL(a.href);toast('CSV report downloaded.');}

  document.addEventListener('click',e=>{
    const close=e.target.closest('[data-close]');if(close){document.getElementById('modalRoot').innerHTML='';return;}
    const nav=e.target.closest('[data-page]');if(nav)return;
    const role=e.target.closest('[data-role]');if(role)return;
    const act=e.target.closest('[data-action]');if(!act)return;const id=act.dataset.id;
    switch(act.dataset.action){
      case 'new-sub':newSub();break;case 'new-customer':newCustomer();break;case 'new-product':newProduct();break;case 'new-discount':newDiscount();break;
      case 'bill-due':billDue();break;case 'scan':render();toast('Risk scan complete · scores refreshed.');break;case 'export':exportCsv();break;
      case 'submenu':editSub(id);break;case 'rescue':rescueModal(id);break;case 'customer':customerModal(id);break;case 'pay-invoice':recordPayment(id);break;
      case 'new-payment':{const pending=db.invoices.find(i=>i.status!=='Paid');if(pending)recordPayment(pending.id);else toast('All invoices are settled.');break;}
      case 'edit-product':{const p=db.products.find(x=>x.id===id);if(p)modal(`Edit ${esc(p.name)}`,`<div class="form-grid">${field('Name','name',p.name)}${field('Price (AED)','price',p.price,'number',{min:0,step:.01})}${field('Billing cadence','billing',p.billing,'select',{options:['daily','weekly','monthly','yearly'].map(x=>({value:x,label:x}))})}${field('Variants','variants',p.variants)}${field('Notes','description',p.description,'textarea',{full:true})}</div>`,v=>{Object.assign(p,v,{price:Number(v.price)});toast('Product updated.');return true;});break;}
      case 'role-menu':showProfileMenu();break;case 'portal-help':toast('Your message is ready for the Brightloop team.');break;
      case 'reset':if(confirm('Reset the demo to its original sample data?')){localStorage.removeItem(KEY);db=structuredClone(seed);location.hash='#dashboard';render();toast('Demo data restored.');}break;
    }
  });
  document.addEventListener('input',e=>{if(e.target.id==='tableSearch'){query=e.target.value;const pos=e.target.selectionStart;render();const n=document.getElementById('tableSearch');if(n){n.focus();n.setSelectionRange(pos,pos);}}});
  document.addEventListener('change',e=>{if(e.target.id==='tableFilter'){filter=e.target.value;query='';render();}});
  document.getElementById('profileButton').addEventListener('click',showProfileMenu);
  document.getElementById('notificationButton').addEventListener('click',()=>toast('You’re all caught up. Three renewal cases are ready for follow-up.'));
  window.addEventListener('hashchange',()=>{query='';filter='all';render();});
  render();
})();
