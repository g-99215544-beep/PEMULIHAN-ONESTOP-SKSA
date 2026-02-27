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
// Reads kehadiran node from kehadiran-murid-6ece0.
// Each date/class entry contains absentNames[].
// Students NOT in absentNames → H. Students IN absentNames → T.
// FULL REBUILD: clears all existing kehadiran data first, then
// repopulates ONLY from Firebase — ensures weekends/cuti = kosong.
// ============================================================
function syncKehadiranFromSchool(murid, setKehadiran, addToast) {
  if (addToast) addToast("Sedang menyinkronkan kehadiran dari sistem sekolah...");

  kehadiranDB.ref('kehadiran').once('value').then(schSnap => {
    const schoolDays = schSnap.val() || {};

    setKehadiran(() => {
      // Start FRESH — wipe all old data so stale weekend/holiday T entries are gone
      const fresh = {};

      Object.keys(schoolDays).forEach(dateStr => {
        const d        = new Date(dateStr + 'T00:00:00');
        const bulan    = BULAN_LIST[d.getMonth()];
        const tahun    = d.getFullYear();
        const bulanKey = `${bulan}_${tahun}`;
        const hari     = d.getDate().toString();

        KELAS_LIST.forEach(kelas => {
          const classData = schoolDays[dateStr][kelas];
          if (!classData) return; // no record for this class on this date

          const absentNames = classData.absentNames || [];
          const students    = murid.filter(m => m.kelas === kelas);

          students.forEach(m => {
            m.subjek.forEach(subjek => {
              if (!fresh[bulanKey])                    fresh[bulanKey] = {};
              if (!fresh[bulanKey][kelas])             fresh[bulanKey][kelas] = {};
              if (!fresh[bulanKey][kelas][subjek])     fresh[bulanKey][kelas][subjek] = {};
              if (!fresh[bulanKey][kelas][subjek][m.id]) fresh[bulanKey][kelas][subjek][m.id] = {};

              // Student absent if their name matches any entry in absentNames
              const isAbsent = absentNames.some(name => namesMatch(m.nama, name));
              fresh[bulanKey][kelas][subjek][m.id][hari] = isAbsent ? 'T' : 'H';
            });
          });
        });
      });

      return fresh;
    });

    if (addToast) addToast("✅ Kehadiran berjaya disinkronkan dari sistem sekolah!");
  }).catch(e => {
    console.error('Sync error:', e);
    if (addToast) addToast("❌ Gagal sinkronkan: " + (e.message || "Ralat tidak diketahui"), "error");
  });
}
