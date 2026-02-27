// ============ APP ============
function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin state
  const [isAdmin,        setIsAdmin]        = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPw,        setAdminPw]        = useState("");
  const [adminPwErr,     setAdminPwErr]     = useState(false);

  // Initialise from localStorage immediately (offline fallback)
  const [murid,     setMurid]     = useState(() => loadData("murid_sksa",     MURID_INITIAL));
  const [kehadiran, setKehadiran] = useState(() => loadData("kehadiran_sksa", {}));
  const [analisa,   setAnalisa]   = useState(() => loadData("analisa_sksa",   {}));
  const [settings,  setSettings]  = useState(() => loadData("settings_sksa",  SEKOLAH));
  const [toasts,    setToasts]    = useState([]);

  const fbReady = React.useRef(false);

  // ─── Load from Firebase on mount ─────────────────────────────────────────
  useEffect(() => {
    mainDB.ref('/').once('value').then(snap => {
      const d = snap.val() || {};
      if (d.murid    && Array.isArray(d.murid) && d.murid.length > 0)     setMurid(d.murid);
      if (d.kehadiran && Object.keys(d.kehadiran).length > 0)              setKehadiran(d.kehadiran);
      if (d.analisa  && Object.keys(d.analisa).length > 0)                setAnalisa(d.analisa);
      if (d.settings)                                                       setSettings(d.settings);
    }).catch(e => {
      console.warn('Firebase load error (using localStorage fallback):', e);
    }).finally(() => {
      fbReady.current = true;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Save to Firebase + localStorage on every change ─────────────────────
  useEffect(() => {
    saveData("murid_sksa", murid);
    if (fbReady.current) mainDB.ref('/murid').set(murid).catch(console.warn);
  }, [murid]);

  useEffect(() => {
    saveData("kehadiran_sksa", kehadiran);
    if (fbReady.current) mainDB.ref('/kehadiran').set(kehadiran).catch(console.warn);
  }, [kehadiran]);

  useEffect(() => {
    saveData("analisa_sksa", analisa);
    if (fbReady.current) mainDB.ref('/analisa').set(analisa).catch(console.warn);
  }, [analisa]);

  useEffect(() => {
    saveData("settings_sksa", settings);
    if (fbReady.current) mainDB.ref('/settings').set(settings).catch(console.warn);
  }, [settings]);

  // ─── Toast helper ─────────────────────────────────────────────────────────
  const addToast = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(p => [...p, {id, msg, type}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  // ─── Admin login handler ───────────────────────────────────────────────────
  function handleAdminLogin() {
    if (adminPw === "abe123") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPw("");
      setAdminPwErr(false);
      addToast("✅ Log masuk admin berjaya!");
    } else {
      setAdminPwErr(true);
      setAdminPw("");
    }
  }

  function handleAdminLogout() {
    setIsAdmin(false);
    // If currently on an admin-only page, go back to dashboard
    if (["analisa","jadual","kemahiran","laporan","tetapan"].includes(page)) {
      setPage("dashboard");
    }
  }

  // ─── Nav items ────────────────────────────────────────────────────────────
  const publicNavItems = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"murid",     icon:"👥", label:"Senarai Murid" },
    { id:"kehadiran", icon:"📋", label:"Rekod Kehadiran" },
  ];

  const adminNavItems = [
    { id:"analisa",   icon:"📊", label:"Analisa BAPM-PMK" },
    { id:"jadual",    icon:"📅", label:"Jadual Waktu" },
    { id:"kemahiran", icon:"📚", label:"Kemahiran Pemulihan" },
    { id:"laporan",   icon:"📄", label:"Laporan & Eksport" },
    { id:"tetapan",   icon:"⚙️", label:"Tetapan" },
  ];

  const pageTitles = {
    dashboard:"Dashboard", murid:"Senarai Murid", kehadiran:"Rekod Kehadiran",
    analisa:"Analisa BAPM-PMK", jadual:"Jadual Waktu", kemahiran:"Kemahiran Pemulihan",
    laporan:"Laporan & Eksport", tetapan:"Tetapan"
  };

  return (
    <div>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:99}}
          onClick={()=>setSidebarOpen(false)}
          className="no-print"
        />
      )}

      {/* Sidebar */}
      <nav className={`sidebar no-print ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="school-badge">SK</div>
          <div>
            <div className="school-name">SK SRI AMAN</div>
            <div className="school-sub">Program Pemulihan Khas {settings.sesi}</div>
          </div>
        </div>

        <div className="sidebar-nav">
          {/* ── Menu Utama ── */}
          <div className="nav-section">Menu Utama</div>
          {publicNavItems.map(n => (
            <div
              key={n.id}
              className={`nav-item ${page===n.id ? "active" : ""}`}
              onClick={()=>{ setPage(n.id); setSidebarOpen(false); }}
            >
              <span className="icon">{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}

          {/* ── Admin Menu (hanya apabila log masuk) ── */}
          {isAdmin && (
            <>
              <div className="nav-section" style={{marginTop:8}}>Admin</div>
              {adminNavItems.map(n => (
                <div
                  key={n.id}
                  className={`nav-item admin-nav-item ${page===n.id ? "active" : ""}`}
                  onClick={()=>{ setPage(n.id); setSidebarOpen(false); }}
                >
                  <span className="icon">{n.icon}</span>
                  <span>{n.label}</span>
                </div>
              ))}
              <div
                className="nav-item admin-logout-item"
                onClick={handleAdminLogout}
                style={{marginTop:4}}
              >
                <span className="icon">🔒</span>
                <span>Log Keluar Admin</span>
              </div>
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="teacher-badge">
            <div className="teacher-avatar">
              {settings.guru.split(" ").slice(0,2).map(w=>w[0]).join("")}
            </div>
            <div className="teacher-info">
              <div className="name">{settings.guru.split(" ")[0]} {settings.guru.split(" ")[1]}</div>
              <div className="role">Guru Pemulihan Khas</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="topbar no-print">
          <div className="topbar-left">
            <button className="menu-btn" onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</button>
            <div className="breadcrumb">
              OneStop Pemulihan → <span>{pageTitles[page]}</span>
            </div>
          </div>
          <div className="topbar-right">
            {isAdmin && (
              <span style={{
                fontSize:10, fontWeight:700, background:"#fef3c7", color:"#92400e",
                padding:"3px 8px", borderRadius:99, marginRight:8, border:"1px solid #fcd34d"
              }}>
                🔑 ADMIN
              </span>
            )}
            <div className="date-badge">📅 {todayStr()}</div>
          </div>
        </div>

        <div className="content">
          {page==="dashboard"  && <Dashboard  murid={murid} kehadiran={kehadiran} analisa={analisa} settings={settings} setPage={setPage} isAdmin={isAdmin} />}
          {page==="murid"      && <MuridPage  murid={murid} setMurid={setMurid} addToast={addToast} />}
          {page==="kehadiran"  && <KehadiranPage murid={murid} kehadiran={kehadiran} setKehadiran={setKehadiran} addToast={addToast} />}
          {isAdmin && page==="analisa"   && <AnalisaPage   murid={murid} analisa={analisa}  setAnalisa={setAnalisa}   addToast={addToast} />}
          {isAdmin && page==="jadual"    && <JadualPage />}
          {isAdmin && page==="kemahiran" && <KemahiranPage />}
          {isAdmin && page==="laporan"   && <LaporanPage   murid={murid} kehadiran={kehadiran} analisa={analisa} addToast={addToast} />}
          {isAdmin && page==="tetapan"   && <TetapanPage   settings={settings} setSettings={setSettings}
                                                           murid={murid}      setMurid={setMurid}
                                                           kehadiran={kehadiran} setKehadiran={setKehadiran}
                                                           analisa={analisa}  setAnalisa={setAnalisa}
                                                           addToast={addToast} />}
          {/* Guard: admin page accessed without login */}
          {!isAdmin && ["analisa","jadual","kemahiran","laporan","tetapan"].includes(page) && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}>
              <div style={{textAlign:"center",color:"var(--text-muted)"}}>
                <div style={{fontSize:48,marginBottom:12}}>🔒</div>
                <div style={{fontWeight:700,fontSize:16}}>Akses Terhad</div>
                <div style={{fontSize:13,marginTop:4}}>Log masuk sebagai admin untuk melihat halaman ini.</div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Admin FAB (floating button bottom-left) ── */}
      <button
        className="admin-fab no-print"
        onClick={()=>{ if(isAdmin) handleAdminLogout(); else setShowAdminLogin(true); }}
        title={isAdmin ? "Log keluar admin" : "Log masuk admin"}
      >
        <span style={{fontSize:13,fontWeight:800,letterSpacing:"-0.5px"}}>AB</span>
      </button>

      {/* ── Admin Login Modal ── */}
      {showAdminLogin && (
        <div className="modal-overlay" onClick={()=>{ setShowAdminLogin(false); setAdminPw(""); setAdminPwErr(false); }}>
          <div className="modal" style={{maxWidth:360}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">🔑 Log Masuk Admin</div>
              <button className="modal-close" onClick={()=>{ setShowAdminLogin(false); setAdminPw(""); setAdminPwErr(false); }}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{
                  width:60,height:60,borderRadius:"50%",background:"var(--primary)",
                  display:"inline-flex",alignItems:"center",justifyContent:"center",
                  fontSize:22,fontWeight:800,color:"white",letterSpacing:"-1px"
                }}>AB</div>
                <div style={{fontSize:13,color:"var(--text-muted)",marginTop:8}}>Masukkan kata laluan admin</div>
              </div>
              <input
                type="password"
                className={`form-input ${adminPwErr ? "input-error" : ""}`}
                placeholder="Kata laluan..."
                value={adminPw}
                onChange={e=>{ setAdminPw(e.target.value); setAdminPwErr(false); }}
                onKeyDown={e=>{ if(e.key==="Enter") handleAdminLogin(); }}
                autoFocus
                style={{textAlign:"center",fontSize:18,letterSpacing:4}}
              />
              {adminPwErr && (
                <div style={{color:"var(--danger)",fontSize:12,textAlign:"center",marginTop:8,fontWeight:600}}>
                  ❌ Kata laluan salah. Cuba lagi.
                </div>
              )}
            </div>
            <div className="modal-footer" style={{justifyContent:"center"}}>
              <button className="btn btn-primary" onClick={handleAdminLogin} style={{width:"100%"}}>
                🔑 Log Masuk
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} removeToast={(id)=>setToasts(p=>p.filter(t=>t.id!==id))} />
    </div>
  );
}

// ============ MOUNT ============
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
