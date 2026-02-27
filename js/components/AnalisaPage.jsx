// ============ ANALISA PAGE ============
function AnalisaPage({ murid, analisa, setAnalisa, addToast }) {
  const [selSubjek, setSelSubjek] = useState("BM");
  const [selKelas, setSelKelas] = useState("Semua");

  function getStatus(muridId, subjek, peringkat) {
    return analisa?.[`${muridId}_${subjek}`]?.[peringkat] || null;
  }

  function cycleStatus(muridId, subjek, peringkat) {
    const cur = getStatus(muridId, subjek, peringkat);
    const next = cur===null ? "X" : cur==="X" ? "/" : null;
    const key = `${muridId}_${subjek}`;
    setAnalisa(prev => {
      const n = {...prev};
      if(!n[key]) n[key]={};
      n[key][peringkat] = next;
      return n;
    });
    addToast(`Rekod dikemaskini: ${next===null?"Kosong":next==="/"?"Melepasi":"Tidak Melepasi"}`);
  }

  function renderStatus(muridId, subjek, peringkat) {
    const val = getStatus(muridId, subjek, peringkat);
    return (
      <td style={{textAlign:"center",cursor:"pointer"}} onClick={()=>cycleStatus(muridId,subjek,peringkat)} title="Klik untuk tukar">
        {val===null ? <span style={{color:"#cbd5e1",fontSize:16}}>—</span>
         : val==="/" ? <span style={{color:"var(--success)",fontSize:20,fontWeight:800}}>✓</span>
         : <span style={{color:"var(--danger)",fontSize:20,fontWeight:800}}>✗</span>}
      </td>
    );
  }

  const muridFiltered = murid.filter(m =>
    m.subjek.includes(selSubjek) &&
    (selKelas==="Semua" || m.kelas===selKelas)
  );

  // Summary per kelas
  const summary = KELAS_LIST.map(k=>{
    const km = murid.filter(m=>m.kelas===k&&m.subjek.includes(selSubjek));
    const p1L = km.filter(m=>getStatus(m.id,selSubjek,"P1")==="/").length;
    const p1G = km.filter(m=>getStatus(m.id,selSubjek,"P1")==="X").length;
    const p2L = km.filter(m=>getStatus(m.id,selSubjek,"P2")==="/").length;
    const p2G = km.filter(m=>getStatus(m.id,selSubjek,"P2")==="X").length;
    const p3L = km.filter(m=>getStatus(m.id,selSubjek,"P3")==="/").length;
    const p3G = km.filter(m=>getStatus(m.id,selSubjek,"P3")==="X").length;
    return {k, total:km.length, p1L, p1G, p2L, p2G, p3L, p3G};
  });

  const totals = summary.reduce((acc,s)=>({
    total:acc.total+s.total, p1L:acc.p1L+s.p1L, p1G:acc.p1G+s.p1G,
    p2L:acc.p2L+s.p2L, p2G:acc.p2G+s.p2G, p3L:acc.p3L+s.p3L, p3G:acc.p3G+s.p3G
  }), {total:0,p1L:0,p1G:0,p2L:0,p2G:0,p3L:0,p3G:0});

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">📊 Borang Analisa Pencapaian (BAPM-PMK)</div>
          <div className="section-sub">P1=Pengesanan | P2=Pelepasan 1 | P3=Pelepasan 2 | Klik sel untuk tukar status</div>
        </div>
        <button className="btn btn-outline" onClick={()=>window.print()}>🖨️ Cetak</button>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <div className="tabs">
          <div className={`tab ${selSubjek==="BM"?"active":""}`} onClick={()=>setSelSubjek("BM")}>📖 Bahasa Melayu</div>
          <div className={`tab ${selSubjek==="MT"?"active":""}`} onClick={()=>setSelSubjek("MT")}>🔢 Matematik</div>
        </div>
        <select value={selKelas} onChange={e=>setSelKelas(e.target.value)} style={{height:40,borderRadius:8,padding:"0 12px",border:"1.5px solid var(--border)",fontFamily:"inherit",fontSize:13}}>
          <option value="Semua">Semua Kelas</option>
          {KELAS_LIST.map(k=><option key={k} value={k}>Kelas {k}</option>)}
        </select>
      </div>

      <div className="info-box">
        ✓ = Melepasi / Lulus &nbsp;|&nbsp; ✗ = Tidak Melepasi / Gagal &nbsp;|&nbsp; — = Belum dinilai &nbsp;&nbsp; <strong>Klik sel untuk tukar status</strong>
      </div>

      <div className="card" style={{marginBottom:20}}>
        <div className="card-header"><div className="card-title">📋 Rumusan Analisa — {selSubjek==="BM"?"Bahasa Melayu":"Matematik"}</div></div>
        <div className="table-wrap">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Tahun/Kelas</th><th>Bil Murid</th>
                <th>P1 Lulus</th><th>P1 Gagal</th>
                <th>P2 Lulus</th><th>P2 Gagal</th>
                <th>P3 Lulus</th><th>P3 Gagal</th>
              </tr>
            </thead>
            <tbody>
              {summary.map(s=>(
                <tr key={s.k}>
                  <td style={{fontWeight:700}}><span className={`badge badge-${s.k.toLowerCase()}`}>Kelas {s.k}</span></td>
                  <td>{s.total}</td>
                  <td style={{color:"var(--success)",fontWeight:700}}>{s.p1L}</td><td style={{color:"var(--danger)",fontWeight:700}}>{s.p1G}</td>
                  <td style={{color:"var(--success)",fontWeight:700}}>{s.p2L}</td><td style={{color:"var(--danger)",fontWeight:700}}>{s.p2G}</td>
                  <td style={{color:"var(--success)",fontWeight:700}}>{s.p3L}</td><td style={{color:"var(--danger)",fontWeight:700}}>{s.p3G}</td>
                </tr>
              ))}
              <tr style={{background:"var(--primary-light)",fontWeight:800}}>
                <td>JUMLAH</td><td>{totals.total}</td>
                <td style={{color:"var(--success)"}}>{totals.p1L}</td><td style={{color:"var(--danger)"}}>{totals.p1G}</td>
                <td style={{color:"var(--success)"}}>{totals.p2L}</td><td style={{color:"var(--danger)"}}>{totals.p2G}</td>
                <td style={{color:"var(--success)"}}>{totals.p3L}</td><td style={{color:"var(--danger)"}}>{totals.p3G}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📝 Rekod Individu — {selSubjek==="BM"?"Bahasa Melayu":"Matematik"}</div></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bil</th><th>Nama Murid</th><th>Kelas</th><th>Jantina</th>
                <th style={{textAlign:"center"}}>P1</th>
                <th style={{textAlign:"center"}}>P2</th>
                <th style={{textAlign:"center"}}>P3</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {muridFiltered.map((m,i)=>{
                const p3 = getStatus(m.id,selSubjek,"P3");
                const p2 = getStatus(m.id,selSubjek,"P2");
                const statusLabel = p3==="/" ? <span className="badge badge-hadir">Tamat</span>
                  : p2==="/" ? <span className="badge" style={{background:"#dbeafe",color:"#1d4ed8"}}>P3</span>
                  : <span className="badge badge-tidak">Dalam Proses</span>;
                return (
                  <tr key={m.id}>
                    <td style={{color:"var(--text-muted)",fontSize:12}}>{i+1}</td>
                    <td style={{fontWeight:600,fontSize:13}}>{m.nama}</td>
                    <td><span className={`badge badge-${m.kelas.toLowerCase()}`}>{m.kelas}</span></td>
                    <td>{m.jantina==="L"?"L":"P"}</td>
                    {renderStatus(m.id,selSubjek,"P1")}
                    {renderStatus(m.id,selSubjek,"P2")}
                    {renderStatus(m.id,selSubjek,"P3")}
                    <td>{statusLabel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {muridFiltered.length===0 && <div className="text-muted text-center" style={{padding:"40px 0"}}>Tiada murid untuk paparan ini</div>}
      </div>
    </div>
  );
}
