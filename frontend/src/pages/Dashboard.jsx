import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const G="#00cc7c",R="#f04848",O="#f0a020",B="#4488ef",P="#9966ef";
const BG="#07080d",SURF="#0c0e15",CARD="#111622",BORDER="#1c2540";
const TEXT="#e2e8f8",MUTED="#5d6e92",DIM="#2a3550";
const mono={fontFamily:"'JetBrains Mono',monospace"};

function useW(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  return w;
}

const KpiCard=({label,value,sub,accent,bg,half})=>(
  <div style={{background:bg||CARD,border:`1px solid ${accent?accent+"30":BORDER}`,borderRadius:12,padding:"14px 16px",flex:half?"0 0 calc(50% - 5px)":"1 1 0",minWidth:0,boxSizing:"border-box"}}>
    <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:MUTED,marginBottom:6}}>{label}</div>
    <div style={{fontSize:22,fontWeight:700,color:accent||TEXT,...mono,lineHeight:1.1,wordBreak:"break-all"}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:MUTED,marginTop:4,lineHeight:1.3}}>{sub}</div>}
  </div>
);

const Badge=({text,type="neutral"})=>{
  const s={success:{bg:G+"18",c:G,b:G+"30"},danger:{bg:R+"18",c:R,b:R+"30"},warning:{bg:O+"18",c:O,b:O+"30"},info:{bg:B+"18",c:B,b:B+"30"},neutral:{bg:DIM+"80",c:MUTED,b:BORDER}};
  const {bg,c,b}=s[type]||s.neutral;
  return <span style={{background:bg,color:c,border:`1px solid ${b}`,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:600,whiteSpace:"nowrap",display:"inline-block"}}>{text}</span>;
};

const TH=({children,right})=>(
  <th style={{padding:"9px 12px",textAlign:right?"right":"left",fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:MUTED,borderBottom:`1px solid ${BORDER}`,whiteSpace:"nowrap",background:SURF}}>{children}</th>
);
const TD=({children,right,m,color,bold})=>(
  <td style={{padding:"9px 12px",textAlign:right?"right":"left",fontSize:12,color:color||TEXT,fontWeight:bold?600:400,...(m?mono:{}),whiteSpace:"nowrap"}}>{children}</td>
);
const TableWrap=({children})=>(
  <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
    <table style={{width:"100%",borderCollapse:"collapse",minWidth:"max-content"}}>{children}</table>
  </div>
);
const GH=({label})=>(
  <div style={{background:G,padding:"9px 14px"}}>
    <span style={{fontSize:10,fontWeight:800,color:"#000",textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}</span>
  </div>
);
const CT=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,padding:"8px 12px",fontSize:11}}><div style={{color:MUTED,marginBottom:4}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color,...mono}}>{p.value}</div>)}</div>;
};

const trendData=[
  {d:"Lun",rev:340,netto:89},{d:"Mar",rev:520,netto:142},{d:"Mer",rev:410,netto:98},
  {d:"Gio",rev:680,netto:215},{d:"Ven",rev:750,netto:270},{d:"Sab",rev:590,netto:180},{d:"Dom",rev:430,netto:110},
];
const orders=[
  {id:"#2485mellow",date:"2026-03-23",total:"€34,85",canale:"COD",bundle:"—",fin:"pending",prov:"AP",track:"—"},
  {id:"#2484mellow",date:"2026-03-23",total:"€64,80",canale:"COD",bundle:"—",fin:"pending",prov:"MI",track:"—"},
  {id:"#2483mellow",date:"2026-03-23",total:"€47,90",canale:"COD",bundle:"Sì",fin:"pending",prov:"PU",track:"—"},
  {id:"#2482mellow",date:"2026-03-23",total:"€70,18",canale:"COD",bundle:"Sì",fin:"pending",prov:"RO",track:"Shipped"},
  {id:"#2481mellow",date:"2026-03-23",total:"€64,80",canale:"COD",bundle:"—",fin:"pending",prov:"TA",track:"Shipped"},
  {id:"#2480mellow",date:"2026-03-23",total:"€31,91",canale:"Carta",bundle:"—",fin:"paid",prov:"FI",track:"Shipped"},
  {id:"#2479mellow",date:"2026-03-22",total:"€31,91",canale:"Carta",bundle:"—",fin:"paid",prov:"SP",track:"Shipped"},
  {id:"#2478mellow",date:"2026-03-22",total:"€58,32",canale:"COD",bundle:"Sì",fin:"pending",prov:"TV",track:"Shipped"},
  {id:"#2477mellow",date:"2026-03-22",total:"€49,80",canale:"COD",bundle:"—",fin:"pending",prov:"RM",track:"—"},
  {id:"#2473mellow",date:"2026-03-21",total:"€64,80",canale:"COD",bundle:"—",fin:"pending",prov:"RM",track:"In transit"},
  {id:"#2472mellow",date:"2026-03-21",total:"€66,28",canale:"COD",bundle:"—",fin:"voided",prov:"TV",track:"—"},
  {id:"#2471mellow",date:"2026-03-21",total:"€47,90",canale:"Carta",bundle:"—",fin:"paid",prov:"RM",track:"Shipped"},
  {id:"#2470mellow",date:"2026-03-21",total:"€33,12",canale:"COD",bundle:"—",fin:"pending",prov:"RM",track:"In transit"},
];
const giacenze=[
  {tk:"61837296",ord:"2434mellow",cor:"GLS-ITA",tipo:"In giacenza",stato:"SPEDIZIONE IN GIACENZA PRESSO LA SEDE GLS...",sp:"2026-03-18",gg:4,costo:"€4,00"},
  {tk:"61837297",ord:"2435mellow",cor:"GLS-ITA",tipo:"Tentativo fallito",stato:"SPEDIZIONE NON IN CONSEGNA...",sp:"2026-03-18",gg:4,costo:"€4,00"},
  {tk:"61838700",ord:"2440mellow",cor:"GLS-ITA",tipo:"In giacenza",stato:"SPEDIZIONE IN GIACENZA...",sp:"2026-03-18",gg:4,costo:"€4,00"},
  {tk:"61838701",ord:"2441mellow",cor:"GLS-ITA",tipo:"Eccezione",stato:"LA SPEDIZIONE E' STATA RIFIUTATA...",sp:"2026-03-18",gg:4,costo:"€4,00"},
  {tk:"61842698",ord:"2444mellow",cor:"GLS-ITA",tipo:"Tentativo fallito",stato:"DESTINATARIO ASSENTE...",sp:"2026-03-18",gg:4,costo:"€4,00"},
  {tk:"61850079",ord:"2452mellow",cor:"GLS-ITA",tipo:"Tentativo fallito",stato:"SPEDIZIONE NON IN CONSEGNA...",sp:"2026-03-19",gg:3,costo:"€3,50"},
  {tk:"10808000",ord:"2453mellow",cor:"BRT",tipo:"Tentativo fallito",stato:"DESTIN.ASSENTE:LASCIATO AVVISO",sp:"2026-03-19",gg:3,costo:"€3,50"},
  {tk:"61852295",ord:"2460mellow",cor:"GLS-ITA",tipo:"Tentativo fallito",stato:"DESTINATARIO ASSENTE...",sp:"2026-03-20",gg:2,costo:"—"},
];
const payouts=[
  {date:"2026-03-24",imp:"€663,40",st:"In transito"},{date:"2026-03-17",imp:"€44,94",st:"Pagato"},
  {date:"2026-03-16",imp:"€46,84",st:"Pagato"},{date:"2026-03-13",imp:"€102,95",st:"Pagato"},
  {date:"2026-03-12",imp:"€202,14",st:"Pagato"},{date:"2026-03-11",imp:"€115,55",st:"Pagato"},
  {date:"2026-03-10",imp:"€46,84",st:"Pagato"},{date:"2026-03-09",imp:"€93,68",st:"Pagato"},
  {date:"2026-03-06",imp:"€108,42",st:"Pagato"},{date:"2026-03-05",imp:"€311,42",st:"Pagato"},
];
const products=[
  {name:"Mellow® Dolori Articolari – Supergelée alla Vaniglia",costo:"€5,50"},
  {name:"Mellow® Capelli e Unghie Forti – Supergelée all'Uva Rossa",costo:"€5,50"},
  {name:"Mellow® Energia Profonda – Supergelée ai Frutti di Bosco",costo:"€5,50"},
  {name:"Mellow® Neuropatia – Supergelée ai Frutti di Bosco",costo:"€5,50"},
  {name:"Ebook - Come rinforzare le difese",costo:"€0,00"},
  {name:"Mellow® Lipo Fianchi – Supergelée agli Agrumi",costo:"€5,50"},
  {name:"Mellow® Sonno Profondo – Supergelée alle More",costo:"€5,50"},
  {name:"Mellow® Detox Fegato – Supergelée alla Mela Verde",costo:"€5,50"},
];

