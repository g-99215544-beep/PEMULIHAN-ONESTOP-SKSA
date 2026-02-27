// ============ MURID PAGE ============
function MuridPage({ murid, setMurid, addToast }) {
  const [cari, setCari] = useState("");
  const [tapKelas, setTapKelas] = useState("Semua");
  const [tapSubjek, setTapSubjek] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editMurid, setEditMurid] = useState(null);
  const [form, setForm] = useState({nama:"",no_mykid:"",kelas:"2G",bangsa:"M",jantina:"L",subjek:[],catatan:""});

  const filtered = useMemo(() => murid.filter(m => {
    if(tapKelas!=="Semua" && m.kelas!==tapKelas) return false;
    if(tapSubjek!=="Semua" && !m.subjek.includes(tapSubjek)) return false;
    if(cari && !m.nama.toLowerCase().includes(cari.toLowerCase()) && !m.kelas.includes(cari.toUpperCase())) return false;
    return true;
  }), [murid, tapKelas, tapSubjek, cari]);

  function openAdd() {
    setEditMurid(null);
    setForm({nama:"",no_mykid:"",kelas:"2G",bangsa:"M",jantina:"L",subjek:["BM"],catatan:""});
    setShowModal(true);
  }
  function openEdit(m) {
    setEditMurid(m);
    setForm({...m, subjek:[...m.subjek]});
    setShowModal(true);
  }
  function deleteMurid(id) {
    if(confirm("Padam murid ini?")) {
      setMurid(p=>p.filter(m=>m.id!==id));
      addToast("Murid telah dipadam");
    }
  }
  function saveForm() {
    if(!form.nama.trim()) { alert("Sila masukkan nama murid"); return; }
    if(!form.subjek.length) { alert("Sila pilih sekurang-kurangnya satu subjek"); return; }
    if(editMurid) {
      setMurid(p=>p.map(m=>m.id===editMurid.id?{...form,id:editMurid.id}:m));
      addToast("Data murid dikemaskini");
    } else {
      setMurid(p=>[...p,{...form,id:"m"+Date.now()}]);
      addToast("Murid baru ditambah");
    }
    setShowModal(false);
  }
  function toggleSubjek(s) {
    setForm(f=>({...f,subjek:f.subjek.includes(s)?f.subjek.filter(x=>x!==s):[...f.subjek,s]}));
  }

  const bmCount = murid.filter(m=>m.subjek.includes("BM")).length;
  const mtCount = murid.filter(m=>m.subjek.includes("MT")).length;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">👥 Senarai Murid Pemulihan</div>
          <div className="section-sub">BM: {bmCount} murid | Matematik: {mtCount} murid | Jumlah: {murid.length} murid</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Tambah Murid</button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input type="text" placeholder="🔍 Cari nama murid..." value={cari} onChange={e=>setCari(e.target.value)} style={{maxWidth:250}} />
            <select value={tapKelas} onChange={e=>setTapKelas(e.target.value)}>
              <option value="Semua">Semua Kelas</option>
              {KELAS_LIST.map(k=><option key={k} value={k}>Kelas {k}</option>)}
            </select>
            <select value={tapSubjek} onChange={e=>setTapSubjek(e.target.value)}>
              <option value="Semua">Semua Subjek</option>
              <option value="BM">Bahasa Melayu</option>
              <option value="MT">Matematik</option>
            </select>
            <span style={{fontSize:13,color:"var(--text-muted)",fontWeight:600}}>
              {filtered.length} murid dijumpai
            </span>
          </div>

          {KELAS_LIST.filter(k=>tapKelas==="Semua"||tapKelas===k).map(k => {
            const kMurid = filtered.filter(m=>m.kelas===k);
            if(!kMurid.length) return null;
            return (
              <div key={k} style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"8px 12px",background:getClassColor(k),borderRadius:10}}>
                  <span style={{fontWeight:800,fontSize:14,color:getClassTextColor(k)}}>📚 Kelas {k}</span>
                  <span style={{fontSize:12,color:getClassTextColor(k),opacity:0.8}}>{kMurid.length} murid</span>
                </div>
                <div style={{display:"grid",gap:8}}>
                  {kMurid.map((m,i)=>(
                    <div key={m.id} className="murid-card">
                      <div style={{fontSize:11,color:"var(--text-muted)",fontWeight:700,minWidth:24}}>{i+1}.</div>
                      <div className="murid-avatar" style={{background:getClassColor(m.kelas),color:getClassTextColor(m.kelas)}}>{getInitials(m.nama)}</div>
                      <div className="murid-info">
                        <div className="murid-name">{m.nama}</div>
                        <div className="murid-meta">
                          <span>MyKid: {m.no_mykid || "-"}</span>
                          <span>·</span>
                          <span>{m.jantina==="L"?"Lelaki":"Perempuan"}</span>
                          <span>·</span>
                          <span>{m.bangsa==="M"?"Melayu":m.bangsa==="C"?"Cina":m.bangsa==="I"?"India":"Lain"}</span>
                        </div>
                        <div style={{marginTop:4,display:"flex",gap:4,flexWrap:"wrap"}}>
                          {m.subjek.map(s=>(
                            <span key={s} className={`badge badge-${s.toLowerCase()}`}>{s==="BM"?"B. Melayu":"Matematik"}</span>
                          ))}
                          {m.catatan && <span className="skill-badge">📝 {m.catatan}</span>}
                        </div>
                      </div>
                      <div className="murid-actions">
                        <button className="btn btn-outline btn-sm" onClick={()=>openEdit(m)}>✏️</button>
                        <button className="btn btn-outline btn-sm" onClick={()=>deleteMurid(m.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length===0 && <div className="text-muted text-center" style={{padding:"40px 0"}}>Tiada murid dijumpai</div>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e=>{if(e.target.className==="modal-overlay")setShowModal(false)}}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editMurid?"✏️ Kemaskini Murid":"➕ Tambah Murid Baru"}</div>
              <button className="modal-close" onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Penuh (HURUF BESAR)</label>
                <input value={form.nama} onChange={e=>setForm(f=>({...f,nama:e.target.value.toUpperCase()}))} placeholder="NAMA PENUH MURID" />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>No. MyKid</label>
                  <input value={form.no_mykid} onChange={e=>setForm(f=>({...f,no_mykid:e.target.value}))} placeholder="XXXXXXXXXXXXXX" />
                </div>
                <div className="form-group">
                  <label>Kelas</label>
                  <select value={form.kelas} onChange={e=>setForm(f=>({...f,kelas:e.target.value}))}>
                    {KELAS_LIST.map(k=><option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Bangsa</label>
                  <select value={form.bangsa} onChange={e=>setForm(f=>({...f,bangsa:e.target.value}))}>
                    <option value="M">Melayu</option>
                    <option value="C">Cina</option>
                    <option value="I">India</option>
                    <option value="L">Lain-lain</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Jantina</label>
                  <select value={form.jantina} onChange={e=>setForm(f=>({...f,jantina:e.target.value}))}>
                    <option value="L">Lelaki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Subjek Pemulihan</label>
                <div className="checkbox-group">
                  <label className="checkbox-item"><input type="checkbox" checked={form.subjek.includes("BM")} onChange={()=>toggleSubjek("BM")} /> Bahasa Melayu (BM)</label>
                  <label className="checkbox-item"><input type="checkbox" checked={form.subjek.includes("MT")} onChange={()=>toggleSubjek("MT")} /> Matematik (MT)</label>
                </div>
              </div>
              <div className="form-group">
                <label>Catatan</label>
                <textarea value={form.catatan} onChange={e=>setForm(f=>({...f,catatan:e.target.value}))} rows={2} placeholder="Catatan tambahan (jika ada)..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={saveForm}>💾 Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
