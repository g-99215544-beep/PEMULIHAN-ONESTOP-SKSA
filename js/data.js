// ============ SCHOOL & SESSION ============
const SEKOLAH = {
  nama: "SEKOLAH KEBANGSAAN SRI AMAN",
  alamat: "Jalan Kampung Melayu, 11500 Ayer Itam, Pulau Pinang",
  tel: "04-8287715",
  emel: "pbb1013@jpnpp.edu.my",
  guru: "ASQALANI BIN SUHAIMI",
  sesi: "2026"
};

const KELAS_LIST = ["2G", "3B", "4G", "5C"];
const BULAN_LIST = ["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"];

// ============ INITIAL STUDENT DATA ============
const MURID_INITIAL = [
  // 2G - BM  (nama disinkronkan dengan sistem sekolah Firebase)
  { id:"m001", nama:"AYRA ELIZA BINTI ABDUL AKHIR", no_mykid:"181011011916", kelas:"2G", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m002", nama:"MOHAMAD RIYAD ANAQI BIN MOHAMAD SYAZWAN", no_mykid:"190203014231", kelas:"2G", bangsa:"M", jantina:"L", subjek:["BM"], catatan:"" },
  { id:"m003", nama:"MOHD SHAHNAQEEF BIN ABDUL NUR", no_mykid:"190511014321", kelas:"2G", bangsa:"M", jantina:"L", subjek:["BM"], catatan:"" },
  { id:"m004", nama:"MUHAMAD AL FATTAH BIN RUZAINIE", no_mykid:"190812013421", kelas:"2G", bangsa:"M", jantina:"L", subjek:["BM","MT"], catatan:"" },
  { id:"m005", nama:"MUHAMMAD AQMAL NAUFAL BIN MOHD AZLEN", no_mykid:"190303014112", kelas:"2G", bangsa:"M", jantina:"L", subjek:["BM"], catatan:"" },
  { id:"m006", nama:"MUHAMMAD RAYYAN SYAZWAN BIN MOHD SYAZLY", no_mykid:"191105013211", kelas:"2G", bangsa:"M", jantina:"L", subjek:["BM"], catatan:"" },
  { id:"m007", nama:"MUHAMMAD SHAZRIQ AZRA BIN SHAHRIL HAZRIE", no_mykid:"190707014231", kelas:"2G", bangsa:"M", jantina:"L", subjek:["BM","MT"], catatan:"" },
  { id:"m008", nama:"MUHAMMAD SYAKIR ZAKWAN BIN KHAIRUL SYAFIQ", no_mykid:"190909013421", kelas:"2G", bangsa:"M", jantina:"L", subjek:["BM"], catatan:"" },
  { id:"m009", nama:"NOOR AYRA AISYAH BINTI AIZANI", no_mykid:"191212012341", kelas:"2G", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m010", nama:"NUR IFFATULELZAHRAH BINTI RAHIM", no_mykid:"190404013211", kelas:"2G", bangsa:"M", jantina:"P", subjek:["BM","MT"], catatan:"" },
  // 3B - BM
  { id:"m011", nama:"VENISSA MARRY NAIDU", no_mykid:"181115021231", kelas:"3B", bangsa:"I", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m012", nama:"NUR RAISYA BINTI MUHAMAD RAIMI", no_mykid:"181207013421", kelas:"3B", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m013", nama:"NUR ZARRA ALEYSHA BINTI ABDUL FATTAH", no_mykid:"180808013211", kelas:"3B", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m014", nama:"KEISHA JANNAH BINTI ANIZAL", no_mykid:"180303012341", kelas:"3B", bangsa:"M", jantina:"P", subjek:["BM","MT"], catatan:"" },
  { id:"m015", nama:"MOHAMAD ADAM HAFIZ BIN MOHAMAD SYAMSUL HAFIZ", no_mykid:"181010013421", kelas:"3B", bangsa:"M", jantina:"L", subjek:["BM","MT"], catatan:"" },
  { id:"m016", nama:"MUHAMMAD AKID IZWAN BIN HAIRUL IZWAN", no_mykid:"180505013211", kelas:"3B", bangsa:"M", jantina:"L", subjek:["BM","MT"], catatan:"" },
  // 4G - BM
  { id:"m017", nama:"MUHAMMAD RAYYAN MIKHAIL BIN TAUFIK HIDAYAT", no_mykid:"170606013421", kelas:"4G", bangsa:"M", jantina:"L", subjek:["BM"], catatan:"" },
  { id:"m018", nama:"MUZAKKIR MUSTAFA BIN MUHAMMAD MUZAMMIL", no_mykid:"170404013211", kelas:"4G", bangsa:"M", jantina:"L", subjek:["BM","MT"], catatan:"" },
  { id:"m019", nama:"SHAZMIA ELLYSYA BINTI SHAHRIL HAZRIE", no_mykid:"170808012341", kelas:"4G", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m020", nama:"NUR ALIYA ADAWIYAH", no_mykid:"170303013421", kelas:"4G", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m021", nama:"NUR A'FIDAA NATASHA BINTI FARID", no_mykid:"171212013211", kelas:"4G", bangsa:"M", jantina:"P", subjek:["BM","MT"], catatan:"" },
  { id:"m022", nama:"PALLAVEE A/P SANGKARAN", no_mykid:"170909021231", kelas:"4G", bangsa:"I", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m023", nama:"SHARANI A/P KESEVAN", no_mykid:"171111021341", kelas:"4G", bangsa:"I", jantina:"P", subjek:["BM","MT"], catatan:"" },
  // 5C - BM
  { id:"m024", nama:"MUHAMMAD ARYAN EZWAN BIN MOHD EFFENDI", no_mykid:"160707013421", kelas:"5C", bangsa:"M", jantina:"L", subjek:["BM"], catatan:"" },
  { id:"m025", nama:"NUR AEERA SYAFINA BINTI ASRUL RIZAL", no_mykid:"160404013211", kelas:"5C", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m026", nama:"NUR FATIHAH UMAIRAH BINTI MOHD HAMDAN", no_mykid:"161010012341", kelas:"5C", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  { id:"m027", nama:"NOOR SAMSILA BINTI ABDULLAH", no_mykid:"160505013421", kelas:"5C", bangsa:"M", jantina:"P", subjek:["BM"], catatan:"" },
  // 5C - MT sahaja
  { id:"m028", nama:"NUR RANIA DAMIA BINTI ABDUL FATTAH", no_mykid:"161203013211", kelas:"5C", bangsa:"M", jantina:"P", subjek:["MT"], catatan:"" },
];

// ============ TEACHER TIMETABLE ============
const JADUAL_GURU = {
  ISNIN: [
    {label:"PER", cls:"per"},{label:"BM 4G", cls:"bm-4g"},{label:"BM 4G", cls:"bm-4g"},
    {label:"-", cls:"empty"},{label:"MT 5C", cls:"mt-5c"},{label:"MT 5C", cls:"mt-5c"},
    {label:"-", cls:"empty"},{label:"BM 3B", cls:"bm-3b"},{label:"BM 3B", cls:"bm-3b"},
    {label:"-", cls:"empty"},{label:"-", cls:"empty"},{label:"-", cls:"empty"}
  ],
  SELASA: [
    {label:"-", cls:"empty"},{label:"BM 5C", cls:"bm-5c"},{label:"BM 5C", cls:"bm-5c"},
    {label:"-", cls:"empty"},{label:"MT 4G", cls:"mt-4g"},{label:"MT 4G", cls:"mt-4g"},
    {label:"-", cls:"empty"},{label:"BM 2G", cls:"bm-2g"},{label:"BM 2G", cls:"bm-2g"},
    {label:"MT 2G", cls:"mt-2g"},{label:"MT 2G", cls:"mt-2g"},{label:"-", cls:"empty"}
  ],
  RABU: [
    {label:"1M1S", cls:"1m1s"},{label:"1M1S", cls:"1m1s"},{label:"-", cls:"empty"},
    {label:"WP", cls:"wp"},{label:"WP", cls:"wp"},{label:"-", cls:"empty"},
    {label:"BM 3B", cls:"bm-3b"},{label:"BM 3B", cls:"bm-3b"},{label:"-", cls:"empty"},
    {label:"BM 4G", cls:"bm-4g"},{label:"BM 4G", cls:"bm-4g"},{label:"KOKO", cls:"koko"}
  ],
  KHAMIS: [
    {label:"-", cls:"empty"},{label:"BM 5C", cls:"bm-5c"},{label:"BM 5C", cls:"bm-5c"},
    {label:"-", cls:"empty"},{label:"-", cls:"empty"},{label:"BM 3B", cls:"bm-3b"},
    {label:"BM 3B", cls:"bm-3b"},{label:"BM 2G", cls:"bm-2g"},{label:"BM 2G", cls:"bm-2g"},
    {label:"-", cls:"empty"},{label:"-", cls:"empty"},{label:"BM 4G&5G", cls:"bm-4g"}
  ],
  JUMAAT: [
    {label:"BM 2G", cls:"bm-2g"},{label:"BM 2G", cls:"bm-2g"},{label:"-", cls:"empty"},
    {label:"WP", cls:"wp"},{label:"WP", cls:"wp"},{label:"MT 3B", cls:"mt-3b"},
    {label:"MT 3B", cls:"mt-3b"},{label:"-", cls:"empty"},{label:"-", cls:"empty"},
    {label:"-", cls:"empty"},{label:"-", cls:"empty"},{label:"-", cls:"empty"}
  ]
};

const WAKTU_SLOTS = [
  "7.40–8.10","8.10–8.40","8.40–9.10","9.10–9.40","9.40–10.10","10.10–10.40",
  "10.40–11.10","11.10–11.40","11.40–12.10","12.10–12.40","12.40–1.10","1.10–1.40"
];

// ============ REMEDIAL SKILLS ============
const KEMAHIRAN_BM = [
  "KP (Prabacaan & Pratulisan)",
  "KP1 - Huruf vokal","KP2 - Huruf kecil","KP3 - Huruf besar",
  "KP4 - Suku kata KV","KP9 - Suku kata KVK","KP17 - Suku Kata KVKK",
  "KP5 - Perkataan KV+KV","KP6 - Perkataan V+KV","KP7 - Perkataan KV+KV+KV",
  "KP8 - Perkataan KVK","KP10 - Perkataan V+KVK","KP11 - Perkataan KV+KVK",
  "KP12 - Perkataan KVK+KV","KP13 - Perkataan KVK+KVK","KP16 - Perkataan KVKK",
  "KP20 - Perkataan KVK+KVKK","KP31 - Membaca ayat mudah","KP32 - Bacaan & Pemahaman"
];

const KEMAHIRAN_MT = [
  "1 - Pra Nombor","2 - Konsep Nombor",
  "3.1 - Nombor Bulat Hingga 10","3.2 - Nombor Bulat Hingga 20",
  "3.3 - Nombor Bulat Hingga 100","3.4 - Nombor Bulat Hingga 1000",
  "4.1 - Tambah Dlm Lingkungan 10","4.2 - Tambah Dlm Lingkungan 18",
  "4.3 - Tambah Dlm Lingkungan 100","4.4 - Tambah Dlm Lingkungan 1000",
  "5.1 - Tolak Dlm Lingkungan 10","5.2 - Tolak Dlm Lingkungan 18",
  "5.3 - Tolak Dlm Lingkungan 100","6 - Operasi Darab","7 - Operasi Bahagi",
  "8.1 - Wang Hingga RM10","8.2 - Wang Hingga RM100","9 - Masa dan Waktu"
];