// ── TABS ──────────────────────────────────────────────────────────────────────
function OverviewTab({m}){
  const brands=[
    {name:"MELLOW",dot:G,ordini:47,revenue:"€2.300,57",netto:"€409,15",nettoP:"17.8%",roas:"1.82x",cpa:"€31,54",aov:"€48,95",cod:"72%",reso:"0%"},
    {name:"NAIRE",dot:B,ordini:12,revenue:"€540,20",netto:"-€43,10",nettoP:"-7.9%",roas:"1.84x",cpa:"€42,10",aov:"€45,02",cod:"83%",reso:"0%"},
  ];
  return(<div>
    <p style={{fontSize:12,color:MUTED,marginBottom:14}}>Tutti i Brand — 17/03/2026 → 24/03/2026</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16}}>
      <KpiCard label="Ordini Totali" value="59" half={m}/>
      <KpiCard label="Revenue Netta" value="€2.840,77" accent={B} bg={B+"12"} half={m}/>
      <KpiCard label="Netto" value="€366,05" accent={G} bg={G+"12"} half={m}/>
      <KpiCard label="Netto %" value="12.9%" accent={G} bg={G+"12"} half={m}/>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"14px 16px",marginBottom:14}}>
      <div style={{fontSize:9,fontWeight:700,color:MUTED,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.1em"}}>Revenue vs Netto — 7 giorni</div>
      <ResponsiveContainer width="100%" height={m?100:130}>
        <BarChart data={trendData} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false}/>
          <XAxis dataKey="d" tick={{fill:MUTED,fontSize:9}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fill:MUTED,fontSize:9}} axisLine={false} tickLine={false} width={28}/>
          <Tooltip content={<CT/>}/>
          <Bar dataKey="rev" fill={B+"55"} radius={[3,3,0,0]} name="Revenue"/>
          <Bar dataKey="netto" fill={G} radius={[3,3,0,0]} name="Netto"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
    {m?(
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {brands.map((b,i)=>(
          <div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:b.dot,flexShrink:0}}/>
                <span style={{fontWeight:700,color:TEXT,fontSize:14}}>{b.name}</span>
              </div>
              <button style={{background:G,color:"#000",border:"none",borderRadius:6,padding:"5px 12px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Dettaglio →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 16px"}}>
              {[["Ordini",b.ordini,null],["Revenue",b.revenue,null],["Netto",b.netto,b.netto.startsWith("-")?R:G],["Netto%",b.nettoP,b.nettoP.startsWith("-")?R:G],["ROAS",b.roas,G],["CPA",b.cpa,null],["AOV",b.aov,null],["COD%",b.cod,null]].map(([l,v,c])=>(
                <div key={l}><div style={{fontSize:9,color:MUTED,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>{l}</div><div style={{fontSize:13,fontWeight:600,color:c||TEXT,...mono}}>{v}</div></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ):(
      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
        <TableWrap>
          <thead><tr style={{background:SURF}}><TH>Brand</TH><TH right>Ordini</TH><TH right>Revenue</TH><TH right>Netto</TH><TH right>Netto%</TH><TH right>ROAS</TH><TH right>CPA</TH><TH right>AOV</TH><TH right>COD%</TH><TH right>Reso%</TH><TH>Giac.</TH><TH>Stock</TH><TH></TH></tr></thead>
          <tbody>
            {brands.map((b,i)=>(
              <tr key={i} style={{borderTop:`1px solid ${BORDER}`,background:i%2?"rgba(255,255,255,0.01)":"transparent"}}>
                <td style={{padding:"10px 12px"}}><span style={{display:"flex",alignItems:"center",gap:7}}><span style={{width:7,height:7,borderRadius:"50%",background:b.dot}}/><span style={{fontSize:12,fontWeight:700,color:TEXT}}>{b.name}</span></span></td>
                <TD right m bold>{b.ordini}</TD><TD right m>{b.revenue}</TD>
                <TD right m bold color={b.netto.startsWith("-")?R:G}>{b.netto}</TD>
                <TD right m color={b.nettoP.startsWith("-")?R:G}>{b.nettoP}</TD>
                <TD right m color={G}>{b.roas}</TD><TD right m>{b.cpa}</TD><TD right m>{b.aov}</TD><TD right m>{b.cod}</TD><TD right m color={G}>{b.reso}</TD>
                <td style={{padding:"10px 12px"}}><Badge text="OK" type="success"/></td>
                <td style={{padding:"10px 12px"}}><Badge text="OK" type="success"/></td>
                <td style={{padding:"10px 12px"}}><button style={{background:G,color:"#000",border:"none",borderRadius:6,padding:"5px 12px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Dettaglio →</button></td>
              </tr>
            ))}
            <tr style={{borderTop:`2px solid ${BORDER}`,background:"rgba(255,255,255,0.02)"}}>
              <td style={{padding:"10px 12px",fontSize:12,fontWeight:700,color:TEXT}}>TOTALE</td>
              <TD right m bold>59</TD><TD right m bold>€2.840,77</TD>
              <TD right m bold color={G}>€366,05</TD><TD right m color={G}>12.9%</TD>
              <td/><td/><td/><td/><td/><td/><td/><td/>
            </tr>
          </tbody>
        </TableWrap>
      </div>
    )}
    <div style={{textAlign:"right",fontSize:10,color:DIM,marginTop:8}}>Giacenze = spedizioni in eccezione · Stock = SKU esauriti</div>
  </div>);
}

function PLTab({m}){
  const [feePct,setFeePct]=useState(10);
  const [feeHistory,setFeeHistory]=useState([
    {pct:10,valid_from:"2025-01-01",note:"Fee iniziale",set_by:"admin@3mllogistics.io"},
  ]);
  const [showFeeEditor,setShowFeeEditor]=useState(false);
  const [newPct,setNewPct]=useState("");
  const [newNote,setNewNote]=useState("");
  const [saving,setSaving]=useState(false);

  const metaSpend=1147.60;
  const agencyFee=+(metaSpend*(feePct/100)).toFixed(2);
  const grossMargin=1671.51;
  const netto=+(grossMargin-metaSpend-agencyFee).toFixed(2);
  const nettoFmt=netto>=0?`€${netto.toFixed(2).replace(".",",")`:`-€${Math.abs(netto).toFixed(2).replace(".",",")}`;

  const rows=[
    {l:"Vendite lorde (Gross)",v:"€2.560,40",p:"107.2%",t:0},{l:"- Sconti",v:"-€172,30",p:"-7.2%",t:0,c:R},
    {l:"Revenue lorda",v:"€2.388,10",p:"100.0%",t:1},{l:"- Returns (rimborsi)",v:"-€87,50",p:"-3.7%",t:0,c:R},
    {l:"Net Sales (= Shopify)",v:"€2.300,57",p:"100.0%",t:1},{l:"Revenue effettiva",v:"€2.300,57",p:"100.0%",t:0},
    {l:"- Prodotto",v:"-€253,06",p:"-11.0%",t:0,c:R},{l:"- Spedizioni",v:"-€376,00",p:"-16.3%",t:0,c:R},
    {l:"- Rientri resi",v:"-€0,00",p:"0.0%",t:0},{l:"- Prodotto perso",v:"-€0,00",p:"0.0%",t:0},
    {l:"Margine lordo",v:"€1.671,51",p:"72.7%",t:2,c:G},
    {l:`- Spesa ads Meta`,v:"-€1.147,60",p:"-49.9%",t:0,c:R},
    {l:`- Fee agenzia (${feePct}%)`,v:`-€${agencyFee.toFixed(2).replace(".",",")}`,p:`-${(feePct*1147.60/2300.57).toFixed(1)}%`,t:0,c:R},
    {l:"Netto (prima spese)",v:nettoFmt,p:`${(netto/2300.57*100).toFixed(1)}%`,t:2,c:netto>=0?G:R},
  ];

  async function saveFee(){
    const p=parseFloat(newPct);
    if(isNaN(p)||p<0||p>100)return;
    setSaving(true);
    try{
      const token=localStorage.getItem("3ml_token");
      const brand=localStorage.getItem("3ml_brand")||"MELLOW";
      const res=await fetch(`${process.env.REACT_APP_API_URL||"http://localhost:4000/api"}/fees/${brand}`,{
        method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
        body:JSON.stringify({pct:p,note:newNote}),
      });
      if(res.ok){
        const data=await res.json();
        setFeePct(p);
        setFeeHistory(data.history);
        setShowFeeEditor(false);
        setNewPct("");setNewNote("");
      }
    }catch(e){console.error(e);}
    finally{setSaving(false);}
  }

  const iS={background:BG,color:TEXT,border:`1px solid ${BORDER}`,borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"'Plus Jakarta Sans',sans-serif",width:"100%",boxSizing:"border-box"};

  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div style={{background:`linear-gradient(135deg,#4a22b8,#7c44ef)`,borderRadius:14,padding:"18px 20px",border:`1px solid ${P}50`}}>
      <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.14em",color:"rgba(255,255,255,0.45)",marginBottom:8}}>Netto Finale</div>
      <div style={{fontSize:m?28:36,fontWeight:900,color:"#fff",...mono}}>{nettoFmt}</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:4}}>{(netto/2300.57*100).toFixed(1)}% sulla revenue · 47 ordini · 72.3% COD</div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {[{l:"Margine lordo",v:"€1.671,51",s:"72.7%",c:G},{l:"Costo ads totale",v:`€${(metaSpend+agencyFee).toFixed(2).replace(".",",")}`,s:"Meta + Fee",c:R},{l:"ROAS",v:"1.82x",s:"return on ad spend",c:G},{l:"Budget disponibile",v:"€0,00",s:"75% del margine",c:MUTED}].map((x,i)=>(
        <div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"12px 14px",flex:m?"0 0 calc(50% - 4px)":"1 1 0",minWidth:0}}>
          <div style={{fontSize:9,color:MUTED,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{x.l}</div>
          <div style={{fontSize:m?16:18,fontWeight:700,color:x.c,...mono}}>{x.v}</div>
          <div style={{fontSize:10,color:DIM,marginTop:2}}>{x.s}</div>
        </div>
      ))}
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
      <div style={{background:P,padding:"10px 16px"}}><span style={{fontSize:11,fontWeight:700,color:"#fff"}}>Conto Economico</span></div>
      <TableWrap>
        <thead><tr style={{background:SURF}}><TH>Voce</TH><TH right>Importo</TH><TH right>% Rev</TH></tr></thead>
        <tbody>{rows.map((r,i)=>(
          <tr key={i} style={{borderTop:`1px solid ${BORDER}`,background:r.t===2?"rgba(255,255,255,0.04)":r.t===1?"rgba(255,255,255,0.015)":"transparent"}}>
            <td style={{padding:"9px 16px",fontSize:13,color:r.c||TEXT,fontWeight:r.t===2?700:r.t===1?600:400}}>{r.l}</td>
            <td style={{padding:"9px 16px",textAlign:"right",fontSize:13,color:r.c||TEXT,fontWeight:r.t>0?700:400,...mono}}>{r.v}</td>
            <td style={{padding:"9px 16px",textAlign:"right",fontSize:11,color:MUTED,...mono}}>{r.p}</td>
          </tr>
        ))}</tbody>
      </TableWrap>
    </div>
    {/* Fee agenzia card */}
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Fee agenzia ads</div>
          <div style={{fontSize:22,fontWeight:800,color:TEXT,...mono}}>{feePct}% <span style={{fontSize:13,color:MUTED,fontWeight:400}}>= €{agencyFee.toFixed(2).replace(".",",")} su €1.147,60</span></div>
        </div>
        <button onClick={()=>setShowFeeEditor(v=>!v)} style={{background:showFeeEditor?"transparent":G,color:showFeeEditor?MUTED:"#000",border:`1px solid ${showFeeEditor?BORDER:G}`,borderRadius:8,padding:"8px 16px",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>
          {showFeeEditor?"Annulla":"+ Modifica fee"}
        </button>
      </div>
      {/* Editor nuova fee */}
      {showFeeEditor&&(
        <div style={{background:BG,border:`1px solid ${BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:TEXT,marginBottom:12}}>Imposta nuova percentuale</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
            <div style={{flex:"1 1 120px",minWidth:0}}>
              <div style={{fontSize:10,color:MUTED,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>% Fee (es. 12)</div>
              <input type="number" min="0" max="100" step="0.5" value={newPct} onChange={e=>setNewPct(e.target.value)} placeholder="es. 12" style={iS}/>
            </div>
            <div style={{flex:"2 1 200px",minWidth:0}}>
              <div style={{fontSize:10,color:MUTED,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Note (opzionale)</div>
              <input type="text" value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="es. Aggiornamento Q2 2026" style={iS}/>
            </div>
          </div>
          {newPct&&!isNaN(parseFloat(newPct))&&(
            <div style={{background:`${G}15`,border:`1px solid ${G}30`,borderRadius:8,padding:"8px 12px",fontSize:12,color:G,marginBottom:10}}>
              Con {newPct}% → fee = €{(1147.60*parseFloat(newPct)/100).toFixed(2).replace(".",",")} · Netto = €{(grossMargin-metaSpend-1147.60*parseFloat(newPct)/100).toFixed(2).replace(".",",")}
            </div>
          )}
          <button onClick={saveFee} disabled={saving||!newPct} style={{background:(!newPct||saving)?DIM:G,color:"#000",border:"none",borderRadius:8,padding:"9px 20px",fontSize:12,fontWeight:700,cursor:(!newPct||saving)?"not-allowed":"pointer"}}>
            {saving?"Salvataggio...":"Salva nuova fee →"}
          </button>
        </div>
      )}
      {/* Storico */}
      <div style={{fontSize:10,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Storico ({feeHistory.length})</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {[...feeHistory].reverse().map((f,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:i===0?`${G}10`:BG,border:`1px solid ${i===0?G+"30":BORDER}`,borderRadius:8,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:16,fontWeight:800,color:i===0?G:MUTED,...mono}}>{f.pct}%</span>
              {i===0&&<Badge text="attuale" type="success"/>}
              {f.note&&<span style={{fontSize:11,color:MUTED}}>{f.note}</span>}
            </div>
            <div style={{fontSize:10,color:DIM,...mono}}>{f.valid_from} · {f.set_by||"admin"}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{background:`${B}12`,border:`1px solid ${B}30`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:G,flexShrink:0}}/>
      <div><div style={{fontSize:12,fontWeight:700,color:B}}>Meta Ads — Connesso</div><div style={{fontSize:11,color:MUTED}}>Spesa aggiornata in tempo reale · Fee agenzia {feePct}%</div></div>
    </div>
  </div>);
}

function SpeseTab(){
  const [f,setF]=useState("Tutte");
  const cats=[{name:"Personali",sub:"Stipendi, compensi, prelievi",col:"#9966ef"},{name:"Ricorrenti",sub:"Abbonamenti, affitti, software",col:B},{name:"Una Tantum",sub:"Acquisti spot, attrezzatura",col:O}];
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
      <h2 style={{fontSize:17,fontWeight:700,color:G}}>Spese</h2>
      <button style={{background:G,color:"#000",border:"none",borderRadius:8,padding:"9px 16px",fontWeight:700,fontSize:12,cursor:"pointer",flexShrink:0}}>+ Aggiungi</button>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
      <KpiCard label="Totale periodo" value="€0,00" accent={R} bg={R+"12"} half/><KpiCard label="Netto dopo spese" value="€409,15" accent={G} bg={G+"12"} half/>
      <KpiCard label="Personali" value="€0,00" accent={P} bg={P+"12"} half/><KpiCard label="Ricorrenti" value="€0,00" accent={B} bg={B+"12"} half/>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
      {["Tutte","Personali","Ricorrenti","Una Tantum"].map(x=>(
        <button key={x} onClick={()=>setF(x)} style={{background:f===x?G:"transparent",color:f===x?"#000":MUTED,border:`1px solid ${f===x?G:BORDER}`,borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{x}</button>
      ))}
    </div>
    {cats.map((c,i)=>(
      <div key={i} style={{marginBottom:10}}>
        <div style={{background:c.col,borderRadius:"10px 10px 0 0",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><span style={{fontWeight:700,color:"#fff",fontSize:12}}>{c.name}</span><span style={{color:"rgba(255,255,255,0.55)",fontSize:11,marginLeft:8}}>{c.sub}</span></div>
          <span style={{background:"rgba(255,255,255,0.2)",color:"#fff",borderRadius:12,padding:"2px 9px",fontSize:10,fontWeight:700}}>0 voci</span>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderTop:"none",borderRadius:"0 0 10px 10px",padding:"18px",textAlign:"center",color:DIM,fontSize:12}}>Nessuna spesa — clicca "+ Aggiungi" per inserirne una</div>
      </div>
    ))}
  </div>);
}

function FunnelCODTab(){
  const steps=[{l:"Ordini COD totali",v:34,p:100,c:B},{l:"Confermati",v:34,p:100,c:G},{l:"Voided",v:3,p:8.8,c:R},{l:"In attesa conferma",v:0,p:0,c:O},{l:"Spediti (su confermati)",v:29,p:85.3,c:G},{l:"Confermati non spediti",v:5,p:14.7,c:O}];
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <h2 style={{fontSize:17,fontWeight:700,color:G}}>Funnel Operativo COD</h2>
    <div style={{background:R+"12",border:`1px solid ${R}35`,borderRadius:12,padding:16}}>
      <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",color:R,marginBottom:8}}>Revenue Voided</div>
      <div style={{fontSize:28,fontWeight:900,color:R,...mono}}>€198,45</div>
      <div style={{fontSize:11,color:MUTED,marginTop:4}}>3 ordini non confermati · CPA bruciata €94,62</div>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:18}}>
      {steps.map((s,i)=>(
        <div key={i} style={{marginBottom:i<steps.length-1?18:0}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:s.c,fontWeight:600}}>{s.l}</span>
            <span style={{fontSize:12,...mono,color:TEXT}}>{s.v} <span style={{color:MUTED,fontSize:10}}>({s.p.toFixed(1)}%)</span></span>
          </div>
          <div style={{height:7,background:BORDER,borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${s.p}%`,background:s.c,borderRadius:4}}/>
          </div>
        </div>
      ))}
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:16}}>
      <div style={{fontSize:12,fontWeight:700,color:TEXT,marginBottom:12}}>Impatto totale voided</div>
      {[["Revenue persa","€198,45",R],["CPA bruciata","€94,62",R],["Totale","€293,07",R]].map(([l,v,c],i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:i>0?`1px solid ${BORDER}`:"none"}}>
          <span style={{fontSize:12,color:i===2?R:MUTED,fontWeight:i===2?700:400}}>{l}</span>
          <span style={{fontSize:12,color:c,...mono,fontWeight:i===2?700:400}}>{v}</span>
        </div>
      ))}
    </div>
  </div>);
}

