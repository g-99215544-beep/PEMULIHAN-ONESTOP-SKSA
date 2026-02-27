// ============ KEHADIRAN PAGE ============
function KehadiranPage({ murid, kehadiran, setKehadiran, addToast }) {
  const now = new Date();
  const [selBulan, setSelBulan] = useState(now.getMonth());
  const [selTahun, setSelTahun] = useState(now.getFullYear());
  const [selKelas, setSelKelas] = useState("2G");
  const [selSubjek, setSelSubjek] = useState("BM");

  const bulanKey = `${BULAN_LIST[selBulan]}_${selTahun}`;
  const daysInMonth = getDaysInMonth(selBulan+1, selTahun);

  const muridFiltered = murid.filter(m=>m.kelas===selKelas&&m.subjek.includes(selSubjek));

  function getRek(muridId, hari) {
    return kehadiran?.[bulanKey]?.[selKelas]?.[selSubjek]?.[muridId]?.[hari] || "";
  }

  function setRek(muridId, hari, val) {
    const cycle = {"":"H","H":"T","T":"MC","MC":""};
    const newVal = val !== undefined ? val : cycle[getRek(muridId, hari)];
    setKehadiran(prev => {
      const n = JSON.parse(JSON.stringify(prev));
      if(!n[bulanKey]) n[bulanKey]={};
      if(!n[bulanKey][selKelas]) n[bulanKey][selKelas]={};
      if(!n[bulanKey][selKelas][selSubjek]) n[bulanKey][selKelas][selSubjek]={};
      if(!n[bulanKey][selKelas][selSubjek][muridId]) n[bulanKey][selKelas][selSubjek][muridId]={};
      n[bulanKey][selKelas][selSubjek][muridId][hari] = newVal;
      return n;
    });
  }

  function markAll(hari, status) {
    muridFiltered.forEach(m => setRek(m.id, hari, status));
    addToast(`Hari ${hari}: Semua ditandakan ${status}`);
  }

  function getMuridStats(muridId) {
    const recs = kehadiran?.[bulanKey]?.[selKelas]?.[selSubjek]?.[muridId] || {};
    let H=0,T=0,MC=0;
    Object.values(recs).forEach(v=>{if(v==="H")H++;else if(v==="T")T++;else if(v==="MC")MC++;});
    const total=H+T+MC;
    return {H,T,MC,total,pct:total?getPct(H,total):0};
  }

  function getCellStyle(val) {
    if(val==="H") return "cell-H";
    if(val==="T") return "cell-T";
    if(val==="MC") return "cell-MC";
    return "cell-empty";
  }

  const days = Array.from({length:daysInMonth},(_,i)=>i+1);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">📋 Rekod Kehadiran</div>
          <div className="section-sub">Tandakan kehadiran murid harian</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button
            className="btn btn-primary btn-sm"
            onClick={()=>syncKehadiranFromSchool(murid, setKehadiran, addToast)}
            title="Tarik data kehadiran dari sistem sekolah"
          >
            🔄 Sync Sekolah
          </button>
          <button className="btn btn-outline" onClick={()=>window.print()}>🖨️ Cetak</button>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-body">
          <div className="filter-bar">
            <select value={selBulan} onChange={e=>setSelBulan(+e.target.value)}>
              {BULAN_LIST.map((b,i)=><option key={i} value={i}>{b}</option>)}
            </select>
            <select value={selTahun} onChange={e=>setSelTahun(+e.target.value)}>
              <option value={2026}>2026</option><option value={2025}>2025</option>
            </select>
            <select value={selKelas} onChange={e=>setSelKelas(e.target.value)}>
              {KELAS_LIST.map(k=><option key={k} value={k}>Kelas {k}</option>)}
            </select>
            <select value={selSubjek} onChange={e=>setSelSubjek(e.target.value)}>
              <option value="BM">Bahasa Melayu</option>
              <option value="MT">Matematik</option>
            </select>
          </div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{background:"#d1fae5"}}></div><span>H - Hadir</span></div>
            <div className="legend-item"><div className="legend-dot" style={{background:"#fee2e2"}}></div><span>T - Tidak Hadir</span></div>
            <div className="legend-item"><div className="legend-dot" style={{background:"#fef3c7"}}></div><span>MC - Surat Doktor</span></div>
            <div style={{fontSize:12,color:"var(--text-muted)"}}>* Klik sel untuk tukar status</div>
          </div>
        </div>
      </div>

      {muridFiltered.length === 0 ? (
        <div className="card"><div className="card-body text-muted text-center" style={{padding:"40px 0"}}>Tiada murid untuk kelas {selKelas} — {selSubjek}</div></div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Kelas {selKelas} | {selSubjek==="BM"?"Bahasa Melayu":"Matematik"} | {BULAN_LIST[selBulan]} {selTahun}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <button className="btn btn-success btn-sm" onClick={()=>{const d=prompt("Tandakan hari (1-31) semua Hadir:"); if(d)markAll(d,"H");}}>✅ Hadir (hari)</button>
              <button className="btn btn-danger btn-sm" onClick={()=>{const d=prompt("Tandakan hari (1-31) semua Tidak Hadir:"); if(d)markAll(d,"T");}}>❌ Tidak Hadir</button>
            </div>
          </div>
          <div className="kehadiran-grid">
            <table>
              <thead>
                <tr>
                  <th>Nama Murid</th>
                  {days.map(d=><th key={d} style={{minWidth:26}}>{d}</th>)}
                  <th>H</th><th>T</th><th>MC</th><th>%</th>
                </tr>
              </thead>
              <tbody>
                {muridFiltered.map((m,i)=>{
                  const stats = getMuridStats(m.id);
                  return (
                    <tr key={m.id}>
                      <td style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{i+1}. {m.nama.split(" ").slice(0,2).join(" ")}</td>
                      {days.map(d=>{
                        const val = getRek(m.id, d.toString());
                        return (
                          <td key={d} className={getCellStyle(val)} onClick={()=>setRek(m.id,d.toString())} title="Klik untuk tukar">
                            {val||"·"}
                          </td>
                        );
                      })}
                      <td style={{fontWeight:700,color:"var(--success)"}}>{stats.H}</td>
                      <td style={{fontWeight:700,color:"var(--danger)"}}>{stats.T}</td>
                      <td style={{fontWeight:700,color:"var(--warning)"}}>{stats.MC}</td>
                      <td className={pctClass(stats.pct)}>{stats.total?stats.pct+"%":"-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
