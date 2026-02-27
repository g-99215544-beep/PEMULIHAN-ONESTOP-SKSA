// ============ DASHBOARD ============
function Dashboard({ murid, kehadiran, analisa, settings, setPage }) {
  const totalBM = murid.filter(m=>m.subjek.includes("BM")).length;
  const totalMT = murid.filter(m=>m.subjek.includes("MT")).length;
  const today = getTodayDay();
  const todaySlots = JADUAL_GURU[today] || [];
  const activeTodaySlots = todaySlots.filter(s=>s.cls!=="empty");

  // Kehadiran bulan ini
  const now = new Date();
  const bulanKey = `${BULAN_LIST[now.getMonth()]}_${now.getFullYear()}`;
  let totalH=0, totalAll=0;
  Object.values(kehadiran[bulanKey] || {}).forEach(kd => {
    Object.values(kd).forEach(rec => {
      Object.values(rec).forEach(v => {
        if(v==="H"||v==="T"||v==="MC") { totalAll++; if(v==="H") totalH++; }
      });
    });
  });
  const pctHadir = totalAll ? getPct(totalH, totalAll) : null;

  // Analisa stats
  let totalLulus=0, totalGagal=0;
  Object.values(analisa).forEach(a => {
    if(a.P1==="/"||a.P1==="✓") totalLulus++;
    else if(a.P1==="X"||a.P1==="✗") totalGagal++;
  });

  const kelasBM = {};
  KELAS_LIST.forEach(k => kelasBM[k] = murid.filter(m=>m.kelas===k&&m.subjek.includes("BM")).length);
  const kelasMT = {};
  KELAS_LIST.forEach(k => kelasMT[k] = murid.filter(m=>m.kelas===k&&m.subjek.includes("MT")).length);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Selamat Datang ke OneStop Pemulihan 👋</div>
          <div className="section-sub">{settings.nama} | Guru: {settings.guru} | Sesi {settings.sesi}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon blue">📖</div>
          <div><div className="stat-value">{totalBM}</div><div className="stat-label">Murid Bahasa Melayu</div></div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow">🔢</div>
          <div><div className="stat-value">{totalMT}</div><div className="stat-label">Murid Matematik</div></div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">✅</div>
          <div><div className="stat-value">{pctHadir !== null ? pctHadir+"%" : "-"}</div><div className="stat-label">Kehadiran Bulan Ini</div></div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red">📊</div>
          <div><div className="stat-value">{murid.length}</div><div className="stat-label">Jumlah Murid Pemulihan</div></div>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom:24}}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Agihan Murid Mengikut Kelas</div>
          </div>
          <div className="card-body">
            {KELAS_LIST.map(k=>(
              <div key={k} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontWeight:700,fontSize:13}}>Kelas {k}</span>
                  <span style={{fontSize:12,color:"var(--text-muted)"}}>BM: {kelasBM[k]} | MT: {kelasMT[k]}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width:`${(kelasBM[k]/totalBM)*100}%`,background:getClassTextColor(k)}} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">📅 Jadual Hari Ini — {today}</div>
          </div>
          <div className="card-body">
            {activeTodaySlots.length === 0 ? (
              <div className="text-muted text-center" style={{padding:"20px 0"}}>
                {today==="AHAD"||today==="SABTU" ? "Cuti hujung minggu 🏖️" : "Tiada sesi pemulihan hari ini"}
              </div>
            ) : (
              activeTodaySlots.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:700,color:"var(--primary)",minWidth:50}}>
                    {WAKTU_SLOTS[todaySlots.indexOf(s,todaySlots.findIndex((x,j)=>j>=0&&x===s&&todaySlots.indexOf(x)===todaySlots.findIndex((_,jj)=>jj>=0)))]}
                  </span>
                  <span className={`slot-${s.cls}`}>{s.label}</span>
                </div>
              ))
            )}
            {activeTodaySlots.length>0 && (
              <div style={{marginTop:8,padding:"8px 10px",background:"var(--primary-light)",borderRadius:8,fontSize:12,color:"var(--primary)",fontWeight:600}}>
                {activeTodaySlots.length} sesi pemulihan hari ini
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom:24}}>
        <div className="card-header"><div className="card-title">⚡ Pautan Pantas</div></div>
        <div className="card-body">
          <div className="quick-links">
            {[
              {id:"murid",icon:"👥",label:"Senarai Murid"},
              {id:"kehadiran",icon:"📋",label:"Rekod Kehadiran"},
              {id:"analisa",icon:"📊",label:"Analisa BAPM-PMK"},
              {id:"jadual",icon:"📅",label:"Jadual Waktu"},
              {id:"kemahiran",icon:"📚",label:"Kemahiran Pemulihan"},
              {id:"laporan",icon:"📄",label:"Laporan & Eksport"},
            ].map(q=>(
              <div key={q.id} className="quick-link" onClick={()=>setPage(q.id)}>
                <div className="ql-icon">{q.icon}</div>
                <div className="ql-label">{q.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">ℹ️ Maklumat Sekolah</div></div>
        <div className="card-body">
          <div className="form-grid-2">
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",marginBottom:3,textTransform:"uppercase"}}>Nama Sekolah</div><div style={{fontSize:13,fontWeight:600}}>{settings.nama}</div></div>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",marginBottom:3,textTransform:"uppercase"}}>Alamat</div><div style={{fontSize:13,fontWeight:600}}>{settings.alamat}</div></div>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",marginBottom:3,textTransform:"uppercase"}}>Telefon</div><div style={{fontSize:13,fontWeight:600}}>{settings.tel}</div></div>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",marginBottom:3,textTransform:"uppercase"}}>Guru Pemulihan</div><div style={{fontSize:13,fontWeight:600}}>{settings.guru}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