function SpedizioniTab({m}){
  const rows=[{st:"Consegnati",n:8,p:"21.6%",r:"Incassato",rt:"success"},{st:"In transito",n:29,p:"78.4%",r:"In attesa",rt:"neutral"},{st:"In rientro",n:0,p:"0.0%",r:"A rischio",rt:"warning"},{st:"Tornati definitivamente",n:0,p:"0.0%",r:"Perso",rt:"danger"},{st:"TASSO MANCATA CONSEGNA",n:0,p:"0%",r:"€0,00 persi",rt:"danger"}];
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <h2 style={{fontSize:17,fontWeight:700,color:TEXT}}>Spedizioni & Resi</h2>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <KpiCard label="Revenue a rischio" value="€0,00" accent={O} bg={O+"12"} half/><KpiCard label="In transito" value="€1.415,20" accent={B} bg={B+"12"} half/>
      <KpiCard label="Resi persi" value="€0,00" accent={R} bg={R+"12"} half/><KpiCard label="Tasso resa" value="0%" accent={G} bg={G+"12"} half/>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
      <GH label="Stato spedizioni"/>
      <TableWrap>
        <thead><tr style={{background:SURF}}><TH>Status</TH><TH right>N.</TH><TH right>% Spediti</TH><TH>Rischio</TH></tr></thead>
        <tbody>{rows.map((r,i)=>(
          <tr key={i} style={{borderTop:`1px solid ${BORDER}`}}>
            <td style={{padding:"10px 12px",fontSize:12,color:r.rt==="danger"?R:r.rt==="warning"?O:TEXT,fontWeight:r.st.startsWith("TASSO")?700:400}}>{r.st}</td>
            <td style={{padding:"10px 12px",textAlign:"right",fontSize:13,fontWeight:700,...mono,color:TEXT}}>{r.n}</td>
            <td style={{padding:"10px 12px",textAlign:"right",fontSize:12,color:MUTED,...mono}}>{r.p}</td>
            <td style={{padding:"10px 12px"}}><Badge text={r.r} type={r.rt}/></td>
          </tr>
        ))}</tbody>
      </TableWrap>
    </div>
  </div>);
}

