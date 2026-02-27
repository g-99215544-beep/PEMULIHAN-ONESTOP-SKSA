// ============ KEMAHIRAN PAGE ============
function KemahiranPage() {
  const [tab, setTab] = useState("bm");
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">📚 Kemahiran Pemulihan</div>
          <div className="section-sub">Senarai kemahiran berdasarkan Buku Panduan P&P</div>
        </div>
      </div>

      <div className="tabs">
        <div className={`tab ${tab==="bm"?"active":""}`} onClick={()=>setTab("bm")}>📖 Bahasa Melayu</div>
        <div className={`tab ${tab==="mt"?"active":""}`} onClick={()=>setTab("mt")}>🔢 Matematik</div>
      </div>

      {tab==="bm" && (
        <div className="card">
          <div className="card-header"><div className="card-title">Pemetaan Kemahiran Pemulihan Bahasa Melayu</div></div>
          <div className="card-body">
            <div style={{marginBottom:20}}>
              <div style={{background:"var(--primary-light)",padding:"10px 16px",borderRadius:10,marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13,color:"var(--primary)",marginBottom:6}}>Prabacaan dan Pratulis</div>
                <span className="skill-badge" style={{background:"var(--primary-light)",color:"var(--primary)"}}>KP - Prabacaan dan Pratulisan</span>
              </div>
              {[
                {kategori:"Abjad",color:"#ede9fe",tc:"#5b21b6",kp:["KP1 - Huruf-huruf vokal","KP2 - Huruf-huruf kecil","KP3 - Huruf-huruf besar"]},
                {kategori:"Suku Kata",color:"#fee2e2",tc:"#991b1b",kp:["KP4 - Suku kata KV","KP9 - Suku kata KVK","KP17 - Suku Kata KVKK"]},
                {kategori:"Perkataan",color:"#d1fae5",tc:"#065f46",kp:[
                  "KP5 - Perkataan KV+KV","KP6 - Perkataan V+KV","KP7 - Perkataan KV+KV+KV","KP8 - Perkataan KVK",
                  "KP10 - Perkataan V+KVK","KP11 - Perkataan KV+KVK","KP12 - Perkataan KVK+KV","KP13 - Perkataan KVK+KVK",
                  "KP14 - Perkataan KV+KV+KVK","KP15 - Perkataan KVK+KV+KVK","KP16 - Perkataan KVKK","KP17 - Perkataan KV+KVKK (Suku)",
                  "KP18 - Perkataan KV+KVKK","KP19 - Perkataan V+KVKK","KP20 - Perkataan KVK+KVKK","KP21 - Perkataan KVKK+KV",
                  "KP22 - Perkataan KVKK+KVK","KP23 - Perkataan KVKK+KVKK","KP24 - Perkataan KV+KV+KVKK",
                  "KP25 - Perkataan KV+KVK+KVKK","KP26 - Perkataan KVK+KV+KVKK","KP27 - Perkataan KVKK+KV+KVK",
                  "KP28 - Perkataan KV+KVKK+KVK","KP29 - Perkataan diftong dan vokal berganding",
                  "KP30 - Perkataan huruf konsonan bergabung (digraf)"
                ]},
                {kategori:"Ayat",color:"#ffedd5",tc:"#9a3412",kp:["KP31 - Membaca dan membina ayat mudah","KP32 - Bacaan dan Pemahaman"]}
              ].map(g=>(
                <div key={g.kategori} style={{background:g.color,padding:"12px 16px",borderRadius:10,marginBottom:12}}>
                  <div style={{fontWeight:800,fontSize:13,color:g.tc,marginBottom:8}}>{g.kategori}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {g.kp.map(k=><span key={k} className="skill-badge" style={{background:"rgba(255,255,255,0.7)",color:g.tc}}>{k}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==="mt" && (
        <div className="card">
          <div className="card-header"><div className="card-title">Kemahiran Pemulihan Matematik</div></div>
          <div className="card-body">
            {[
              {kategori:"Asas Nombor",color:"#dbeafe",tc:"#1d4ed8",kp:["1 - Pra Nombor","2 - Konsep Nombor","3.1 - Nombor Bulat Hingga 10","3.2 - Nombor Bulat Hingga 20","3.3 - Nombor Bulat Hingga 100","3.4 - Nombor Bulat Hingga 1000"]},
              {kategori:"Operasi Asas",color:"#d1fae5",tc:"#065f46",kp:["4.1 - Tambah Dlm Lingkungan 10","4.2 - Tambah Dlm Lingkungan 18","4.3 - Tambah Dlm Lingkungan 100","4.4 - Tambah Dlm Lingkungan 1000","5.1 - Tolak Dlm Lingkungan 10","5.2 - Tolak Dlm Lingkungan 18","5.3 - Tolak Dlm Lingkungan 100","5.4 - Tolak Dlm Lingkungan 1000","6 - Operasi Darab","7 - Operasi Bahagi"]},
              {kategori:"Wang & Masa",color:"#ffedd5",tc:"#9a3412",kp:["8.1 - Wang Hingga RM10","8.2 - Wang Hingga RM100","8.3 - Wang Hingga RM1000","9 - Masa dan Waktu"]}
            ].map(g=>(
              <div key={g.kategori} style={{background:g.color,padding:"12px 16px",borderRadius:10,marginBottom:12}}>
                <div style={{fontWeight:800,fontSize:13,color:g.tc,marginBottom:8}}>{g.kategori}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {g.kp.map(k=><span key={k} className="skill-badge" style={{background:"rgba(255,255,255,0.7)",color:g.tc}}>{k}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
