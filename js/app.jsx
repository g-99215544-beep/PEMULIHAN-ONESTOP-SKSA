// ============ APP ============
function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialise from localStorage immediately (offline fallback)
  const [murid,     setMurid]     = useState(() => loadData("murid_sksa",     MURID_INITIAL));
  const [kehadiran, setKehadiran] = useState(() => loadData("kehadiran_sksa", {}));
  const [analisa,   setAnalisa]   = useState(() => loadData("analisa_sksa",   {}));
  const [settings,  setSettings]  = useState(() => loadData("settings_sksa",  SEKOLAH));
  const [toasts,    setToasts]    = useState([]);

  // Track when Firebase has finished the initial load
  // Using a ref so changes don't cause extra re-renders
  const fbReady = React.useRef(false);

  // ─── Load from Firebase on mount ─────────────────────────────────────────
  useEffect(() => {
    mainDB.ref('/').once('value').then(snap => {
      const d = snap.val() || {};
      // Only overwrite if Firebase has data (prevents wiping data on first use)
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
  // fbReady.current prevents saves during the initial Firebase load
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

  const navItems = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"murid",     icon:"👥", label:"Senarai Murid" },
    { id:"kehadiran", icon:"📋", label:"Rekod Kehadiran" },
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
          <div className="nav-section">Menu Utama</div>
          {navItems.map(n => (
            <div
              key={n.id}
              className={`nav-item ${page===n.id ? "active" : ""}`}
              onClick={()=>{ setPage(n.id); setSidebarOpen(false); }}
            >
              <span className="icon">{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
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
            <div className="date-badge">📅 {todayStr()}</div>
          </div>
        </div>

        <div className="content">
          {page==="dashboard"  && <Dashboard  murid={murid} kehadiran={kehadiran} analisa={analisa} settings={settings} setPage={setPage} />}
          {page==="murid"      && <MuridPage  murid={murid} setMurid={setMurid} addToast={addToast} />}
          {page==="kehadiran"  && <KehadiranPage murid={murid} kehadiran={kehadiran} setKehadiran={setKehadiran} addToast={addToast} />}
          {page==="analisa"    && <AnalisaPage   murid={murid} analisa={analisa}  setAnalisa={setAnalisa}   addToast={addToast} />}
          {page==="jadual"     && <JadualPage />}
          {page==="kemahiran"  && <KemahiranPage />}
          {page==="laporan"    && <LaporanPage   murid={murid} kehadiran={kehadiran} analisa={analisa} addToast={addToast} />}
          {page==="tetapan"    && <TetapanPage   settings={settings} setSettings={setSettings}
                                                 murid={murid}      setMurid={setMurid}
                                                 kehadiran={kehadiran} setKehadiran={setKehadiran}
                                                 analisa={analisa}  setAnalisa={setAnalisa}
                                                 addToast={addToast} />}
        </div>
      </main>

      <Toast toasts={toasts} removeToast={(id)=>setToasts(p=>p.filter(t=>t.id!==id))} />
    </div>
  );
}

// ============ MOUNT ============
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
