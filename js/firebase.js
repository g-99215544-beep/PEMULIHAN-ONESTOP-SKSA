// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

// App 1 — School-wide attendance system (READ ONLY)
// Fetches daily student attendance (absenceStatus) from here
const kehadiranApp = firebase.initializeApp({
  apiKey: "AIzaSyDbCgDz2vK2BZUpwM3iDWJcPQSptVcNkv4",
  authDomain: "kehadiran-murid-6ece0.firebaseapp.com",
  databaseURL: "https://kehadiran-murid-6ece0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kehadiran-murid-6ece0",
  storageBucket: "kehadiran-murid-6ece0.firebasestorage.app",
  messagingSenderId: "223849234784",
  appId: "1:223849234784:web:e1471ded7ea17ba60bde05",
  measurementId: "G-4DY138HKTW"
}, "kehadiranApp");

// App 2 — OneStop Pemulihan main storage (READ + WRITE)
// All app data (murid, kehadiran, analisa, settings) saved here
const mainApp = firebase.initializeApp({
  apiKey: "AIzaSyDIW9GZAWvVY97GdojCYNXE5eVjXnyBsw8",
  authDomain: "pemulihan-onestop.firebaseapp.com",
  databaseURL: "https://pemulihan-onestop-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pemulihan-onestop",
  storageBucket: "pemulihan-onestop.firebasestorage.app",
  messagingSenderId: "347656077187",
  appId: "1:347656077187:web:d34f810d9add4bb0e800b6",
  measurementId: "G-CGDBJSVPB6"
}, "mainApp");

const kehadiranDB = kehadiranApp.database();
const mainDB     = mainApp.database();

// ============================================================
// NAME MATCHING HELPER
// Matches remedial student names against school system names.
// Uses word-level matching to handle partial/different formats.
// e.g. "MUHAMMAD SHAZRIQ AZRA" matches "MUHAMMAD SHAZRIQ AZRA BIN HASSAN"
// ============================================================
function namesMatch(remedialName, schoolName) {
  const n1 = remedialName.toUpperCase().trim();
  const n2 = schoolName.toUpperCase().trim();
  if (n1 === n2) return true;

  // Keep only meaningful words (>2 chars, skip bin/binti/a/ap)
  const skip = new Set(["BIN","BINTI","A/P","A/L","@"]);
  const words1 = n1.split(/\s+/).filter(w => w.length > 2 && !skip.has(w));
  const words2 = n2.split(/\s+/).filter(w => w.length > 2 && !skip.has(w));

  // Check if all significant words of the shorter name appear in the longer name
  const [shorter, longerStr] = words1.length <= words2.length
    ? [words1, n2]
    : [words2, n1];

  if (shorter.length === 0) return false;
  return shorter.every(word => longerStr.includes(word));
}

// ============================================================
// SYNC KEHADIRAN FROM SCHOOL SYSTEM
// Reads absenceStatus + kehadiran nodes from kehadiran-murid-6ece0,
// maps each date/class to remedial students, and updates app state.
// Existing MANUAL entries are NOT overwritten.
// ============================================================
function syncKehadiranFromSchool(murid, setKehadiran, addToast) {
  addToast("Sedang menyinkronkan kehadiran dari sistem sekolah...");

  Promise.all([
    kehadiranDB.ref('absenceStatus').once('value'),
    kehadiranDB.ref('kehadiran').once('value')
  ]).then(([absSnap, schSnap]) => {
    const absenceData = absSnap.val() || {};  // { "2026-01-15": { "2G": { "NAMA": "tidak_bersebab" } } }
    const schoolDays  = schSnap.val()  || {};  // { "2026-01-15": { "2G": { present, total, ... } } }

    // All dates that had school activity
    const allDates = new Set([
      ...Object.keys(absenceData),
      ...Object.keys(schoolDays)
    ]);

    setKehadiran(current => {
      const updated = JSON.parse(JSON.stringify(current));

      allDates.forEach(dateStr => {
        // dateStr = "2026-01-15"
        const d       = new Date(dateStr + 'T00:00:00');
        const bulan   = BULAN_LIST[d.getMonth()];
        const tahun   = d.getFullYear();
        const bulanKey = `${bulan}_${tahun}`;
        const hari    = d.getDate().toString();

        const dayAbsences = absenceData[dateStr] || {};

        KELAS_LIST.forEach(kelas => {
          const classAbsences = dayAbsences[kelas] || {};
          const absentNames   = Object.keys(classAbsences);
          const schoolHeld    = schoolDays[dateStr]?.[kelas] !== undefined;

          // Skip if no data for this class on this date
          if (!schoolHeld && absentNames.length === 0) return;

          // Get remedial students in this class
          const students = murid.filter(m => m.kelas === kelas);

          students.forEach(m => {
            m.subjek.forEach(subjek => {
              // Ensure nested path exists
              if (!updated[bulanKey])                       updated[bulanKey] = {};
              if (!updated[bulanKey][kelas])                updated[bulanKey][kelas] = {};
              if (!updated[bulanKey][kelas][subjek])        updated[bulanKey][kelas][subjek] = {};
              if (!updated[bulanKey][kelas][subjek][m.id])  updated[bulanKey][kelas][subjek][m.id] = {};

              // DO NOT overwrite existing manual entries
              if (updated[bulanKey][kelas][subjek][m.id][hari]) return;

              // Find if this student appears in the absence list
              const absentKey = absentNames.find(name => namesMatch(m.nama, name));

              if (absentKey) {
                const absType = classAbsences[absentKey];
                // bersebab (MC/surat doktor) or tidak_bersebab (T/tanpa sebab)
                updated[bulanKey][kelas][subjek][m.id][hari] = absType === 'bersebab' ? 'MC' : 'T';
              } else if (schoolHeld) {
                updated[bulanKey][kelas][subjek][m.id][hari] = 'H';
              }
            });
          });
        });
      });

      return updated;
    });

    addToast("✅ Kehadiran berjaya disinkronkan dari sistem sekolah!");
  }).catch(e => {
    console.error('Sync error:', e);
    addToast("❌ Gagal sinkronkan: " + (e.message || "Ralat tidak diketahui"), "error");
  });
}
