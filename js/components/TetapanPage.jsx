// ============ TETAPAN PAGE ============
function TetapanPage({ settings, setSettings, murid, setMurid, kehadiran, setKehadiran, analisa, setAnalisa, addToast }) {
  const [form, setForm] = useState({...settings});
  const fileRef = React.useRef();

  function saveSettings() {
    setSettings(form);
    addToast("Tetapan berjaya disimpan");
  }

  function importJSON(e) {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if(data.murid) setMurid(data.murid);
        if(data.kehadiran) setKehadiran(data.kehadiran);
        if(data.analisa) setAnalisa(data.analisa);
        addToast("Data berjaya diimport");
      } catch { addToast("Fail tidak sah", "error"); }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if(confirm("⚠️ Ini akan MEMADAM semua data kehadiran dan analisa. Senarai murid akan dikembalikan ke asal. Teruskan?")) {
      setMurid(MURID_INITIAL);
      setKehadiran({});
      setAnalisa({});
      addToast("Data telah ditetapkan semula");
    }
  }

  function resetMurid() {
    if(confirm("Reset senarai murid ke data asal?")) {
      setMurid(MURID_INITIAL);
      addToast("Senarai murid telah direset");
    }
  }

  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">⚙️ Tetapan Aplikasi</div></div>
      </div>

      <div className="grid-2" style={{marginBottom:24}}>
        <div className="card">
          <div className="card-header"><div className="card-title">🏫 Maklumat Sekolah</div></div>
          <div className="card-body">
            <div className="form-group">
              <label>Nama Sekolah</label>
              <input value={form.nama} onChange={e=>setForm(f=>({...f,nama:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Alamat</label>
              <input value={form.alamat} onChange={e=>setForm(f=>({...f,alamat:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Telefon / Faks</label>
              <input value={form.tel} onChange={e=>setForm(f=>({...f,tel:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>E-mel</label>
              <input value={form.emel} onChange={e=>setForm(f=>({...f,emel:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Nama Guru Pemulihan</label>
              <input value={form.guru} onChange={e=>setForm(f=>({...f,guru:e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Sesi Akademik</label>
              <input value={form.sesi} onChange={e=>setForm(f=>({...f,sesi:e.target.value}))} />
            </div>
            <button className="btn btn-primary" onClick={saveSettings}>💾 Simpan Tetapan</button>
          </div>
        </div>

        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-header"><div className="card-title">🔄 Import & Eksport Data</div></div>
            <div className="card-body">
              <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:16}}>Import data dari fail JSON backup atau eksport semua data.</p>
              <input type="file" ref={fileRef} accept=".json" onChange={importJSON} style={{display:"none"}} />
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <button className="btn btn-outline" onClick={()=>fileRef.current.click()}>📂 Import dari JSON</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title" style={{color:"var(--danger)"}}>⚠️ Zon Berbahaya</div></div>
            <div className="card-body">
              <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:16}}>Tindakan berikut <strong>tidak boleh dibatalkan</strong>. Sila buat backup terlebih dahulu.</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <button className="btn btn-outline" onClick={resetMurid} style={{borderColor:"var(--warning)",color:"var(--warning)"}}>🔄 Reset Senarai Murid ke Asal</button>
                <button className="btn btn-danger" onClick={resetAll}>🗑️ Reset Semua Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">ℹ️ Maklumat Aplikasi</div></div>
        <div className="card-body">
          <div className="form-grid-3">
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",marginBottom:4}}>NAMA APLIKASI</div><div style={{fontSize:13,fontWeight:600}}>OneStop Pemulihan SKSA</div></div>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",marginBottom:4}}>VERSI</div><div style={{fontSize:13,fontWeight:600}}>1.0.0 (2026)</div></div>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",marginBottom:4}}>STORAN</div><div style={{fontSize:13,fontWeight:600}}>Firebase Realtime DB</div></div>
          </div>
          <div style={{marginTop:16,padding:"10px 14px",background:"var(--primary-light)",borderRadius:8,fontSize:12,color:"var(--primary)"}}>
            💡 Data disimpan secara automatik ke Firebase. Gunakan fungsi Eksport untuk membuat backup tempatan secara berkala.
          </div>
        </div>
      </div>
    </div>
  );
}
