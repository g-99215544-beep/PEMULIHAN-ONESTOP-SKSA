// ============ LAPORAN PAGE ============
function LaporanPage({ murid, kehadiran, analisa, addToast }) {
  function exportJSON() {
    const data = { murid, kehadiran, analisa, tarikh_eksport: new Date().toISOString(), sekolah: "SKSA" };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`backup_pemulihan_sksa_${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    addToast("Data berjaya dieksport ke JSON");
  }

  function exportCSV() {
    const rows = [["Bil","Nama","No MyKid","Kelas","Bangsa","Jantina","Subjek","Catatan"]];
    murid.forEach((m,i)=>rows.push([i+1,m.nama,m.no_mykid,m.kelas,m.bangsa,m.jantina,m.subjek.join("+"),m.catatan]));
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="senarai_murid_pemulihan_sksa.csv";
    a.click(); URL.revokeObjectURL(url);
    addToast("CSV berjaya dieksport");
  }

  const totalBM = murid.filter(m=>m.subjek.includes("BM")).length;
  const totalMT = murid.filter(m=>m.subjek.includes("MT")).length;
  const jumlahL = murid.filter(m=>m.jantina==="L").length;
  const jumlahP = murid.filter(m=>m.jantina==="P").length;
  const jumlahM = murid.filter(m=>m.bangsa==="M").length;
  const jumlahI = murid.filter(m=>m.bangsa==="I").length;
  const jumlahC = murid.filter(m=>m.bangsa==="C").length;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">📄 Laporan & Eksport Data</div>
          <div className="section-sub">Jana laporan, eksport dan cetak borang rasmi</div>
        </div>
      </div>

      <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:24}}>
        <div className="stat-card blue">
          <div className="stat-icon blue">📖</div>
          <div><div className="stat-value">{totalBM}</div><div className="stat-label">Murid BM</div></div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow">🔢</div>
          <div><div className="stat-value">{totalMT}</div><div className="stat-label">Murid MT</div></div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">👥</div>
          <div><div className="stat-value">{murid.length}</div><div className="stat-label">Jumlah Murid</div></div>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom:24}}>
        <div className="card">
          <div className="card-header"><div className="card-title">👫 Pecahan Jantina</div></div>
          <div className="card-body">
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600}}>Lelaki</span>
                <span style={{fontSize:13,fontWeight:700,color:"var(--primary)"}}>{jumlahL} ({getPct(jumlahL,murid.length)}%)</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${getPct(jumlahL,murid.length)}%`,background:"var(--primary)"}} /></div>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600}}>Perempuan</span>
                <span style={{fontSize:13,fontWeight:700,color:"#ec4899"}}>{jumlahP} ({getPct(jumlahP,murid.length)}%)</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${getPct(jumlahP,murid.length)}%`,background:"#ec4899"}} /></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">🌏 Pecahan Bangsa</div></div>
          <div className="card-body">
            {[{label:"Melayu",count:jumlahM,color:"#1a56db"},{label:"India",count:jumlahI,color:"#f97316"},{label:"Cina",count:jumlahC,color:"#10b981"}].map(b=>(
              <div key={b.label} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:600}}>{b.label}</span>
                  <span style={{fontSize:13,fontWeight:700,color:b.color}}>{b.count} ({getPct(b.count,murid.length)}%)</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width:`${getPct(b.count,murid.length)}%`,background:b.color}} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom:24}}>
        <div className="card-header"><div className="card-title">📊 Agihan Mengikut Kelas</div></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Kelas</th><th>BM</th><th>Matematik</th><th>Jumlah</th><th>Lelaki</th><th>Perempuan</th></tr>
            </thead>
            <tbody>
              {KELAS_LIST.map(k=>{
                const km = murid.filter(m=>m.kelas===k);
                return (
                  <tr key={k}>
                    <td><span className={`badge badge-${k.toLowerCase()}`}>Kelas {k}</span></td>
                    <td>{km.filter(m=>m.subjek.includes("BM")).length}</td>
                    <td>{km.filter(m=>m.subjek.includes("MT")).length}</td>
                    <td style={{fontWeight:700}}>{km.length}</td>
                    <td>{km.filter(m=>m.jantina==="L").length}</td>
                    <td>{km.filter(m=>m.jantina==="P").length}</td>
                  </tr>
                );
              })}
              <tr style={{background:"var(--primary-light)",fontWeight:800}}>
                <td>JUMLAH</td>
                <td>{totalBM}</td><td>{totalMT}</td><td>{murid.length}</td>
                <td>{jumlahL}</td><td>{jumlahP}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="laporan-grid">
        <div className="laporan-card" onClick={exportJSON}>
          <div className="lc-icon">💾</div>
          <div className="lc-title">Eksport Backup JSON</div>
          <div className="lc-desc">Simpan semua data ke fail JSON untuk backup</div>
        </div>
        <div className="laporan-card" onClick={exportCSV}>
          <div className="lc-icon">📊</div>
          <div className="lc-title">Eksport CSV Senarai Murid</div>
          <div className="lc-desc">Eksport senarai murid ke format CSV</div>
        </div>
        <div className="laporan-card" onClick={()=>window.print()}>
          <div className="lc-icon">🖨️</div>
          <div className="lc-title">Cetak Halaman Ini</div>
          <div className="lc-desc">Cetak laporan dalam format print-friendly</div>
        </div>
        <div className="laporan-card" onClick={()=>{
          const info = `LAPORAN PROGRAM PEMULIHAN KHAS\nSK SRI AMAN, AYER ITAM, PULAU PINANG\nSesi 2026\n\nJumlah Murid BM: ${totalBM}\nJumlah Murid MT: ${totalMT}\nJumlah Keseluruhan: ${murid.length}\n\nTarikh Jana: ${todayStr()}`;
          const blob = new Blob([info],{type:"text/plain;charset=utf-8"});
          const url=URL.createObjectURL(blob);
          const a=document.createElement("a"); a.href=url; a.download="laporan_pemulihan_sksa.txt"; a.click();
          addToast("Laporan ringkas berjaya dieksport");
        }}>
          <div className="lc-icon">📝</div>
          <div className="lc-title">Laporan Ringkas TXT</div>
          <div className="lc-desc">Jana laporan ringkas dalam format teks</div>
        </div>
      </div>
    </div>
  );
}
