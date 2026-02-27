// ============ REACT HOOK GLOBALS ============
// Expose React hooks as globals so every component file can use them directly
window.useState    = React.useState;
window.useEffect   = React.useEffect;
window.useMemo     = React.useMemo;
window.useCallback = React.useCallback;

// ============ LOCAL STORAGE ============
function loadData(key, def) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; } catch { return def; }
}
function saveData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ============ DATE HELPERS ============
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function todayStr() {
  const d = new Date();
  return `${d.getDate()} ${BULAN_LIST[d.getMonth()]} ${d.getFullYear()}`;
}

function getTodayDay() {
  const days = ["AHAD","ISNIN","SELASA","RABU","KHAMIS","JUMAAT","SABTU"];
  return days[new Date().getDay()];
}

// ============ PERCENTAGE HELPERS ============
function getPct(hadir, total) {
  if (!total) return 0;
  return Math.round((hadir / total) * 100);
}

function pctClass(pct) {
  if (pct >= 80) return "pct-good";
  if (pct >= 60) return "pct-warn";
  return "pct-bad";
}

// ============ CLASS COLOR HELPERS ============
function getClassColor(kelas) {
  const map = {"2G":"#ede9fe","3B":"#fee2e2","4G":"#d1fae5","5C":"#ffedd5"};
  return map[kelas] || "#f1f5f9";
}

function getClassTextColor(kelas) {
  const map = {"2G":"#5b21b6","3B":"#991b1b","4G":"#065f46","5C":"#9a3412"};
  return map[kelas] || "#334155";
}

// ============ STRING HELPERS ============
function getInitials(nama) {
  return nama.split(" ").slice(0,2).map(w => w[0]).join("");
}