function GiacenzeTab(){
  return(<div>
    <h2 style={{fontSize:17,fontWeight:700,color:TEXT,marginBottom:14}}>Giacenze & Eccezioni</h2>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
      <KpiCard label="In eccezione" value="17" sub="su 37 (45.9%)" accent={R} bg={R+"12"} half/>
      <KpiCard label="Costo stimato" value="€34,00" accent={O} bg={O+"12"} half/>
      <KpiCard label="Giacenza media" value="2.5 gg" accent={O} bg={O+"12"} half/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
      {[["In giacenza",2,"€8,00",O],["Tentativo fallito",8,"€18,50",R],["Eccezione",7,"€7,50","#ff6635"]].map(([l,n,c,col])=>(
        <div key={l} style={{background:CARD,borderLeft:`3px solid ${col}`,border:`1px solid ${BORDER}`,borderLeftColor:col,borderRadius:"0 10px 10px 0",padding:"10px 14px",flexShrink:0,minWidth:120}}>
          <div style={{fontSize:10,color:col,fontWeight:700,marginBottom:2}}>{l}</div>
          <div style={{fontSize:20,fontWeight:800,color:TEXT,...mono}}>{n}</div>
          <div style={{fontSize:10,color:MUTED}}>{c}</div>
        </div>
      ))}
    </div>
    <div style={{fontSize:12,color:MUTED,marginBottom:12}}>
      <span style={{color:TEXT,fontWeight:600}}>GLS-ITA</span>: 14 — <span style={{color:R}}>€30,50</span>
      <span style={{color:DIM,margin:"0 8px"}}>·</span>
      <span style={{color:TEXT,fontWeight:600}}>BRT</span>: 3 — <span style={{color:R}}>€3,50</span>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
      <GH label="Lista giacenze & eccezioni"/>
      <TableWrap>
        <thead><tr style={{background:SURF}}>{["Tracking","Ordine","Corriere","Tipo","Stato","Spedito","GG","Costo"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
        <tbody>{giacenze.map((g,i)=>(
          <tr key={i} style={{borderTop:`1px solid ${BORDER}`,background:i%2?"rgba(255,255,255,0.01)":"transparent"}}>
            <td style={{padding:"9px 12px",fontSize:10,color:MUTED,...mono}}>{g.tk}</td>
            <td style={{padding:"9px 12px",fontSize:12,color:B}}>{g.ord}</td>
            <td style={{padding:"9px 12px",fontSize:11,color:TEXT}}>{g.cor}</td>
            <td style={{padding:"9px 12px"}}><Badge text={g.tipo} type={g.tipo==="In giacenza"?"warning":"danger"}/></td>
            <td style={{padding:"9px 12px",fontSize:10,color:MUTED,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.stato}</td>
            <td style={{padding:"9px 12px",fontSize:11,...mono,color:MUTED}}>{g.sp}</td>
            <td style={{padding:"9px 12px",textAlign:"center",fontSize:12,fontWeight:700,color:g.gg>=3?R:O,...mono}}>{g.gg}</td>
            <td style={{padding:"9px 12px",fontSize:12,...mono,color:TEXT}}>{g.costo}</td>
          </tr>
        ))}
        <tr style={{borderTop:`2px solid ${R}30`,background:R+"08"}}>
          <td colSpan={6} style={{padding:"10px 12px",fontSize:12,fontWeight:700,color:R}}>TOTALE COSTO GIACENZE</td>
          <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700,color:R,...mono}}>17</td>
          <td style={{padding:"10px 12px",fontSize:13,fontWeight:700,color:R,...mono}}>€34,00</td>
        </tr></tbody>
      </TableWrap>
    </div>
    <div style={{fontSize:10,color:DIM,marginTop:8}}>2gg gratis, poi €3,50 apertura + €0,50/gg · COD €15-16 · Rientro €6,50</div>
  </div>);
}

function AOVBundleTab({m}){
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <h2 style={{fontSize:17,fontWeight:700,color:G}}>AOV & Bundle</h2>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <KpiCard label="AOV Lordo" value="€48,95" half/><KpiCard label="AOV con Bundle" value="€57,42" accent={G} bg={G+"12"} half/>
      <KpiCard label="AOV senza Bundle" value="€44,98" accent={O} bg={O+"12"} half/><KpiCard label="Delta Bundle" value="+€12,45" accent={G} bg={G+"12"} half/>
    </div>
    <div style={{background:G+"12",border:`1px solid ${G}30`,borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:9,color:MUTED,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Bundle attivi nel periodo</div><div style={{fontSize:11,color:MUTED}}>15 / 47 ordini</div></div>
      <div style={{fontSize:28,fontWeight:800,color:G,...mono}}>31.9%</div>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:16}}>
      <div style={{fontSize:9,fontWeight:700,color:G,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Distribuzione Patch per Ordine</div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:12,color:TEXT}}>0 patch — Solo altri prodotti</span><span style={{fontSize:12,color:MUTED,...mono}}>47 (100%)</span>
      </div>
      <div style={{height:10,background:BORDER,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:"100%",background:B+"70"}}/></div>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:16}}>
      <div style={{fontSize:11,fontWeight:700,color:TEXT,marginBottom:12}}>Revenue Trend 7 giorni</div>
      <ResponsiveContainer width="100%" height={m?110:150}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false}/>
          <XAxis dataKey="d" tick={{fill:MUTED,fontSize:9}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fill:MUTED,fontSize:9}} axisLine={false} tickLine={false} width={28}/>
          <Tooltip content={<CT/>}/>
          <Line type="monotone" dataKey="rev" stroke={G} strokeWidth={2} dot={false} name="Revenue"/>
          <Line type="monotone" dataKey="netto" stroke={B} strokeWidth={2} dot={false} name="Netto"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>);
}

