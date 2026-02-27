// ============ JADUAL PAGE ============
function JadualPage() {
  const [view, setView] = useState("guru");
  const [selKelas, setSelKelas] = useState("2G");

  const days = ["ISNIN","SELASA","RABU","KHAMIS","JUMAAT"];

  function slotClass(cls) {
    const map = {
      "bm-2g":"slot-bm-2g","bm-3b":"slot-bm-3b","bm-4g":"slot-bm-4g","bm-5c":"slot-bm-5c",
      "mt-2g":"slot-mt-2g","mt-3b":"slot-mt-3b","mt-4g":"slot-mt-4g","mt-5c":"slot-mt-5c",
      "per":"slot-per","wp":"slot-wp","koko":"slot-koko","1m1s":"slot-1m1s","empty":"slot-empty"
    };
    return map[cls] || "slot-empty";
  }

  const JADUAL_KELAS = {
    "2G": {
      SELASA: [{i:7,label:"BM 2G"},{i:8,label:"BM 2G"},{i:9,label:"MT 2G"},{i:10,label:"MT 2G"}],
      KHAMIS: [{i:7,label:"BM 2G"},{i:8,label:"BM 2G"}],
      JUMAAT: [{i:0,label:"BM 2G"},{i:1,label:"BM 2G"}]
    },
    "3B": {
      ISNIN: [{i:7,label:"BM 3B"},{i:8,label:"BM 3B"}],
      RABU: [{i:6,label:"BM 3B"},{i:7,label:"BM 3B"}],
      KHAMIS: [{i:5,label:"BM 3B"},{i:6,label:"BM 3B"}],
      JUMAAT: [{i:5,label:"MT 3B"},{i:6,label:"MT 3B"}]
    },
    "4G": {
      ISNIN: [{i:1,label:"BM 4G"},{i:2,label:"BM 4G"}],
      SELASA: [{i:4,label:"MT 4G"},{i:5,label:"MT 4G"}],
      RABU: [{i:9,label:"BM 4G"},{i:10,label:"BM 4G"}],
      KHAMIS: [{i:11,label:"BM 4G"}]
    },
    "5C": {
      ISNIN: [{i:4,label:"MT 5C"},{i:5,label:"MT 5C"}],
      SELASA: [{i:1,label:"BM 5C"},{i:2,label:"BM 5C"}],
      KHAMIS: [{i:1,label:"BM 5C"},{i:2,label:"BM 5C"}]
    }
  };

  function getKelasSlot(kelas, day, slotIdx) {
    const slots = JADUAL_KELAS[kelas]?.[day] || [];
    const s = slots.find(x=>x.i===slotIdx);
    if(!s) return null;
    const sub = s.label.startsWith("BM")?"bm":"mt";
    return {label:s.label, cls:`${sub}-${kelas.toLowerCase()}`};
  }

  const analisis = [
    {subjek:"BM",kelas:"2G",waktu:6,minit:180},{subjek:"BM",kelas:"3B",waktu:6,minit:180},
    {subjek:"BM",kelas:"4G",waktu:5,minit:150},{subjek:"BM",kelas:"5C",waktu:5,minit:150},
    {subjek:"MT",kelas:"2G",waktu:2,minit:60},{subjek:"MT",kelas:"3B",waktu:2,minit:60},
    {subjek:"MT",kelas:"4G",waktu:2,minit:60},{subjek:"MT",kelas:"5C",waktu:2,minit:60},
    {subjek:"Persediaan Mengajar",kelas:"-",waktu:4,minit:120}
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">📅 Jadual Waktu Pemulihan</div>
          <div className="section-sub">Jadual guru & per kelas</div>
        </div>
        <button className="btn btn-outline" onClick={()=>window.print()}>🖨️ Cetak</button>
      </div>

      <div className="tabs">
        <div className={`tab ${view==="guru"?"active":""}`} onClick={()=>setView("guru")}>👨‍🏫 Jadual Guru</div>
        <div className={`tab ${view==="kelas"?"active":""}`} onClick={()=>setView("kelas")}>📚 Jadual Per Kelas</div>
        <div className={`tab ${view==="analisis"?"active":""}`} onClick={()=>setView("analisis")}>📊 Analisis Waktu</div>
      </div>

      {view==="guru" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Jadual Waktu Guru — Asqalani Bin Suhaimi</div>
          </div>
          <div className="jadual-grid">
            <table>
              <thead>
                <tr>
                  <th>WAKTU</th>
                  {days.map(d=><th key={d}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {WAKTU_SLOTS.map((w,i)=>(
                  <tr key={i}>
                    <td style={{fontSize:11,color:"var(--text-muted)",fontWeight:600,whiteSpace:"nowrap",background:"var(--bg)"}}>{w}</td>
                    {days.map(d=>{
                      const slot = JADUAL_GURU[d][i];
                      return (
                        <td key={d}>
                          {slot && slot.cls!=="empty" ? (
                            <span className={slotClass(slot.cls)}>{slot.label}</span>
                          ) : <span className="slot-empty">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-body" style={{paddingTop:16}}>
            <div className="legend">
              {KELAS_LIST.map(k=>(
                <div key={k} style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <div className="legend-item"><div className="legend-dot" style={{background:getClassColor(k)}}></div><span style={{color:getClassTextColor(k)}}>BM {k}</span></div>
                </div>
              ))}
              <div className="legend-item"><div className="legend-dot" style={{background:"#dbeafe"}}></div><span>PER = Persediaan</span></div>
              <div className="legend-item"><div className="legend-dot" style={{background:"#fce7f3"}}></div><span>WP = Waktu Peribadi</span></div>
            </div>
          </div>
        </div>
      )}

      {view==="kelas" && (
        <div>
          <div style={{marginBottom:16}}>
            <div className="tabs">
              {KELAS_LIST.map(k=><div key={k} className={`tab ${selKelas===k?"active":""}`} onClick={()=>setSelKelas(k)}>Kelas {k}</div>)}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Jadual Waktu — Kelas {selKelas}</div></div>
            <div className="jadual-grid">
              <table>
                <thead>
                  <tr>
                    <th>WAKTU</th>
                    {days.map(d=><th key={d}>{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {WAKTU_SLOTS.map((w,i)=>(
                    <tr key={i}>
                      <td style={{fontSize:11,color:"var(--text-muted)",fontWeight:600,whiteSpace:"nowrap",background:"var(--bg)"}}>{w}</td>
                      {days.map(d=>{
                        const slot = getKelasSlot(selKelas, d, i);
                        return (
                          <td key={d}>
                            {slot ? <span className={slotClass(slot.cls)}>{slot.label}</span>
                              : <span className="slot-empty">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view==="analisis" && (
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Analisis Penggunaan Waktu (Per Minggu)</div></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Subjek</th><th>Kelas</th><th>Waktu/Minggu</th><th>Minit/Minggu</th></tr>
              </thead>
              <tbody>
                {analisis.map((a,i)=>(
                  <tr key={i} style={i===analisis.length-1?{background:"var(--primary-light)",fontWeight:700}:{}}>
                    <td><span className={`badge badge-${a.subjek==="BM"?"bm":a.subjek==="MT"?"math":"hadir"}`}>{a.subjek}</span></td>
                    <td>{a.kelas}</td>
                    <td style={{fontWeight:700}}>{a.waktu}</td>
                    <td style={{fontWeight:700}}>{a.minit} minit</td>
                  </tr>
                ))}
                <tr style={{background:"#0f2d6b",color:"white",fontWeight:800}}>
                  <td colSpan={2}>JUMLAH KESELURUHAN</td>
                  <td>34 waktu</td>
                  <td>1020 minit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