function ClientiTab({m}){
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <h2 style={{fontSize:17,fontWeight:700,color:TEXT}}>Clienti</h2>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <KpiCard label="Clienti nel periodo" value="3.553" half/><KpiCard label="Clienti di ritorno" value="3.3%" sub="119 su 3553" accent={G} bg={G+"12"} half/>
      <KpiCard label="LTV Medio" value="€47,70" accent={B} bg={B+"12"} half/><KpiCard label="AOV Nuovi" value="€48,95" sub="47 ordini" accent={O} bg={O+"12"} half/>
    </div>
    <div style={{background:G,borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.14em",color:"rgba(0,0,0,0.5)",marginBottom:4}}>Repeat Rate</div><div style={{fontSize:11,color:"rgba(0,0,0,0.5)"}}>Basso — focus su retention</div></div>
      <div style={{fontSize:34,fontWeight:900,color:"#000",...mono}}>3.3%</div>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:18}}>
      <div style={{fontWeight:700,color:TEXT,fontSize:13,marginBottom:14}}>Nuovi vs Ritorno</div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{color:O,fontSize:11,fontWeight:700}}>Nuovi 100%</span><span style={{color:G,fontSize:11,fontWeight:700}}>Ritorno 0%</span>
      </div>
      <div style={{height:10,background:BORDER,borderRadius:5,overflow:"hidden",marginBottom:16}}><div style={{height:"100%",width:"100%",background:O}}/></div>
      {[{l:"Ordini nuovi clienti",n:47,r:"€2.300,57",a:"€48,95",c:O},{l:"Ordini clienti ritorno",n:0,r:"€0,00",a:"€0,00",c:G}].map((x,i)=>(
        <div key={i} style={{background:`${x.c}10`,border:`1px solid ${x.c}20`,borderRadius:8,padding:"12px 14px",marginBottom:8}}>
          <div style={{fontSize:11,color:x.c,fontWeight:700,marginBottom:8}}>{x.l}</div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {[["Ordini",x.n],["Revenue",x.r],["AOV",x.a]].map(([k,v])=>(
              <div key={k}><div style={{fontSize:9,color:MUTED,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{k}</div><div style={{fontSize:13,fontWeight:700,color:TEXT,...mono}}>{v}</div></div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:16}}>
      <div style={{fontSize:12,fontWeight:700,color:G,marginBottom:12}}>Delta AOV</div>
      {[["AOV nuovi clienti","€48,95",O],["AOV clienti ritorno","€0,00",G],["Differenza","-€48,95",R]].map(([l,v,c],i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:i>0?`1px solid ${BORDER}`:"none"}}>
          <span style={{fontSize:12,color:i===2?R:MUTED,fontWeight:i===2?700:400}}>{l}</span>
          <span style={{fontSize:12,color:c,...mono,fontWeight:i===2?700:400}}>{v}</span>
        </div>
      ))}
    </div>
  </div>);
}

function ScontiTab({m}){
  const codici=[["#1","AUTOMATIC DISCOUNTS",16],["#2","AUTO + CUSTOM",2],["#3","SERGIO10",1],["#4","MELLOW5",1],["#5","CUSTOM DISCOUNT",1]];
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <h2 style={{fontSize:17,fontWeight:700,color:TEXT}}>Sconti & Coupon</h2>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <KpiCard label="Ordini con sconto" value="83%" sub="39 ordini" accent={R} bg={R+"12"} half/><KpiCard label="Sconto totale" value="€2.049,21" accent={R} bg={R+"12"} half/>
      <KpiCard label="Sconto medio" value="€43,60" accent={O} bg={O+"12"} half/><KpiCard label="AOV con sconto" value="€51,52" sub="vs €36,39 senza" accent={G} bg={G+"12"} half/>
    </div>
    <div style={{background:G+"12",border:`1px solid ${G}30`,borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:11,fontWeight:700,color:G}}>Delta AOV — sconti non penalizzano</div><div style={{fontSize:11,color:MUTED,marginTop:2}}>I coupon aumentano l'AOV medio</div></div>
      <div style={{fontSize:24,fontWeight:800,color:G,...mono}}>+€15,13</div>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:18}}>
      <div style={{fontSize:12,fontWeight:700,color:TEXT,marginBottom:14}}>Impatto sconti sull'AOV</div>
      {[["Ordini SENZA sconto","8 ordini","€36,39",G],["Ordini CON sconto","39 ordini","€51,52",R]].map(([l,s,v,c],i)=>(
        <div key={i} style={{background:`${c}10`,border:`1px solid ${c}20`,borderRadius:8,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:12,color:c,fontWeight:700}}>{l}</div><div style={{fontSize:10,color:MUTED,marginTop:2}}>{s}</div></div>
          <div style={{fontSize:20,fontWeight:800,color:c,...mono}}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
      <GH label="Codici più usati nel periodo"/>
      <TableWrap>
        <thead><tr style={{background:SURF}}><TH>#</TH><TH>Codice</TH><TH right>Utilizzi</TH></tr></thead>
        <tbody>{codici.map(([r,c,u],i)=>(
          <tr key={i} style={{borderTop:`1px solid ${BORDER}`}}>
            <TD color={MUTED}>{r}</TD>
            <td style={{padding:"10px 12px",fontSize:11,color:G,...mono}}>{c}</td>
            <TD right m bold>{u}</TD>
          </tr>
        ))}</tbody>
      </TableWrap>
    </div>
  </div>);
}

function InventarioTab(){
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <h2 style={{fontSize:17,fontWeight:700,color:TEXT}}>Inventario & Stock</h2>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <KpiCard label="SKU Totali" value="15" half/><KpiCard label="Tracked" value="0" half/>
      <KpiCard label="Esauriti" value="15" accent={R} bg={R+"12"} half/><KpiCard label="Stock Basso" value="0" accent={O} half/>
    </div>
    <div style={{background:O+"15",border:`1px solid ${O}35`,borderRadius:8,padding:"10px 14px",fontSize:12,color:O}}>⚠ 15 varianti senza tracking inventario abilitato su Shopify</div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
      <GH label="Tutti i prodotti (per stock)"/>
      <TableWrap>
        <thead><tr style={{background:SURF}}><TH>Prodotto</TH><TH right>Disponibili</TH><TH>Track</TH></tr></thead>
        <tbody>{products.map((p,i)=>(
          <tr key={i} style={{borderTop:`1px solid ${BORDER}`,background:i%2?"rgba(255,255,255,0.01)":"transparent"}}>
            <td style={{padding:"9px 12px",fontSize:11,color:G,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</td>
            <td style={{padding:"9px 12px",textAlign:"right",fontSize:11,color:DIM}}>—</td>
            <td style={{padding:"9px 12px"}}><Badge text="No" type="danger"/></td>
          </tr>
        ))}</tbody>
      </TableWrap>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
      <GH label="Costo unitario per variante"/>
      <TableWrap>
        <thead><tr style={{background:SURF}}><TH>Prodotto</TH><TH right>Costo</TH><TH>Valido da</TH><TH>Azioni</TH></tr></thead>
        <tbody>{products.map((p,i)=>(
          <tr key={i} style={{borderTop:`1px solid ${BORDER}`}}>
            <td style={{padding:"9px 12px",fontSize:11,color:G,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</td>
            <td style={{padding:"9px 12px",textAlign:"right",fontSize:12,color:G,fontWeight:700,...mono}}>{p.costo}</td>
            <td style={{padding:"9px 12px",fontSize:10,color:MUTED,...mono}}>2025-03-01</td>
            <td style={{padding:"9px 12px"}}><button style={{background:"transparent",color:MUTED,border:`1px solid ${BORDER}`,borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer"}}>Modifica</button></td>
          </tr>
        ))}</tbody>
      </TableWrap>
    </div>
  </div>);
}

function CashFlowTab(){
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div><h2 style={{fontSize:17,fontWeight:700,color:B}}>Cash Flow</h2><p style={{fontSize:11,color:MUTED,marginTop:3}}>Bonifici Shopify Payments — separato dal COD logistica</p></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <KpiCard label="Totale ricevuto" value="€8.193,17" sub="54 bonifici" accent={G} bg={G+"12"} half/>
      <KpiCard label="In arrivo" value="€0,00" sub="programmati" accent={O} bg={O+"12"} half/>
      <KpiCard label="Bonifico medio" value="€151,73" half/>
    </div>
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
      <GH label="Ultimi payout"/>
      <TableWrap>
        <thead><tr style={{background:SURF}}><TH>Data</TH><TH right>Importo</TH><TH>Status</TH></tr></thead>
        <tbody>{payouts.map((p,i)=>(
          <tr key={i} style={{borderTop:`1px solid ${BORDER}`,background:i%2?"rgba(255,255,255,0.01)":"transparent"}}>
            <TD m>{p.date}</TD><TD right m bold>{p.imp}</TD>
            <td style={{padding:"9px 12px"}}><Badge text={p.st} type={p.st==="Pagato"?"success":"info"}/></td>
          </tr>
        ))}</tbody>
      </TableWrap>
    </div>
  </div>);
}

function LiquidazioneTab(){
  return(<div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:500}}>
    <div><h2 style={{fontSize:17,fontWeight:700,color:TEXT}}>Liquidazione Logistica</h2><p style={{fontSize:11,color:MUTED,marginTop:3}}>COD incassati meno costi di spedizione e rientro</p></div>
    {[["COD incassati (2 ordini consegnati)","+€99,65",G,G+"12"],["Spedizioni andata","-€19,00",R,R+"12"],["Rientro resi","-€0,00",R,R+"12"]].map(([l,v,c,bg])=>(
      <div key={l} style={{background:bg,border:`1px solid ${c}25`,borderRadius:10,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
        <span style={{fontSize:13,color:MUTED}}>{l}</span>
        <span style={{fontSize:18,fontWeight:700,color:c,...mono,flexShrink:0}}>{v}</span>
      </div>
    ))}
    <div style={{background:G,borderRadius:12,padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
      <span style={{fontSize:12,fontWeight:800,color:"#000",textTransform:"uppercase",letterSpacing:"0.09em"}}>Netto da ricevere</span>
      <span style={{fontSize:30,fontWeight:900,color:"#000",...mono}}>€80,65</span>
    </div>
  </div>);
}

function OrdiniTab({m}){
  const [q,setQ]=useState("");
  const [can,setCan]=useState("Tutti");
  const [fin,setFin]=useState("Tutti");
  const fC={paid:"success",pending:"warning",voided:"danger"};
  const tC={Shipped:"success","In transit":"info"};
  const filtered=orders.filter(o=>
    (o.id.toLowerCase().includes(q.toLowerCase())||o.prov.toLowerCase().includes(q.toLowerCase()))&&
    (can==="Tutti"||o.canale===can)&&(fin==="Tutti"||o.fin===fin)
  );
  const iS={background:CARD,color:TEXT,border:`1px solid ${BORDER}`,borderRadius:8,padding:"8px 12px",fontSize:12,outline:"none",fontFamily:"'Plus Jakarta Sans',sans-serif"};
  return(<div>
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca ordine o provincia..." style={{...iS,flex:"1 1 160px",minWidth:0}}/>
      <select value={can} onChange={e=>setCan(e.target.value)} style={{...iS,flex:"0 0 auto"}}>
        <option value="Tutti">Tutti i canali</option><option>COD</option><option>Carta</option>
      </select>
      <select value={fin} onChange={e=>setFin(e.target.value)} style={{...iS,flex:"0 0 auto"}}>
        <option value="Tutti">Tutti gli stati</option><option value="paid">paid</option><option value="pending">pending</option><option value="voided">voided</option>
      </select>
      <span style={{fontSize:11,color:MUTED,whiteSpace:"nowrap"}}>{filtered.length} ordini</span>
    </div>
    {m?(
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((o,i)=>(
          <div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:12,color:B,fontWeight:600,...mono}}>{o.id}</span>
              <Badge text={o.fin} type={fC[o.fin]||"neutral"}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px 0"}}>
              {[["Totale",o.total,TEXT],["Canale",o.canale,o.canale==="COD"?R:B],["Provincia",o.prov,TEXT],["Data",o.date.slice(5),MUTED],["Bundle",o.bundle,G],["Tracking",o.track==="—"?"—":o.track,o.track==="Shipped"?G:o.track==="In transit"?B:MUTED]].map(([l,v,c])=>(
                <div key={l}><div style={{fontSize:9,color:MUTED,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div><div style={{fontSize:11,fontWeight:600,color:c,...mono}}>{v}</div></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ):(
      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
        <TableWrap>
          <thead><tr style={{background:G}}>{["Ordine","Data","Totale","Canale","Bundle","Financial","Provincia","Tracking"].map(h=>(
            <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:9,fontWeight:800,letterSpacing:"0.1em",color:"#000",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
          ))}</tr></thead>
          <tbody>{filtered.map((o,i)=>(
            <tr key={i} style={{borderTop:`1px solid ${BORDER}`,background:i%2?"rgba(255,255,255,0.01)":"transparent"}}>
              <td style={{padding:"9px 12px",fontSize:11,color:B,...mono}}>{o.id}</td>
              <TD m color={MUTED}>{o.date}</TD>
              <td style={{padding:"9px 12px",fontSize:12,fontWeight:700,...mono,color:TEXT}}>{o.total}</td>
              <td style={{padding:"9px 12px"}}><Badge text={o.canale} type={o.canale==="COD"?"danger":"info"}/></td>
              <td style={{padding:"9px 12px",textAlign:"center"}}>{o.bundle==="Sì"?<Badge text="Sì" type="success"/>:<span style={{color:DIM}}>—</span>}</td>
              <td style={{padding:"9px 12px"}}><Badge text={o.fin} type={fC[o.fin]||"neutral"}/></td>
              <td style={{padding:"9px 12px",fontSize:12,fontWeight:600,color:TEXT}}>{o.prov}</td>
              <td style={{padding:"9px 12px"}}>{o.track==="—"?<span style={{color:DIM}}>—</span>:<Badge text={o.track} type={tC[o.track]||"success"}/>}</td>
            </tr>
          ))}</tbody>
        </TableWrap>
      </div>
    )}
  </div>);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
const TABS=[
  {id:"overview",label:"Overview",C:OverviewTab},{id:"pl",label:"P&L",C:PLTab},
  {id:"spese",label:"Spese",C:SpeseTab},{id:"funnel",label:"Funnel COD",C:FunnelCODTab},
  {id:"spedizioni",label:"Spedizioni",C:SpedizioniTab},{id:"giacenze",label:"Giacenze",C:GiacenzeTab},
  {id:"aov",label:"AOV & Bundle",C:AOVBundleTab},{id:"clienti",label:"Clienti",C:ClientiTab},
  {id:"sconti",label:"Sconti",C:ScontiTab},{id:"inventario",label:"Inventario",C:InventarioTab},
  {id:"cashflow",label:"Cash Flow",C:CashFlowTab},{id:"liquidazione",label:"Liquidazione",C:LiquidazioneTab},
  {id:"ordini",label:"Ordini",C:OrdiniTab},
];

export default function Dashboard(){
  const [tab,setTab]=useState("overview");
  const [brand,setBrand]=useState("MELLOW");
  const [preset,setPreset]=useState("7g");
  const [menu,setMenu]=useState(false);
  const w=useW();
  const m=w<680;
  const Active=TABS.find(t=>t.id===tab)?.C||OverviewTab;

  return(
    <div style={{background:BG,minHeight:"100vh",color:TEXT,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:${SURF}}
        ::-webkit-scrollbar-thumb{background:${BORDER};border-radius:2px}
        .tabnav::-webkit-scrollbar{display:none}
        input,select,button{font-family:'Plus Jakarta Sans',sans-serif;color:${TEXT}}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.4)}
        select option{background:${CARD};color:${TEXT}}
      `}</style>

      {/* TOP BAR */}
      <div style={{background:SURF,borderBottom:`1px solid ${BORDER}`,padding:"0 14px",height:52,display:"flex",alignItems:"center",gap:8,position:"sticky",top:0,zIndex:200}}>
        <div style={{flexShrink:0,marginRight:6}}>
          <img src="/logo.png" alt="3ML Logistics" style={{height:34,width:"auto",display:"block"}}/>
        </div>
        <div style={{display:"flex",gap:3}}>
          {["Tutti","NAIRE","MELLOW"].map(b=>(
            <button key={b} onClick={()=>setBrand(b)} style={{background:brand===b?(b==="MELLOW"?G:b==="NAIRE"?B:DIM):"transparent",color:brand===b?(b==="MELLOW"||b==="NAIRE"?"#000":TEXT):MUTED,border:`1px solid ${brand===b?(b==="MELLOW"?G:b==="NAIRE"?B:BORDER):"transparent"}`,borderRadius:6,padding:"4px 9px",fontSize:10,fontWeight:700,cursor:"pointer"}}>{b}</button>
          ))}
        </div>
        <div style={{flex:1}}/>
        {!m&&<>
          <div style={{display:"flex",gap:2}}>
            {["Oggi","7g","1m","2m","3m"].map(p=>(
              <button key={p} onClick={()=>setPreset(p)} style={{background:preset===p?B:"transparent",color:preset===p?"#fff":MUTED,border:`1px solid ${preset===p?B:"transparent"}`,borderRadius:5,padding:"3px 8px",fontSize:10,fontWeight:700,cursor:"pointer"}}>{p}</button>
            ))}
          </div>
          <input type="date" defaultValue="2026-03-17" style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:6,padding:"4px 8px",fontSize:10,outline:"none"}}/>
          <span style={{color:MUTED,fontSize:11}}>→</span>
          <input type="date" defaultValue="2026-03-24" style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:6,padding:"4px 8px",fontSize:10,outline:"none"}}/>
          <button style={{background:B,color:"#fff",border:"none",borderRadius:6,padding:"5px 12px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Applica</button>
        </>}
        {m&&<button onClick={()=>setMenu(v=>!v)} style={{background:"transparent",border:`1px solid ${BORDER}`,borderRadius:7,padding:"7px 10px",cursor:"pointer",color:TEXT,fontSize:15,lineHeight:1}}>{menu?"✕":"☰"}</button>}
        <div style={{background:P,borderRadius:6,padding:"4px 10px",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{brand==="MELLOW"?"Mellow":brand==="NAIRE"?"Naire":"Admin"}</div>
      </div>

      {/* MOBILE FILTER PANEL */}
      {m&&menu&&(
        <div style={{background:SURF,borderBottom:`1px solid ${BORDER}`,padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:4}}>
            {["Oggi","7g","1m","2m","3m"].map(p=>(
              <button key={p} onClick={()=>setPreset(p)} style={{background:preset===p?B:"transparent",color:preset===p?"#fff":MUTED,border:`1px solid ${preset===p?B:BORDER}`,borderRadius:6,padding:"7px 0",fontSize:11,fontWeight:700,cursor:"pointer",flex:1}}>{p}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <input type="date" defaultValue="2026-03-17" style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,padding:"7px 10px",fontSize:11,outline:"none",flex:1}}/>
            <span style={{color:MUTED}}>→</span>
            <input type="date" defaultValue="2026-03-24" style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,padding:"7px 10px",fontSize:11,outline:"none",flex:1}}/>
            <button onClick={()=>setMenu(false)} style={{background:B,color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>OK</button>
          </div>
        </div>
      )}

      {/* TAB NAV */}
      <div className="tabnav" style={{background:SURF,borderBottom:`1px solid ${BORDER}`,display:"flex",overflowX:"auto",scrollbarWidth:"none",position:"sticky",top:52,zIndex:100}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"transparent",color:tab===t.id?G:MUTED,border:"none",borderBottom:tab===t.id?`2px solid ${G}`:"2px solid transparent",padding:m?"12px 11px":"10px 14px",fontSize:m?10:11,fontWeight:tab===t.id?700:500,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"color 0.1s"}}>{t.label}</button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{padding:m?"14px":"24px",maxWidth:1440,margin:"0 auto"}}>
        <Active m={m}/>
      </div>
    </div>
  );
}
