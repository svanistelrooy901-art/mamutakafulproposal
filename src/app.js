'use strict';
/* =====================================================================
   Proposal Studio · Mamu
   Static, no backend. Client data is NOT stored (only agent settings).
   Update DATA when new fact sheets / panel lists come in.
   ===================================================================== */

const DATA = {
  asOf: { adse: '31 Jul 2026', lookthrough: '6 Okt 2026', panel: '9 Feb 2026', products: 'Okt 2026', idamanContract: 'S022615B09 (H360-i T1088T 06/26)' },
  adse: {
    anchor: 49.6, rocket: 51.3,
    perf: [
      { p: '+46.6%', l: ['Sejak Mei 2021', 'Since May 2021'], b: ['≈7.6%/thn', '≈7.6%/yr'], hl: 1 },
      { p: '+40.8%', l: ['5 tahun', '5 years'], b: ['≈7.1%/thn', '≈7.1%/yr'], hl: 1 },
      { p: '+37.2%', l: ['3 tahun', '3 years'], b: ['tanda aras +36.3%', 'bmk +36.3%'] },
      { p: '+14.9%', l: ['1 tahun', '1 year'], b: ['tanda aras +15.3%', 'bmk +15.3%'] },
    ],
    look: [['Microsoft', 4.3], ['Apple', 4.2], ['Alphabet', 3.9], ['Nvidia', 3.9], ['Amazon', 3.3], ['Broadcom + Meta', 3.8]],
    lookTotal: 23,
  },
  // Mamu's 50:50 research deck, redrawn (historical simulation, RM100 base)
  chart: {
    blue: [[2014,100],[2014.5,107],[2015,102],[2015.5,110],[2016,123],[2016.5,125],[2017,136],[2017.5,148],[2018,160],[2018.5,157],[2019,150],[2019.5,160],[2020,156],[2020.5,176],[2021,191],[2021.5,186],[2022,145],[2022.5,170],[2023,186],[2023.5,197],[2024,213]],
    gold: [[2014,100],[2014.5,110],[2015,93],[2015.5,104],[2016,133],[2016.5,142],[2017,155],[2017.5,170],[2018,188],[2018.5,185],[2019,177],[2019.5,190],[2020,196],[2020.5,240],[2021,328],[2021.5,252],[2022,110],[2022.5,175],[2023,212],[2023.5,266],[2024,320]],
    green: [[2014,100],[2014.5,112],[2015,98],[2015.5,108],[2016,128],[2016.5,130],[2017,144],[2017.5,157],[2018,170],[2018.5,170],[2019,163],[2019.5,172],[2020,171],[2020.5,197],[2021,234],[2021.5,212],[2022,147],[2022.5,180],[2023,195],[2023.5,226],[2024,258]],
  },
  h360: {
    200: { limit: 'RM1.5M', limitTxt: ['RM1.5 juta', 'RM1.5 million'], big: 'RM1.5', rb: 200, up: [300, 400], ncb: 1000, ppb: 500 },
    300: { limit: 'RM3M', limitTxt: ['RM3 juta', 'RM3 million'], big: 'RM3', rb: 300, up: [450, 600], ncb: 2500, ppb: 1000 },
  },
  // Panel hospitals by state, from "Individual AIA Panel Hospital Listing" effective 9 Feb 2026 (s:1 = SMART panel, s:0 = General panel).
  states: [
    ['penang', 'Pulau Pinang', 'Penang'], ['kedah', 'Kedah', 'Kedah'], ['perak', 'Perak', 'Perak'], ['perlis', 'Perlis', 'Perlis'],
    ['klangvalley', 'Lembah Klang (KL / Selangor)', 'Klang Valley (KL / Selangor)'],
    ['n9', 'Negeri Sembilan', 'Negeri Sembilan'], ['melaka', 'Melaka', 'Melaka'], ['johor', 'Johor', 'Johor'],
    ['pahang', 'Pahang', 'Pahang'], ['terengganu', 'Terengganu', 'Terengganu'], ['kelantan', 'Kelantan', 'Kelantan'],
    ['sabah', 'Sabah', 'Sabah'], ['sarawak', 'Sarawak', 'Sarawak'], ['labuan', 'W.P. Labuan', 'Labuan'],
  ],
  areas: {
    penang: [['island', 'Pulau', 'Island'], ['mainland', 'Seberang Perai', 'Seberang Perai']],
    klangvalley: [['kl', 'Kuala Lumpur', 'Kuala Lumpur'], ['sel', 'Selangor', 'Selangor']],
  },
  hospitals: {
    klangvalley: { full: true, list: [
      {"nm": "Alty Orthopaedic Hospital", "ad": "Ground Floor, Menara ALTY, 187 Jalan Ampang, 50450 Kuala Lumpur", "ph": "03-2787 0500", "s": 1, "a": "kl"},
      {"nm": "Cengild G.I Medical Centre", "ad": "Unit 2-3 & 2-4, Nexus @ Bangsar South, No. 7, Jalan Kerinchi, 59200 Kuala Lumpur", "ph": "03-2242 7000", "s": 1, "a": "kl"},
      {"nm": "Columbia Asia Hospital Setapak", "ad": "No. 1, Jalan Danau Saujana, off Jln Genting Klang, 53300 Kuala Lumpur", "ph": "03-4145 9999", "s": 1, "a": "kl"},
      {"nm": "Damai Service Hospital (HQ)", "ad": "109-119, Jln Sultan Azlan Shah, 51200 Kuala Lumpur", "ph": "03-4043 4900", "s": 1, "a": "kl"},
      {"nm": "Institut Jantung Negara", "ad": "145, Jalan Tun Razak, 50400 Kuala Lumpur", "ph": "03-2617 8200", "s": 1, "a": "kl"},
      {"nm": "KMI Taman Desa Medical Centre", "ad": "45, Jalan Desa, Taman Desa, 58100 Kuala Lumpur", "ph": "03-7982 6500", "s": 1, "a": "kl"},
      {"nm": "KPJ Sentosa KL Specialist Hospital", "ad": "36, Jalan Chemur, Kompleks Damai, 50400 Kuala Lumpur", "ph": "03-4043 7166", "s": 1, "a": "kl"},
      {"nm": "KPJ Tawakkal Specialist Hospital", "ad": "No 1, Jalan Pahang Barat, 53000 Kuala Lumpur", "ph": "03-4026 7777", "s": 1, "a": "kl"},
      {"nm": "Pantai Hospital Ampang", "ad": "Jalan Perubatan 1, Pandan Indah, 55100 Kuala Lumpur", "ph": "03-4289 2828", "s": 1, "a": "kl"},
      {"nm": "Pantai Hospital Kuala Lumpur", "ad": "8, Jalan Bukit Pantai, 59100 Kuala Lumpur", "ph": "03-2296 0888", "s": 1, "a": "kl"},
      {"nm": "Sunway Medical Centre Velocity", "ad": "Lingkaran SV, Sunway Velocity, 55100 Kuala Lumpur", "ph": "03-9772 9191", "s": 1, "a": "kl"},
      {"nm": "Tung Shin Hospital", "ad": "No. 102, Jalan Pudu, 55100 Kuala Lumpur", "ph": "03-2037 2288", "s": 1, "a": "kl"},
      {"nm": "UKM Specialist Centre", "ad": "7th Floor, Clinical Block, UKM Medical Centre, Jalan Yaacob Latif, 56000 Cheras", "ph": "03-2332 9222", "s": 1, "a": "kl"},
      {"nm": "Cardiac Vascular Sentral Kuala Lumpur (CVSKL)", "ad": "Jalan Stesen Sentral 5, Kuala Lumpur Sentral, 50470 Kuala Lumpur", "ph": "03-2276 7000", "s": 0, "a": "kl"},
      {"nm": "Columbia Asia Hospital Bukit Jalil", "ad": "No.9, Jalan Jalil Perkasa 7, Bukit Jalil, 57000 Kuala Lumpur", "ph": "03-8657 9888", "s": 0, "a": "kl"},
      {"nm": "Gleneagles Hospital Kuala Lumpur", "ad": "282-286, Jalan Ampang, 50450 Kuala Lumpur", "ph": "03-4141 3000", "s": 0, "a": "kl"},
      {"nm": "Hospital Pakar Pusrawi Kuala Lumpur", "ad": "Lot 149, Jln Tun Razak, 50400 Kuala Lumpur", "ph": "03-2687 5000", "s": 0, "a": "kl"},
      {"nm": "KPJ Damansara Specialist Hospital 2 (DSH2)", "ad": "No 1 , Jalan Bukit Lanjan 3, Bukit Lanjan, 60000 Kuala Lumpur", "ph": "03-7717 3000", "s": 0, "a": "kl"},
      {"nm": "Pantai Hospital Cheras", "ad": "No 1, Jalan 1/96A, Taman Cheras Makmur, 56100 Kuala Lumpur", "ph": "03-9145 2888", "s": 0, "a": "kl"},
      {"nm": "Parkcity Medical Centre", "ad": "No 2, Jalan Intisari Perdana, Desa Parkcity, 52200 Kuala Lumpur", "ph": "03-5639 1616", "s": 0, "a": "kl"},
      {"nm": "Assunta Hospital", "ad": "Jalan Templer, 46990 Petaling Jaya", "ph": "03-7872 3000", "s": 1, "a": "sel"},
      {"nm": "Avisena Specialist Hospital", "ad": "4, Jalan Ikhtisas, Seksyen 14, 40000 Shah Alam", "ph": "03-5515 1888", "s": 1, "a": "sel"},
      {"nm": "Avisena Womens and Childrens Specialist Hospital", "ad": "No.3, Jalan Perdagangan 14/4, Seksyen 14, 40000 Shah Alam", "ph": "03-5515 1888", "s": 1, "a": "sel"},
      {"nm": "Bukit Tinggi Medical Centre", "ad": "Lot 83211, Persiaran Batu Nilam, Bandar Bukit Tinggi 1, 41200 Klang", "ph": "03-5639 1515", "s": 1, "a": "sel"},
      {"nm": "Columbia Asia Hospital Bukit Rimau", "ad": "3, Persiaran Anggerik Eria, Bukit Rmau, Seksyen 32, 40460 Shah Alam", "ph": "03-5125 9999", "s": 1, "a": "sel"},
      {"nm": "Columbia Asia Hospital Cheras", "ad": "Lot 33107, Jalan Suakasih, 43200 Cheras", "ph": "03-9086 9999", "s": 1, "a": "sel"},
      {"nm": "Columbia Asia Hospital Klang", "ad": "PT 71153, Jalan Mahkota 1/KU 2, Mutiara Bukit Raja 2, KM 2, Off Jalan Meru, 41050 Klang", "ph": "03-3346 7999", "s": 1, "a": "sel"},
      {"nm": "Damansara Specialist Hospital", "ad": "119, Jalan SS 20/10, Damansara Utama, 47400 Petaling Jaya", "ph": "03-7718 1000", "s": 1, "a": "sel"},
      {"nm": "KPJ Kajang Specialist Hospital", "ad": "Batu 14, Jalan Cheras, 43000 Kajang, 43000 Kajang", "ph": "03-8769 2999", "s": 1, "a": "sel"},
      {"nm": "KPJ Rawang Specialist Hospital", "ad": "Jalan Rawang, Bandar Baru Rawang, 48000 Rawang", "ph": "03-6099 8999", "s": 1, "a": "sel"},
      {"nm": "MSU Medical Centre", "ad": "Jln Boling Padang 13/64, Section 13, 40100 Shah Alam", "ph": "03-5526 2600", "s": 1, "a": "sel"},
      {"nm": "Pantai Hospital Klang", "ad": "Lot 5921, Persiaran Raja Muda Musa, 41200 Klang", "ph": "03-3258 5500", "s": 1, "a": "sel"},
      {"nm": "Sentosa Specialist Hospital", "ad": "No. 27-29, Lorong Temenggung 15-A, 41200 Klang", "ph": "03-5162 8814", "s": 1, "a": "sel"},
      {"nm": "Sri Kota Specialist Medical Centre", "ad": "Jalan Mohet, 41000 Klang", "ph": "03-3375 7799", "s": 1, "a": "sel"},
      {"nm": "Subang Jaya Medical Centre", "ad": "1, Jalan SS 12/1A, 47500 Subang Jaya", "ph": "03-5639 1212", "s": 1, "a": "sel"},
      {"nm": "Sunway Medical Centre", "ad": "No. 5, Jalan Lagoon Selatan, Bandar Sunway, 47500, Subang", "ph": "03-7491 9191", "s": 1, "a": "sel"},
      {"nm": "Sunway Medical Centre Damansara", "ad": "No. 2, Jalan PJU 5/1a, Kota Damansara, PJU 5, 47810 Petaling Jaya", "ph": "03-8966 9191", "s": 1, "a": "sel"},
      {"nm": "Ampang Puteri Specialist Hospital", "ad": "1, Jalan Mamanda 9, Taman Dato’ Ahmad Razali, 68000 Ampang", "ph": "03-4289 5000", "s": 0, "a": "sel"},
      {"nm": "Ara Damansara Medical Centre", "ad": "2, Jalan Lapangan Terbang Subang, Seksyen U2, 40150 Shah Alam", "ph": "03-5639 1888", "s": 0, "a": "sel"},
      {"nm": "Beacon Hospital", "ad": "1 Jalan 215, Off Jalan Templer, Section 51, 46050 Petaling Jaya", "ph": "03-7787 2992", "s": 0, "a": "sel"},
      {"nm": "Columbia Asia Hospital Petaling Jaya", "ad": "Lot 69 Jalan 13/6 Seksyen 13, 46200 Petaling Jaya", "ph": "03-7949 9999", "s": 0, "a": "sel"},
      {"nm": "Columbia Asia Hospital Puchong", "ad": "1, Lebuh Puteri, Bandar Puteri Puchong, 47100 Puchong", "ph": "03-8064 8688", "s": 0, "a": "sel"},
      {"nm": "Hospital Pakar An-Nur", "ad": "Jalan Gerbang Wawasan 1, Seksyen 15, 43650 Bandar Baru Bangi", "ph": "03-8923 5500", "s": 0, "a": "sel"},
      {"nm": "KPJ Klang Specialist Hospital", "ad": "No 102, Persiaran Rajawali / KU 1, Bandar Baru Klang, 41150, Klang", "ph": "03-3377 7888", "s": 0, "a": "sel"},
      {"nm": "KPJ Selangor Specialist Hospital", "ad": "Lot 1, Jalan Singa 20/1, Seksyen 20, 40300 Shah Alam", "ph": "03-5543 1111", "s": 0, "a": "sel"},
      {"nm": "Pusat Pakar Ortopedik OSC Specialist Centre", "ad": "G-1-1 to G-6-1, Damen USJ, Persiaran Kewajipan, USJ 1, 47600 Subang Jaya", "ph": "03-80843636", "s": 0, "a": "sel"},
      {"nm": "Sungai Long Specialist Hospital", "ad": "PT 21147 Persiaran Sungai Long 1, Bandar Sungai Long, 43000 Kajang", "ph": "03-9010 3788", "s": 0, "a": "sel"},
      {"nm": "Thomson Hospital Kota Damansara", "ad": "11, Jalan Teknologi, Kota Damansara, 47810 Petaling Jaya", "ph": "03-6287 1111", "s": 0, "a": "sel"},
      {"nm": "Tun Hussein Onn National Eye Hospital", "ad": "2, Lorong Utara (B), 46200 Petaling Jaya", "ph": "03-7718 1488", "s": 0, "a": "sel"},
    ] },
    johor: { full: true, list: [
      {"nm": "Bandar Dato’ Onn Specialist Hospital", "ad": "Jalan Bukit Mutiara, Bandar Dato Onn,81100 Johor Bahru", "ph": "07-301 1000", "s": 1},
      {"nm": "Columbia Asia Hospital Iskandar Puteri", "ad": "Persiaran Afiat, Taman Kesihatan Afiat, 79250 Nusajaya", "ph": "07-233 9999", "s": 1},
      {"nm": "Columbia Asia Hospital Tebrau", "ad": "Persiaran Southkey 5, Taman Southkey, 80150 Johor Bharu", "ph": "07-272 9999", "s": 1},
      {"nm": "Johor Specialist Hospital", "ad": "39-B, Jalan Abdul Samad, Kolam Ayer, 80100 Johor Bahru", "ph": "07-225 3000", "s": 1},
      {"nm": "KPJ Bandar Maharani Specialist Hospital", "ad": "73-1, Jalan Stadium, Kampung Baharu, 84000 Muar", "ph": "06-956 4500", "s": 1},
      {"nm": "KPJ Batu Pahat Specialist Hospital", "ad": "No.1 Jalan Mutiara Gading Utama, Taman Mutiara Gading, 83000 Batu Pahat", "ph": "07-457 1000", "s": 1},
      {"nm": "KPJ Kluang Specialist Hospital", "ad": "Jalan Saujana Utama, Taman Saujana, 86000 Kluang", "ph": "07-771 8999", "s": 1},
      {"nm": "KPJ Pasir Gudang Specialist Hospital", "ad": "Jalan Persiaran Dahlia 2, Taman Bukit Dahlia, 81700 Pasir Gudang", "ph": "07-257 3999", "s": 1},
      {"nm": "Pantai Hospital Batu Pahat", "ad": "9S, Jalan Bintang 1, Taman Koperasi Bahagia, 83000 Batu Pahat", "ph": "07-433 8811", "s": 1},
      {"nm": "Regency Specialist Hospital", "ad": "No 1, Jalan Suria, Bandar Seri Alam, 81750 Masai, Johor Bahru", "ph": "07-381 7700", "s": 1},
      {"nm": "Hospital Penawar", "ad": "15-18, Pusat Perniagaan Pasir Gudang, 81700 Pasir Gudang", "ph": "07-252 1800", "s": 0},
      {"nm": "Kempas Medical Centre", "ad": "Lot Ptd 7522, Jalan Kempas Baru, 81200, Kempas, Johor Bahru", "ph": "07-236 8999", "s": 0},
      {"nm": "Puteri Specialist Hospital", "ad": "33, Jalan Tun Abdul Razak (Susur 5), Larkin Jaya, 80350 Johor Bahru", "ph": "07-225 3222", "s": 0},
      {"nm": "Sena Specialist Hospital Segamat", "ad": "Jln Utama 3/10, 85000 Segamat, Johor Darul Ta’zim", "ph": "07-906 3111", "s": 0},
    ] },
    n9: { full: true, list: [
      {"nm": "Aurelius Hospital Negeri Sembilan", "ad": "PT 13717, Jalan BBN 2/1, Bandar Baru Nilai, 71800 Nilai", "ph": "06-850 5000", "s": 1},
      {"nm": "Columbia Asia Hospital Seremban", "ad": "292 & Lot PT1904, Jalan Haruan 2, Oakland Commercial Centre, 70300 Seremban", "ph": "06-601 1988", "s": 1},
      {"nm": "Salam Senawang Specialist Hospital", "ad": "No 234-243, Jalan Lavender Heights 2, Lavender Business Square, 70450 Senawang", "ph": "06-675 1188", "s": 1},
      {"nm": "UCSI Hospital", "ad": "No 2 Avenue, 3, Persiaran Springhill, 71010 Port Dickson", "ph": "06-648 8888", "s": 1},
      {"nm": "CMH Specialist Hospital", "ad": "Lot 3900, Jalan Tun Dr. Ismail, 70200 Seremban", "ph": "06-763 1688", "s": 0},
      {"nm": "KPJ Seremban Specialist Hospital", "ad": "Lot PT 6219 & 6220, Jalan Tioman 1, Kemayan Square, 70200 Seremban", "ph": "06-768 6000", "s": 0},
      {"nm": "Mawar Medical Centre", "ad": "No 71, Jalan Rasah, 70300 Seremban", "ph": "06-6764 7048", "s": 0},
    ] },
    melaka: { full: true, list: [
      {"nm": "Mahkota Medical Centre", "ad": "No 3, Mahkota Melaka, Jalan Merdeka, 75000 Melaka", "ph": "06-285 2999", "s": 1},
      {"nm": "Putra Specialist Hospital Melaka", "ad": "169, Jalan Bendahara, 75100 Melaka", "ph": "06-283 5888", "s": 1},
      {"nm": "Oriental Melaka Straits Medical Centre", "ad": "Pusat Perubatan Klebang, 75200 Melaka", "ph": "06-315 8888", "s": 0},
      {"nm": "Pantai Hospital Melaka", "ad": "No 2418-1, KM 8, Lebuh Ayer Keroh, 75450 Melaka", "ph": "06-231 9999", "s": 0},
    ] },
    pahang: { full: true, list: [
      {"nm": "Aurelius Hospital Pahang", "ad": "Lot 1, 3, 5 & 7, Wisma MUIP, Jalan Gambut, 25000 Kuantan", "ph": "09-513 7110", "s": 1},
      {"nm": "KPJ Pahang Specialist Hospital", "ad": "Jalan Tanjung Lumpur, 26060 Kuantan", "ph": "09-511 2692", "s": 1},
      {"nm": "IIUM Medical Specialist Centre", "ad": "Kulliyyah of Medicine, IIUM Indera Mahkota, 25200 Kuantan", "ph": "09-573 0380", "s": 0},
      {"nm": "KMI Kuantan Medical Centre", "ad": "Jalan Tun Razak, Bandar Indera Mahkota, 25200 Kuantan", "ph": "09-590 2828", "s": 0},
    ] },
    terengganu: { full: true, list: [
      {"nm": "Salam Specialist Hospital Kuala Terengganu", "ad": "Lot 4075, Jalan Engku Sar, 20300 Kuala Terengganu", "ph": "09-620 0200", "s": 1},
      {"nm": "KMI Kuala Terengganu Medical Centre", "ad": "Lot 3963, Jalan Sultan Mahmud, 20400 Kuala Terengganu", "ph": "09-637 8888", "s": 0},
    ] },
    kelantan: { full: true, list: [
      {"nm": "KPJ Perdana Specialist Hospital", "ad": "Lot PT 37 & 600, Seksyen 14, Jalan Bayam, 15200 Kota Bahru", "ph": "09-745 8000", "s": 1},
      {"nm": "Kota Bharu Medical Centre", "ad": "PT 179 - 184, Jalan Sultan Yahya Petra, Lundang, 15200 Kota Bharu", "ph": "09-743 3399", "s": 0},
    ] },
    perlis: { full: true, list: [
      {"nm": "KPJ Perlis Specialist Hospital", "ad": "No. 77, Jalan Dato Wan Ahmad, 01000 Kangar", "ph": "04-970 7777", "s": 1},
    ] },
    kedah: { full: true, list: [
      {"nm": "Metro Specialist Hospital", "ad": "1, Lorong Metro, 08000 Sungai Petani", "ph": "04-423 8888", "s": 1},
      {"nm": "Pantai Hospital Sungai Petani", "ad": "No 1, Pesiaran Cempaka, Bandar Amanjaya, 08000 Sungai Petani", "ph": "04-442 8888", "s": 1},
      {"nm": "Putra Medical Centre", "ad": "888, Jalan Sekerat, Off Jalan Putra, 05100 Alor Setar", "ph": "04-734 2888", "s": 1},
      {"nm": "Aurelius Hospital Alor Setar", "ad": "No B-5, Persiaran Bandar Baru Mergong, Jalan Perusahaan 1, Bandar Baru Mergong, 05150 Alor Setar", "ph": "04-7366970", "s": 0},
      {"nm": "Kedah Medical Centre", "ad": "175, Kampung Pumpong, 05250 Alor Setar", "ph": "04-730 8878", "s": 0},
      {"nm": "Pantai Hospital Laguna Merbok", "ad": "No 1, Lorong BLM 1/10, Bandar Laguna Merbok, 08000 Sungai Petani", "ph": "04-442 3888", "s": 0},
    ] },
    perak: { full: true, list: [
      {"nm": "Anson Bay Medical Centre", "ad": "Lot 992, Batu 3 ½, Jalan Maharajalela, 36000 Teluk Intan", "ph": "05-6232 999", "s": 1},
      {"nm": "Columbia Asia Hospital Taiping", "ad": "No 5, Jalan Perwira, 34000 Taiping", "ph": "05-820 8888", "s": 1},
      {"nm": "Hospital Fatimah", "ad": "1, Leboh Chew Peng Loon, Off Jalan Dato’ Lau Pak Khuan, Ipoh Garden, 31400 Ipoh", "ph": "05-545 5777", "s": 1},
      {"nm": "KPJ Sri Manjung Specialist Hospital", "ad": "Lot 14777 & Lot 14778, Jalan Lumut, 32000 Sitiawan", "ph": "05-691 8153", "s": 1},
      {"nm": "Pantai Hospital Manjung", "ad": "Jalan PPMP 1, Pusat Perniagaan Manjung Point, 32040 Seri Manjung", "ph": "05-689 8555", "s": 1},
      {"nm": "Perak Community Specialist Hospital", "ad": "277, Jalan Raja Permaisuri Bainun, 30250 Ipoh", "ph": "05-241 9000", "s": 1},
      {"nm": "Sunway Medical Centre Ipoh", "ad": "No.2, Persiaran Sunway, Sunway City Ipoh, 31150 Ipoh,", "ph": "05-871 1919", "s": 1},
      {"nm": "Taiping Medical Centre", "ad": "45-49, Jalan Medan Taiping 2, 34000 Taiping", "ph": "05-807 1049", "s": 1},
      {"nm": "Hospital Seri Botani", "ad": "No. 3, Dataran Botani 2, Bandar Seri Botani, 31350 Ipoh", "ph": "05-226 2777", "s": 0},
      {"nm": "Ipoh Specialist Hospital", "ad": "26, Jalan Raja Dihilir, 30350 Ipoh", "ph": "05-240 8777", "s": 0},
      {"nm": "Pantai Hospital Ipoh", "ad": "126, Jalan Tambun, Taman Ipoh, 31400 Ipoh", "ph": "05-540 5555", "s": 0},
    ] },
    penang: { full: true, list: [
      {"nm": "Gleneagles Hospital Penang", "ad": "No 1, Jalan Pangkor, 10050 Georgetown", "ph": "04-222 9111", "s": 1, "a": "island"},
      {"nm": "Hospital Lam Wah Ee", "ad": "141, Jalan Tan Sri Teh Ewe Lim, 11600 Penang", "ph": "04-652 8888", "s": 1, "a": "island"},
      {"nm": "Island Hospital", "ad": "308, Macalister Road, 10450 George Town", "ph": "04-238 3388", "s": 1, "a": "island"},
      {"nm": "Kek Lok Si Charitable Hospital", "ad": "623, Jln Balik Pulau, 11500 Ayer Itam", "ph": "04-299 9333", "s": 1, "a": "island"},
      {"nm": "Mount Miriam Cancer Hospital", "ad": "23, Jalan Bulan, Fettes Park, 11200 Tanjung Bungah", "ph": "04-892 3999", "s": 1, "a": "island"},
      {"nm": "Loh Guan Lye Specialist Centre", "ad": "238, Jalan Macalister, 10450 Georgetown", "ph": "04-238 8888", "s": 0, "a": "island"},
      {"nm": "Pantai Hospital Penang", "ad": "82, Jalan Tengah, Bayan Baru, 11900 Bayan Lepas", "ph": "04-643 3888", "s": 0, "a": "island"},
      {"nm": "Penang Adventist Hospital", "ad": "465, Jalan Burma, 10350 Georgetown", "ph": "04-222 7200", "s": 0, "a": "island"},
      {"nm": "Bagan Specialist Centre", "ad": "Jalan Bagan Satu, 13400 Butterworth", "ph": "04-371 0000", "s": 1, "a": "mainland"},
      {"nm": "Sunway Medical Centre Penang", "ad": "3106, Lebuh Tenggiri 2, Pusat Bandar Seberang Jaya, 13700 Perai", "ph": "04-373 9191", "s": 1, "a": "mainland"},
      {"nm": "KPJ Penang Specialist Hospital", "ad": "570, Jalan Perda Utama, Bandar Perda, 14000 Bukit Mertajam", "ph": "04-548 6688", "s": 0, "a": "mainland"},
    ] },
    sabah: { full: true, list: [
      {"nm": "Jesselton Medical Centre", "ad": "Metro Town, Jalan Bunga Ulam Raja, Jalan Lintas, Off Jalan Tuaran, 88300 Kota Kinabalu", "ph": "088-366 333", "s": 1},
      {"nm": "KPJ Sabah Specialist Hospital", "ad": "Lot No.2 Off, Jalan Damai, Luyang Commercial Centre, 88300 Kota Kinabalu", "ph": "088-322 000", "s": 1},
      {"nm": "Gleneagles Hospital Kota Kinabalu", "ad": "Riverson@Sembulan, Block A-1, Lorong Riverson@Sembulan, 88100 Kota Kinabalu", "ph": "088-518 888", "s": 0},
    ] },
    sarawak: { full: true, list: [
      {"nm": "KPJ Miri Specialist Hospital", "ad": "Lot 8836, Block 11, KBLD, Off Tudan, Kuala Baram By Pass Rd, Bandar Baru Permyjaya, 98000 Miri", "ph": "085-649 999", "s": 1},
      {"nm": "KPJ Sibu Specialist Medical Center", "ad": "No 52A-G, Persiaran Brooke, Pekan Sibu, 96000 Sibu", "ph": "084-329 900", "s": 1},
      {"nm": "Kuching Specialist Hospital", "ad": "Lot 10420, Block 11 Tabuan Stutong Commercial Centre, Jalan Setia Raja, 93350 Kuching", "ph": "082-365 777", "s": 1},
      {"nm": "Timberland Medical Centre", "ad": "Lot 5160-5169 & 7477-7486, Block 16, KCLD, 2 1/2 Mile, Jalan Rock, 93250 Kuching", "ph": "082-234 466", "s": 1},
      {"nm": "Borneo Medical Centre (Kuching)", "ad": "Lot 10992, Section 64 KTLD, Jalan, Tun Jugah, 93350 Kuching", "ph": "082-507 333", "s": 0},
      {"nm": "Kemena Pacific Hospital", "ad": "Lot 3582, Block 26, Jalan Tan Sri Ikhwan, Kemena Land District, Tanjung Kidurong, 97000 Bintulu", "ph": "086-251 888", "s": 0},
      {"nm": "Normah Medical Specialist Centre", "ad": "Lot 937, Section 30 KTLD, Jalan Tun Abdul Rahman Yaakub, Petra Jaya, 93050 Kuching", "ph": "082-440 055", "s": 0},
      {"nm": "Selesa Pacific Hospital", "ad": "Lot 1035-1039, Jalan Bulan Sabit, C.D.T 155, 98000 Miri", "ph": "085-437 755", "s": 0},
    ] },
  },
};

/* ---------------- A-Enrich Rezeki calculator (port of rezeki_calc.py) ---------------- */
const PLANS = {
  '10Pay20': { term: 10, min: 6000, tiers: [[2, 5, .10], [6, 11, .20], [12, 19, .30]], mat: 4, sav: .5 },
  '5Pay20': { term: 5, min: 12000, tiers: [[2, 5, .05], [6, 11, .10], [12, 19, .15]], mat: 2, sav: .4 },
};
const SCEN = [
  { key: 'kon', rate: .05, nm: ['Konservatif', 'Conservative'], rt: ['5% / thn · pasaran perlahan', '5% / yr · slow markets'] },
  { key: 'trend', rate: .08, nm: ['Trend ADSE', 'Trend ADSE'], rt: ['8% / thn · berdasarkan rekod sebenar ADSE', "8% / yr · based on ADSE's actual record"] },
  { key: 'opt', rate: .10, nm: ['Optimis', 'Optimistic'], rt: ['10% / thn · pasaran kukuh', '10% / yr · strong markets'] },
];
const SPLIT_INV = 0.25, ALLOC = 0.95, YEARS = 20;
function ibPct(p, y) { for (const [a, b, r] of p.tiers) if (y >= a && y <= b) return r; return 0; }
function irr(cfs) {
  let lo = -0.99, hi = 1, m = 0;
  const f = r => cfs.reduce((s, c, t) => s + c / Math.pow(1 + r, t), 0);
  for (let i = 0; i < 200; i++) { m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
  return m;
}
function runRezeki(plan, basic, saver, saverYears, adhoc, rate) {
  const p = PLANS[plan], n = p.term;
  let inv = 0, ibPaid = 0, paid = 0;
  const cfs = new Array(YEARS + 1).fill(0), ibs = [];
  for (let y = 1; y <= YEARS; y++) {
    const cb = y <= n ? basic : 0, cs = y <= saverYears ? saver : 0, ca = y === 1 ? adhoc : 0;
    const c = cb + cs + ca;
    paid += c; cfs[y - 1] -= c;
    inv += (cb * SPLIT_INV + cs + ca) * ALLOC;
    inv *= 1 + rate;
    const ib = basic * ibPct(p, y);
    ibPaid += ib; inv += ib; ibs.push(ib);
  }
  const mat = basic * p.mat, sav = basic * p.sav, total = inv + mat + sav;
  cfs[YEARS] += total;
  return { paid, fund: inv, ibTotal: ibPaid, mat, sav, total, mult: total / paid, irr: irr(cfs) * 100, ibs };
}

/* ---------------- state ---------------- */
const blankState = () => ({
  prod: 'idaman', lang: 'bm',
  i: { family: '', persons: [{ name: '', rel: 'self', m: '' }], sum: '', term: '70', plan: '200', ded: 'none', state: 'penang', area: 'all', ptype: 'all', hosp: null },
  r: { name: '', age: '', use: 'retire', child: '', childAge: '', plan: '5Pay20', basic: '', saver: '', saverYears: '', adhoc: '',
       have: { gk: false, df: false, m1: false, m2: false }, deathMode: 'blank',
       death: [{ y: 2, v: '' }, { y: 5, v: '' }, { y: 10, v: '' }, { y: 19, v: '' }] },
  a: { name: 'Mamu', title: 'Independent Risk Consultant / Fincoach, AIA PUBLIC Takaful Bhd.', phone: '' },
});
let S = blankState();
try { const a = JSON.parse(localStorage.getItem('ps_agent') || 'null'); if (a) Object.assign(S.a, a); } catch (e) {}

/* ---------------- panel hospitals ---------------- */
const MAX_HOSP = 11;
const shortAd = ad => ad.split(',').map(x => x.trim()).filter(Boolean).slice(-2).join(', ');
function hospPool(s) {
  const d = DATA.hospitals[s.state]; if (!d) return [];
  return d.list.filter(h => (s.area === 'all' || !h.a || h.a === s.area) && (s.ptype === 'all' || h.s));
}
function hospChosen(s) {
  const pool = hospPool(s);
  if (Array.isArray(s.hosp)) return pool.filter(h => s.hosp.includes(h.nm));
  return pool.length <= MAX_HOSP ? pool : pool.filter(h => h.s).slice(0, MAX_HOSP - 1);
}
const areaName = (st, a) => { const r = (DATA.areas[st] || []).find(x => x[0] === a); return r ? t(r[1], r[2]) : ''; };

/* ---------------- relationships (Idaman) ---------------- */
const RELS = [['self', 'Diri sendiri', 'Self'], ['spouse', 'Pasangan', 'Spouse'], ['parent', 'Ibu bapa', 'Parent'], ['guardian', 'Penjaga sah', 'Legal guardian']];
const relLabel = code => { const r = RELS.find(x => x[0] === code); return !r || code === 'self' ? '' : (S.lang === 'bm' ? r[1] : r[2]); };

/* ---------------- helpers ---------------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const L = () => (S.lang === 'bm' ? 0 : 1);
const t = (bm, en) => (S.lang === 'bm' ? bm : en);
const num = v => { const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')); return isFinite(n) ? n : 0; };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const RM = n => 'RM' + Math.round(n).toLocaleString('en-US');
const RM2 = n => 'RM' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const kk = n => { if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'; if (n >= 1000) { const v = n / 1000; return (v >= 100 ? Math.round(v) : +v.toFixed(1)) + 'k'; } return String(Math.round(n)); };
const RMk = n => 'RM' + kk(n);
const pct = r => Math.round(r * 100) + '%';
function getK(path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), S); }
function setK(path, v) { const ks = path.split('.'); let o = S; ks.slice(0, -1).forEach(k => (o = o[k])); o[ks.at(-1)] = v; }
const dateStr = () => { const d = new Date(); const mb = ['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogos','Sep','Okt','Nov','Dis'], me = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${d.getDate()} ${(S.lang === 'bm' ? mb : me)[d.getMonth()]} ${d.getFullYear()}`; };

function footer1() {
  const a = S.a;
  return `<div class="foot"><span><b>${t('Disediakan oleh', 'Prepared by')} ${esc(a.name || 'Mamu')}</b> · ${esc(a.title)}${a.phone ? ' · ' + esc(a.phone) : ''}</span><span style="white-space:nowrap">${dateStr()} · ${t('Muka surat 1 / 2', 'Page 1 of 2')}</span></div>`;
}

/* =====================================================================
   TEMPLATE A · A-Life Idaman + A-Plus Health360-i
   ===================================================================== */
function renderIdaman() {
  const s = S.i, lg = L();
  const P = DATA.h360[s.plan];
  const persons = s.persons.filter(p => p.name.trim() || num(p.m));
  const n = Math.max(persons.length, 1);
  const sum = num(s.sum);
  const total = persons.reduce((a, p) => a + num(p.m), 0);
  const fam = esc(s.family.trim() || (persons[0] && persons[0].name) || t('anda', 'you'));
  const p300 = s.plan === '300';
  const words = [['Satu', 'One'], ['Dua', 'Two'], ['Tiga', 'Three'], ['Empat', 'Four']];
  const h1a = n === 1 ? t('Satu pelan. Hati tenang.', 'One plan. Peace of mind.') : t(`Satu pelan. ${words[n - 1][0]} hati.`, `One plan. ${words[n - 1][1]} hearts.`);
  const h1b = n === 1 && !s.family.trim() ? t(`Perlindungan 360° untuk ${fam}.`, `360° protection for ${fam}.`) : t(`Perlindungan 360° untuk keluarga ${fam}.`, `360° protection for ${fam}'s family.`);
  const avc = ['var(--red)', '#E77B8C', '#9E0B24', '#F2A6B2'];
  const plist = (persons.length ? persons : [{ name: '—', rel: '', m: '' }]).map((p, i) => `<div class="person"><div class="pn"><div class="av" style="background:${avc[i % 4]}">${esc((p.name.trim()[0] || '?').toUpperCase())}</div>${esc(p.name)}${relLabel(p.rel) ? ` <span style="font-weight:500;color:var(--muted);font-size:8pt">&nbsp;· ${relLabel(p.rel)}</span>` : ''}</div><div class="pp">${RM(num(p.m))}<small>${t('/bln', '/mth')}</small></div></div>`).join('');
  const daily = total * 12 / 365;
  const dedNote = {
    none: t('Perlindungan seluruh dunia (luar negara >90 hari berturut tidak dilindungi, kecuali Singapura &amp; Brunei).', 'Worldwide cover (overseas &gt;90 consecutive days excluded, except Singapore &amp; Brunei).'),
    d500: t('Pilihan jimat: deductible RM500 setiap tahun sijil. Perlindungan seluruh dunia (luar negara &gt;90 hari tidak dilindungi, kecuali Singapura &amp; Brunei).', 'Cost-saving option: RM500 deductible per certificate year. Worldwide cover (overseas &gt;90 days excluded, except Singapore &amp; Brunei).'),
    smart: t('Pilihan SMART: deductible RM500; jika di luar perjalanan SMART, tambah 20% co-takaful (had RM20,000/thn). Kecemasan &amp; kemalangan dikecualikan.', 'SMART Option: RM500 deductible; off the SMART journey add 20% co-takaful (cap RM20,000/yr). Emergencies &amp; accidents exempted.'),
  }[s.ded];
  const dedPill = { none: '', d500: t(' · Deductible RM500', ' · RM500 deductible'), smart: ' · SMART Option' }[s.ded];

  const also = [
    t('<b>Prosedur &amp; pembedahan rawatan harian</b>', '<b>Day care procedures &amp; surgery</b>'),
    t('<b>Rawatan kanser pesakit luar &amp; dialisis buah pinggang</b>', '<b>Out-patient cancer treatment &amp; kidney dialysis</b>'),
    t('<b>Rawatan kemalangan kecemasan pesakit luar</b> termasuk gigi + susulan 30 hari', '<b>Emergency accident out-patient</b> incl. dental + 30 days follow-up'),
    t('<b>Fisioterapi pesakit luar</b> — sehingga 8 sesi (sakit belakang, patah tulang, kecederaan ligamen)', '<b>Out-patient physiotherapy</b> — up to 8 sessions (back pain, fractures, ligament injury)'),
    t('<b>Rawatan penyakit pesakit luar</b> (penyakit tertentu, 5% co-takaful sehingga RM500)', '<b>Out-patient illness treatment</b> (selected conditions, 5% co-takaful up to RM500)'),
    t(`<b>Penjagaan jururawat di rumah</b> — sehingga ${p300 ? 'RM6,000' : 'RM3,000'} setiap kemasukan (maks 180 hari seumur hidup)`, `<b>Home nursing care</b> — up to ${p300 ? 'RM6,000' : 'RM3,000'} per admission (max 180 days lifetime)`),
    t('<b>Personal Medical Case Management</b> — pendapat kedua pakar global melalui Teladoc', '<b>Personal Medical Case Management</b> — global specialist 2nd opinion via Teladoc'),
  ];
  if (p300) {
    also.push(t('<b>★ Prevention &amp; Primary Care</b> — saringan, vaksin, GP RM50×3/thn (gabungan RM1,000 setiap 2 thn)', '<b>★ Prevention &amp; Primary Care</b> — screening, vaccination, GP RM50×3/yr (combined RM1,000 per 2 yrs)'));
    also.push(t('<b>★ Komplikasi kehamilan tertentu</b> — sehingga RM10,000 seumur hidup · <b>★ Kanta intraokular</b> — sehingga RM7,000 seumur hidup', '<b>★ Specified pregnancy complications</b> — up to RM10,000 lifetime · <b>★ Intraocular lens</b> — up to RM7,000 lifetime'));
  } else {
    also.push(t('<b>Manfaat penjaga harian</b> untuk pesakit muda &amp; warga emas', '<b>Daily guardian benefit</b> for young &amp; senior patients'));
  }

  const stRow = DATA.states.find(x => x[0] === s.state) || DATA.states[0];
  const stName = t(stRow[1], stRow[2]);
  const stData = DATA.hospitals[s.state];
  const hosp = hospChosen(s).slice(0, MAX_HOSP);
  const hasGen = hosp.some(h => !h.s);
  let hHtml = '', no = 0, lastA = '';
  for (const h of hosp) {
    if (h.a && h.a !== lastA && s.area === 'all') { hHtml += `<div class="area">${areaName(s.state, h.a)}</div>`; lastA = h.a; }
    no++;
    hHtml += `<div class="h${h.s ? ' plat' : ''}"><div class="no${h.s ? ' sm' : ' gp'}">${no}</div><div><div class="nm">${esc(h.nm)}</div><div class="ad">${h.ad ? esc(shortAd(h.ad)) + ' · ' : ''}<span class="ph">${h.ph}</span></div></div></div>`;
  }
  if (!hosp.length) {
    hHtml += `<div class="h" style="grid-column:1/-1;background:var(--cream);border-style:dashed;padding:3mm"><div class="no">🏥</div><div><div class="nm">${t(`Hospital panel SMART di ${stName}`, `SMART panel hospitals in ${stName}`)}</div><div class="ad" style="font-size:7.4pt;margin-top:.8mm">${t('Senarai terkini hospital, klinik GP dan pakar SMART berdekatan boleh disemak dalam app AIA+ (Panel Locator) atau aia.com.my. Ejen anda akan bantu pilih hospital panel yang paling dekat.', 'The latest SMART hospitals, GP clinics and specialists near you are in the AIA+ app (Panel Locator) or aia.com.my. Your agent will help you pick the nearest panel hospital.')}</div></div></div>`;
  }
  const smartTxt = s.ded === 'smart'
    ? t('SMART: tiada 20% co-takaful + Preferred Panel Bonus.', 'SMART: no 20% co-takaful + Preferred Panel Bonus.')
    : t('SMART: layak Preferred Panel Bonus.', 'SMART: earns the Preferred Panel Bonus.');
  const genTxt = hasGen ? t(' Panel umum: GL tanpa tunai untuk jabatan/pakar tertentu sahaja.', ' General: cashless GL for selected departments/specialists only.') : '';
  hHtml += `<div class="h" style="background:var(--cream);border-style:dashed${hosp.length % 2 ? '' : ';grid-column:1/-1'}"><div class="no">★</div><div><div class="nm"><span class="dot sm"></span>SMART${hasGen ? ` &nbsp;<span class="dot gp"></span>${t('Panel umum', 'General panel')}` : ''}</div><div class="ad">${smartTxt}${genTxt}</div></div></div>`;
  const partial = hosp.length < hospPool(s).length;
  const hospNote = !hosp.length ? t('Senarai panel boleh berubah — sentiasa sahkan dalam app AIA+ sebelum masuk wad.', 'Panel list may change — always confirm in the AIA+ app before admission.')
    : t(`Sumber: AIA Panel Hospital Listing, ${DATA.asOf.panel}. ${partial ? 'Pilihan hospital berdekatan; senarai penuh dalam app AIA+. ' : ''}Senarai boleh berubah — sahkan dalam app AIA+ sebelum masuk wad.`, `Source: AIA Panel Hospital Listing, ${DATA.asOf.panel}. ${partial ? 'Selected nearby hospitals; full list in the AIA+ app. ' : ''}List may change — confirm in the AIA+ app before admission.`);

  const ncb = P.ncb, bars = Array.from({ length: 10 }, (_, i) => `<div class="bar"><span>${kk(ncb * (i + 1))}</span><i style="height:${(i + 1) * 10}%"></i></div>`).join('');
  const names = persons.map(p => esc(p.name)).filter(Boolean);
  const famCap = n > 1
    ? t(`Untuk ${names.join(' + ')} bersama: sehingga <b>${RM(ncb * 10 * n)}</b> dalam wallet — sebelum Vitality booster. `, `For ${names.join(' + ')} together: up to <b>${RM(ncb * 10 * n)}</b> in wallets — before any Vitality booster. `)
    : '';

  return `<div class="doc tA lang-${S.lang}">
<section class="page">
  <div class="hero">
    <div class="tag">${t('Cadangan Perlindungan Keluarga', 'Family Takaful Proposal')}</div>
    <h1>${h1a}<br><span>${h1b}</span></h1>
    <p>${t(`A-Life Idaman (takaful keluarga) + rider perubatan A-Plus Health360-i — perlindungan hayat, had perubatan tahunan ${P.limitTxt[0]}, dan Health Wallet yang memberi ganjaran bila anda kekal sihat.`, `A-Life Idaman (family takaful) + A-Plus Health360-i medical rider — life protection, a ${P.limitTxt[1]} yearly medical cover, and a Health Wallet that rewards you for staying well.`)}</p>
    <div class="plans"><span class="pill">A-Life Idaman</span><span class="pill">A-Plus Health360-i · Plan ${s.plan}${dedPill}</span><span class="pill o">AIA PUBLIC Takaful Bhd.</span></div>
  </div>
  <div class="snap">
    <div class="card"><div class="k">${t('Perlindungan kematian / TPD', 'Death / TPD cover')}</div><div class="big">${RM(sum)}</div><div class="sub">${t(`Setiap orang · kematian atau TPD, yang mana dahulu · <b>${RM(sum * 2)}</b> jika kematian akibat kemalangan`, `Each person · death or TPD, whichever comes first · <b>${RM(sum * 2)}</b> if death is accidental`)}</div></div>
    <div class="card"><div class="k">${t('Perubatan', 'Medical')} · Plan ${s.plan}</div><div class="big">${P.big}<small> ${t('juta / tahun', 'mil / year')}</small></div><div class="sub">${t(`Bilik &amp; penginapan <b>RM${P.rb}/hari</b> · Tiada had seumur hidup`, `Room &amp; board <b>RM${P.rb}/day</b> · No lifetime limit`)}</div></div>
    <div class="card people${persons.length > 2 ? ' many' : ''}"><div class="k">${t('Orang dilindungi · bulanan', 'Covered persons · monthly')}</div>${plist}
      <div class="total"><span style="font-size:7.8pt">${n > 1 ? t(`Jumlah untuk ${n}`, `Total for ${n}`) + ' · ' : ''}≈ ${RM2(daily)}${t('/hari', '/day')}</span><b>${RM(total)}${t('/bln', '/mth')}</b></div></div>
  </div>
  <div class="pad">
    <div class="sec"><div class="n">1</div><h2>${t('A-Life Idaman — jaring keselamatan keluarga', 'A-Life Idaman — the family safety net')}</h2><div class="hint">${t('Setiap orang dilindungi', 'Per person covered')}</div></div>
    <div class="life">
      <div class="lb"><div class="ic">🛡️</div><div class="v">${RM(sum)}</div><div class="t">${t('Manfaat kematian', 'Death benefit')}</div><div class="d">${t('Jumlah dilindungi kepada keluarga, tambah nilai akaun (PAF + PIF).', 'Sum covered to your family, plus account value (PAF + PIF).')}</div></div>
      <div class="lb"><div class="ic">⚡</div><div class="v">${RM(sum * 2)}</div><div class="t">${t('Kematian akibat kemalangan', 'Accidental death')}</div><div class="d">${t('Faedah kematian + tambahan 100% jumlah dilindungi (sebelum umur 70).', 'Death benefit + extra 100% of sum covered (before age 70).')}</div></div>
      <div class="lb"><div class="ic">♿</div><div class="v">${RM(sum)}</div><div class="t">${t('Hilang Upaya Menyeluruh &amp; Kekal', 'Total &amp; Permanent Disability')}</div><div class="d">${t('Jumlah sama, dibayar jika TPD berlaku dahulu (hingga umur 70). Kematian atau TPD, bayar sekali sahaja.', 'Same amount, paid if TPD happens first (up to age 70). Death or TPD, paid once only.')}</div></div>
      <div class="lb"><div class="ic">🕋</div><div class="v">RM5,000</div><div class="t">Badal Hajj</div><div class="d">${t('Untuk waris uruskan Badal Haji (Muslim 16+); selainnya dibayar sebagai belanja pengebumian.', 'For family to arrange Badal Hajj (Muslims 16+); otherwise paid as funeral expenses.')}</div></div>
      <div class="lb"><div class="ic">⏳</div><div class="v">${t('Umur 100', 'Age 100')}</div><div class="t">${t('Lanjutan automatik', 'Auto-extension')}</div><div class="d">${t(`Selepas matang umur ${s.term}, perlindungan diteruskan hingga umur 100 jika nilai akaun cukup.`, `After maturity at ${s.term}, cover continues to age 100 if account value is enough.`)}</div></div>
    </div>

    <div class="sec"><div class="n">2</div><h2>${t(`A-Plus Health360-i (Plan ${s.plan}) — manfaat utama`, `A-Plus Health360-i (Plan ${s.plan}) — major benefits`)}</h2><div class="hint">${t('Tertakluk had tahunan', 'Subject to annual limit')}</div></div>
    <div class="medgrid">
      <div class="hl">
        <h3>${t('Bil hospital? Kad perubatan settle.', 'Hospital bill? Your medical card settles it.')}</h3>
        <div class="row">
          <div class="bx"><div class="num">${P.limit}</div><div class="lab">${t('Had tahunan, reset setiap tahun', 'Annual limit, resets every year')}</div></div>
          <div class="bx"><div class="num">∞</div><div class="lab">${t('Tiada had seumur hidup', 'No lifetime limit')}</div></div>
          <div class="bx"><div class="num">RM${P.rb}</div><div class="lab">${t('Bilik &amp; penginapan / hari, tiada had hari', 'Room &amp; board / day, no day limit')}</div></div>
        </div>
        <ul class="ticks" style="margin-top:2.5mm">
          <li style="color:#fff"><b>ICU</b> — ${t('ikut caj sebenar, tiada had hari', 'as charged, no day limit')}</li>
          <li style="color:#fff">${t('<b>Pembedahan, bilik bedah, pakar bius &amp; lawatan pakar</b> — ikut caj sebenar', '<b>Surgery, theatre, anaesthetist &amp; specialist visits</b> — as charged')}</li>
          <li style="color:#fff">${t('<b>Sebelum masuk wad</b> 90 hari · <b>Selepas keluar wad</b> 180 hari (365 hari jika serius), termasuk fisio, kiropraktik &amp; akupunktur', '<b>Pre-hospitalisation</b> 90 days · <b>Post-hospitalisation</b> 180 days (365 if serious), incl. physio, chiro &amp; acupuncture')}</li>
          <li style="color:#fff">${t('<b>Pemindahan &amp; penghantaran pulang kecemasan</b> — sehingga USD1 juta', '<b>Emergency evacuation &amp; repatriation</b> — up to USD1 million')}</li>
        </ul>
        <div class="note">${dedNote}</div>
      </div>
      <div class="card" style="padding:3mm 3.5mm">
        <div class="k" style="color:var(--red)">${t('Turut dilindungi', 'Also covered')}</div>
        <ul class="ticks">${also.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="journey">
      <div class="jstep"><div class="s">${t('Langkah 1', 'Step 1')}</div><div class="tt">${t('Klinik SMART (GP)', 'SMART Clinic (GP)')}</div><div class="dd">${t('Mula di klinik panel SMART AIA.', 'Start at an AIA SMART panel clinic.')}</div></div>
      <div class="jstep"><div class="s">${t('Langkah 2', 'Step 2')}</div><div class="tt">${t('Pakar SMART', 'SMART Specialist')}</div><div class="dd">${t('GP rujuk jika perlu pemeriksaan lanjut.', 'GP refers you if you need further checks.')}</div></div>
      <div class="jstep"><div class="s">${t('Langkah 3', 'Step 3')}</div><div class="tt">${t('Hospital SMART', 'SMART Hospital')}</div><div class="dd">${t('Masuk wad tanpa tunai dengan Surat Jaminan.', 'Admit with cashless Guarantee Letter.')}</div></div>
      <div class="jstep" style="background:var(--red);color:#fff"><div class="s" style="color:#FFD7DD">Bonus</div><div class="tt">+${RM(P.ppb)} Health Wallet</div><div class="dd" style="color:#FFE3E7">${t('Preferred Panel Bonus bila dirawat di hospital SMART.', 'Preferred Panel Bonus when treated at a SMART hospital.')}</div></div>
    </div>
  </div>
  ${footer1().replace(t('Muka surat 1 / 2', 'Page 1 of 2'), t('Muka surat 1 / 2 · Caruman ilustrasi; angka muktamad ikut Ilustrasi Produk.', 'Page 1 of 2 · Illustrative; final figures per Product Illustration.'))}
</section>

<section class="page">
  <div class="p2head">
    <h1>${t('Sihat, dapat ganjaran.<br><span>Sakit, dah ada perlindungan.</span>', 'Stay healthy, get rewarded.<br><span>Fall sick, you’re covered.</span>')}</h1>
    <div class="k">A-Plus Health360-i · Plan ${s.plan}<br>Health Wallet · AIA Vitality · SMART Panel</div>
  </div>
  <div class="wallet">
    <div>
      <div class="k" style="color:#BFF0E8">${t('Health Wallet · tiada caruman tambahan', 'Health Wallet · no extra contribution')}</div>
      <h2>${t('Poket simpanan kesihatan anda — diisi secara automatik.', 'Your own health savings pocket — filled automatically.')}</h2>
      <p>${t(`Pelan ini mengkreditkan wang ke Health Wallet bila anda kekal sihat atau guna hospital SMART. Guna untuk penjagaan tambahan tanpa mengurangkan had tahunan ${P.limit}.`, `The plan credits money into your Health Wallet when you stay healthy or use SMART hospitals. Use it for extra care that doesn't eat into your ${P.limit} annual limit.`)}</p>
      <div class="earn">
        <div class="e"><div class="amt">${RM(P.ncb)}<small>/ ${t('tahun', 'year')}</small></div><div class="tx"><b>No-Claim Bonus</b><br>${t('Dikreditkan setiap tahun tanpa tuntutan (sehingga 10 kali).', 'Credited every year with no claim (up to 10 times).')}</div></div>
        <div class="e"><div class="amt">${RM(P.ppb)}<small>/ ${t('tahun', 'year')}</small></div><div class="tx"><b>Preferred Panel Bonus</b><br>${t('Bila tuntut di Hospital Panel SMART (sehingga 10 kali).', 'When you claim at a SMART Panel Hospital (up to 10 times).')}</div></div>
        <div class="e"><div class="amt">+5–10%<small>${t('setahun', 'yearly')}</small></div><div class="tx"><b>Health Wallet Booster</b><br>${t('Tambahan % baki wallet untuk AIA Vitality Gold / Platinum.', 'Extra % of wallet balance for AIA Vitality Gold / Platinum.')}</div></div>
      </div>
    </div>
    <div class="chart">
      <div class="k">${t('Jika kekal tanpa tuntutan · setiap orang', 'If you stay claim-free · per person')}</div>
      <h3>${t(`Health Wallet boleh cecah ${RM(ncb * 10)}`, `Health Wallet can grow to ${RM(ncb * 10)}`)}</h3>
      <div class="bars">${bars}</div>
      <div class="xl">${Array.from({ length: 10 }, (_, i) => `<span>${t('T', 'Y')}${i + 1}</span>`).join('')}</div>
      <div class="cap">${famCap}${t(`Ilustrasi sahaja: No-Claim Bonus ${RM(ncb)} × 10 tahun tanpa tuntutan, andaian wallet tidak digunakan. Wallet tidak boleh dikeluarkan sebagai tunai.`, `Illustration only: No-Claim Bonus ${RM(ncb)} × 10 claim-free years, assuming no wallet usage. Wallet cannot be withdrawn as cash.`)}</div>
    </div>
  </div>
  <div class="pad">
    <div class="sec" style="margin-top:4mm"><div class="n" style="background:var(--teal)">3</div><h2>${t('Cara guna Health Wallet', 'How you can use the Health Wallet')}</h2><div class="hint">${t('Tertakluk baki wallet', 'Subject to wallet balance')}</div></div>
    <div class="use">
      <div class="u"><div class="ic">🚀</div><div class="t">Protect Boost</div><div class="d">${t(`Bayar bil selepas had tahunan habis — atau dibayar semasa kematian, sehingga 2× jumlah perlindungan asas (${RM(sum * 2)}).`, `Pays the bill after your annual limit is used up — or paid out on death, up to 2× basic sum covered (${RM(sum * 2)}).`)}</div></div>
      <div class="u"><div class="ic">🧠</div><div class="t">${t('Kesihatan Mental', 'Mental Health')}</div><div class="d">${t('Konsultasi pakar psikiatri sehingga RM1,500/thn — termasuk kemurungan major, bipolar &amp; kemurungan selepas bersalin.', 'Psychiatrist consultation up to RM1,500/year — incl. major depression, bipolar &amp; postpartum depression.')}</div></div>
      <div class="u"><div class="ic">💪</div><div class="t">${t('Pemulihan &amp; Sokongan', 'Recovery &amp; Support')}</div><div class="d">${t('Penjagaan pemulihan untuk kanser, strok &amp; serangan jantung, serta anggota palsu dan alat bantu dengar.', 'Recovery care for cancer, stroke &amp; heart attack, plus artificial limbs and hearing aids.')}</div></div>
      <div class="u"><div class="ic">✨</div><div class="t">${t('Penjagaan Khas', 'Special Care')}</div><div class="d">${t('Keadaan kongenital, dan pembedahan plastik/rekonstruktif akibat kemalangan atau kanser.', 'Congenital conditions, and plastic/reconstructive surgery due to accident or cancer.')}</div></div>
    </div>
  </div>
  <div class="split">
    <div>
      <div class="sec"><div class="n" style="background:var(--gold)">4</div><h2>${t('Ganjaran AIA Vitality', 'AIA Vitality rewards')}</h2></div>
      <table class="vt">
        <tr><th>Plan ${s.plan}</th><th class="sv">Silver</th><th class="gd">Gold</th><th class="pl">Platinum</th></tr>
        <tr><td>${t('Hospitalisation Care · hospital SMART', 'Hospitalisation Care · SMART hospital')}</td><td>RM150</td><td>RM500</td><td class="hi">RM1,000</td></tr>
        <tr><td>${t('Hospitalisation Care · hospital lain', 'Hospitalisation Care · other hospital')}</td><td>–</td><td>RM250</td><td class="hi">RM500</td></tr>
        <tr><td>${t('Naik taraf bilik &amp; penginapan', 'Room &amp; board upgrade')}</td><td>–</td><td>RM${P.up[0]}</td><td class="hi">RM${P.up[1]}</td></tr>
        <tr><td>Health Wallet Booster</td><td>–</td><td>+5%</td><td class="hi">+10%</td></tr>
        ${p300 ? `<tr><td>${t('Healthy Retirement Bonus / thn', 'Healthy Retirement Bonus / yr')}</td><td>RM500</td><td>RM800</td><td class="hi">RM1,000</td></tr>` : ''}
      </table>
      <div class="mini">${t('Bronze: tiada ganjaran tambahan. Hospitalisation Care dibayar sekali setahun semasa masuk wad. Keahlian AIA Vitality RM10/bulan. Sertai melalui app AIA+.', 'Bronze: no extra rewards. Hospitalisation Care paid once a year upon admission. AIA Vitality membership RM10/month. Join via the AIA+ app.')}${p300 ? t(' Healthy Retirement Bonus: pada umur 60 atau tahun sijil 10 (yang lebih lewat).', ' Healthy Retirement Bonus: from age 60 or certificate year 10, whichever is later.') : ''}</div>
      <div class="cta"><div><b>${t('Kekal sihat → dapat lebih', 'Stay healthy → earn more')}</b><br><span>${t('Langkah, pemeriksaan kesihatan &amp; saringan naikkan status Vitality anda.', 'Steps, health checks &amp; screenings raise your Vitality status.')}</span></div><div style="font-size:18pt">🏃</div></div>
      <div class="mini" style="margin-top:2.5mm"><b style="color:var(--ink)">${t('Perlu tahu:', 'Good to know:')}</b> ${t("Tempoh bertenang 15 hari · tempoh ihsan 31 hari · perlindungan berterusan 5 tahun pertama jika caruman dibayar tepat masa · tempoh menunggu perubatan 30 hari (120 hari untuk penyakit tertentu; kecuali kecederaan) · penyakit sedia ada tidak dilindungi · kadar Tabarru' tidak dijamin dan meningkat ikut umur.", "15-day free-look · 31-day grace period · 5-year no-lapse if contributions paid on time · medical waiting period 30 days (120 days for specified illnesses; injuries exempt) · pre-existing conditions excluded · Tabarru' rates not guaranteed and increase with age.")}</div>
    </div>
    <div>
      <div class="sec"><div class="n">5</div><h2>${t(`Hospital Panel AIA · ${stName}`, `AIA Panel Hospitals · ${stName}`)}${s.area !== 'all' && areaName(s.state, s.area) ? ' · ' + areaName(s.state, s.area) : ''}</h2></div>
      <div class="hgrid">${hHtml}</div>
      <div class="mini">${hospNote}</div>
    </div>
  </div>
  <div class="foot"><span><b>${t('Penting:', 'Important:')}</b> ${t('Ringkasan ilustrasi, bukan sijil takaful. Manfaat, pengecualian &amp; tempoh menunggu ikut Ilustrasi Produk, PDS dan sijil. Permohonan tertakluk underwriting. AIA PUBLIC Takaful Bhd. ahli PIDM; manfaat dilindungi sehingga had tertentu.', 'This is a summary for illustration, not a takaful certificate. Benefits, exclusions &amp; waiting periods per Product Illustration, PDS and certificate. Application subject to underwriting. AIA PUBLIC Takaful Bhd. is a member of PIDM; benefits protected up to limits.')}</span><span style="white-space:nowrap">${t('Muka surat 2 / 2', 'Page 2 of 2')}</span></div>
</section></div>`;
}

/* =====================================================================
   TEMPLATE C · A-Enrich Rezeki
   ===================================================================== */
function chartSVG() {
  const X = yr => 34 + (yr - 2014) / 10 * 358, Y = v => 8 + (340 - v) / 260 * 142;
  let g = '';
  for (let v = 100; v <= 340; v += 40) g += `<line x1="34" x2="392" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="#EEE6E8" stroke-width="0.8"/><text x="30" y="${(Y(v) + 3).toFixed(1)}" font-size="8" fill="#8A8390" text-anchor="end">${v}</text>`;
  for (let yr = 2014; yr <= 2024; yr += 2) g += `<text x="${X(yr).toFixed(1)}" y="162" font-size="8" fill="#8A8390" text-anchor="middle">${yr}</text>`;
  g += `<rect x="${X(2021.5).toFixed(1)}" y="8" width="${(X(2022.5) - X(2021.5)).toFixed(1)}" height="142" fill="#FCE8EC" opacity=".7"/><text x="${X(2022).toFixed(1)}" y="17" font-size="7.5" fill="#C8102E" text-anchor="middle" font-weight="700">${t('Kejatuhan 2022', '2022 crash')}</text>`;
  const line = (pts, col, w) => `<polyline points="${pts.map(([a, b]) => X(a).toFixed(1) + ',' + Y(b).toFixed(1)).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  g += line(DATA.chart.blue, '#1F3B73', 2) + line(DATA.chart.gold, '#C99A2E', 2) + line(DATA.chart.green, '#0E8A7E', 3);
  return `<svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:Inter">${g}</svg>`;
}

function pitchSVG(defLabel) {
  return `<svg viewBox="0 0 600 118" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;font-family:Poppins">
<defs><pattern id="stripes" width="60" height="118" patternUnits="userSpaceOnUse"><rect width="30" height="118" fill="#2E8B57"/><rect x="30" width="30" height="118" fill="#2A8150"/></pattern>
<marker id="ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#FFD7DD"/></marker></defs>
<rect width="600" height="118" fill="url(#stripes)"/>
<g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5"><rect x="8" y="6" width="584" height="106"/><line x1="300" y1="6" x2="300" y2="112"/><circle cx="300" cy="59" r="18"/><rect x="8" y="30" width="46" height="58"/><rect x="546" y="30" width="46" height="58"/><rect x="592" y="46" width="6" height="26"/></g>
<g font-size="11" font-weight="700" text-anchor="middle">
<circle cx="42" cy="56" r="14" fill="#F2C94C" stroke="#fff" stroke-width="2"/><text x="42" y="60" fill="#1E1B22">1</text>
<circle cx="160" cy="56" r="14" fill="#1F3B73" stroke="#fff" stroke-width="2"/><text x="160" y="60" fill="#fff">2</text>
<circle cx="250" cy="32" r="14" fill="#1F3B73" stroke="#fff" stroke-width="2"/><text x="250" y="36" fill="#fff">3</text>
<circle cx="250" cy="84" r="14" fill="#1F3B73" stroke="#fff" stroke-width="2"/><text x="250" y="88" fill="#fff">4</text>
<circle cx="455" cy="56" r="21" fill="none" stroke="#FFD7DD" stroke-width="2" stroke-dasharray="4 3"/>
<circle cx="455" cy="56" r="14" fill="#C8102E" stroke="#fff" stroke-width="2"/><text x="455" y="60" fill="#fff">9</text></g>
<line x1="480" y1="56" x2="532" y2="56" stroke="#FFD7DD" stroke-width="2" marker-end="url(#ar)"/>
<g font-size="8.5" fill="#fff" text-anchor="middle" font-weight="600">
<text x="42" y="84">${t('Penjaga gol', 'Goalkeeper')}</text><text x="160" y="84">${esc(defLabel)}</text>
<text x="250" y="15">${t('Tengah · konsisten', 'Midfield · steady')}</text><text x="250" y="108">${t('Tengah · pelindung nilai', 'Midfield · store of value')}</text>
<text x="455" y="92">${t('Penyerang global', 'Global striker')}</text></g>
<text x="455" y="24" font-size="8" fill="#FFD7DD" text-anchor="middle" font-weight="700">${t('REZEKI ISI POSISI INI', 'REZEKI FILLS THIS SPOT')}</text>
</svg>`;
}

function rezekiInputs() {
  const s = S.r, p = PLANS[s.plan];
  const basic = num(s.basic), saver = num(s.saver), adhoc = num(s.adhoc);
  const saverYears = s.saverYears === '' ? p.term : Math.min(20, Math.round(num(s.saverYears)));
  return { s, p, basic, saver, adhoc, saverYears, age: Math.round(num(s.age)) };
}

function renderRezeki() {
  const { s, p, basic, saver, adhoc, saverYears, age } = rezekiInputs();
  const lg = L();
  const name = esc(s.name.trim() || t('Pelanggan', 'Client'));
  const edu = s.use === 'edu';
  const child = esc(s.child.trim() || s.name.trim() || t('anak', 'your child'));
  const tlAge = edu && s.childAge !== '' ? Math.round(num(s.childAge)) : age;
  const res = SCEN.map(sc => ({ ...sc, r: runRezeki(s.plan, basic, saver, saverYears, adhoc, sc.rate) }));
  const T = res[1].r;
  const n = p.term, matAge = tlAge + 20, lastAge = tlAge + n;
  const annual = basic + saver;
  const at20 = edu ? t('tahun ke-20', 'year 20') : t(`umur ${matAge}`, `age ${matAge}`);

  // hero
  let tag, h1;
  if (s.use === 'retire') { tag = t('Pelan Persaraan Usahawan', 'Retirement Plan for Business Owners'); h1 = t(`KWSP sendiri untuk usahawan.<br><span>Pelan ${name}, ${tlAge} → ${matAge}.</span>`, `Your own EPF, built for business owners.<br><span>${name}'s plan, ${tlAge} → ${matAge}.</span>`); }
  else if (edu) { tag = t('Dana Pendidikan Anak', "Children's Education Fund"); h1 = t(`Dana universiti ${child}.<br><span>Mula umur ${tlAge}, matang umur ${matAge}.</span>`, `${child}'s university fund.<br><span>Start at age ${tlAge}, matures at ${matAge}.</span>`); }
  else { tag = t('Pelan Simpanan &amp; Pelaburan', 'Savings &amp; Investment Plan'); h1 = t(`Simpan hari ini, rezeki berkembang esok.<br><span>Pelan ${name}, ${tlAge} → ${matAge}.</span>`, `Save today, let it grow for tomorrow.<br><span>${name}'s plan, ${tlAge} → ${matAge}.</span>`); }
  const tlWho = edu ? child : name;

  // lineup
  const def = s.use === 'retire'
    ? { pl: t('Pertahanan', 'Defender'), tl: 'KWSP / i-Saraan', jb: t('Asas persaraan. Usahawan tiada caruman majikan, jadi claim padanan kerajaan i-Saraan dulu.', 'Retirement foundation. Business owners get no employer contribution, so claim the i-Saraan government match first.'), to: t('Had padanan kecil (Bajet 2026: RM500/thn).', 'Small match cap (Budget 2026: RM500/yr).') }
    : edu
      ? { pl: t('Pertahanan', 'Defender'), tl: 'SSPN', jb: t('Simpanan pendidikan dengan pelepasan cukai sendiri (YA2026: sehingga RM8,000; sahkan LHDN).', 'Education savings with its own tax relief (YA2026: up to RM8,000; confirm with LHDN).'), to: t('Pulangan stabil, pertumbuhan sederhana.', 'Steady returns, moderate growth.') }
      : { pl: t('Pertahanan', 'Defender'), tl: 'KWSP', jb: t('Asas persaraan wajib. Dividen stabil setiap tahun.', 'Your compulsory retirement base. Steady yearly dividends.'), to: t('Kebanyakannya dikunci hingga umur 55.', 'Mostly locked until 55.') };
  const ck = on => `<div class="ck"><i class="${on ? 'on' : ''}"></i>${t('Dah ada', 'Already have')}</div>`;

  // death section
  const dm = s.deathMode;
  const dRows = s.death.map(d => ({ y: Math.round(num(d.y)) || 0, v: num(d.v) })).filter(d => d.y > 0);
  const filled = dRows.filter(d => d.v > 0);
  let card4;
  if (dm === 'values' && filled.length) {
    const last = filled.reduce((a, b) => (b.y > a.y ? b : a));
    card4 = `<div class="card"><div class="k">${t('Perlindungan kematian / TPD', 'Death / TPD cover')}</div><div class="big">${RMk(last.v)}</div><div class="sub">${t(`Pada tahun ${last.y}${age ? ` (umur ${age + last.y})` : ''}, ikut PI. TPD hingga umur 70.`, `At year ${last.y}${age ? ` (age ${age + last.y})` : ''}, per PI. TPD to age 70.`)}</div></div>`;
  } else {
    card4 = `<div class="card"><div class="k">${t('Perlindungan kematian / TPD', 'Death / TPD cover')}</div><div class="big" style="font-size:13pt;margin-top:1mm">${t('Ikut PI', 'Per PI')}</div><div class="sub">${t('Sepanjang 20 tahun. Jumlah tepat dalam Ilustrasi Produk. TPD hingga umur 70.', 'For 20 years. Exact amounts in the Product Illustration. TPD to age 70.')}</div></div>`;
  }
  const model = t('Model: 25% caruman asas + Saver-i (95% diperuntukkan) dilabur dalam ADSE; Investment Booster dikreditkan sebagai unit; pertumbuhan selepas fi ikut kadar senario. Ilustrasi sahaja, tidak dijamin; angka muktamad ikut PI.', 'Model: 25% of basic contribution + Saver-i (95% allocated) invested in ADSE; Investment Boosters credited as units; net-of-fee growth at the scenario rate. Illustrations only, not guaranteed; final figures per PI.');
  let sec3 = '';
  if (dm !== 'hide') {
    const cards = dRows.slice(0, 4).map((d, i, arr) => {
      const hi = i === arr.length - 1 ? ' hi' : '';
      const v = dm === 'values' && d.v > 0 ? `<div class="v">${RM(d.v)}</div>` : `<div class="v blank">RM ______</div>`;
      const dd = dm === 'values' && d.v > 0 ? t('Ikut Ilustrasi Produk', 'Per Product Illustration') : t('Isi daripada PI', 'Fill in from PI');
      return `<div class="dc${hi}"><div class="yr">${t('Tahun', 'Year')} ${d.y}${age ? ` · ${t('umur', 'age')} ${age + d.y}` : ''}</div>${v}<div class="d">${dd}</div></div>`;
    }).join('');
    sec3 = `<div class="sec"><div class="n">3</div><h2>${t('Perlindungan sepanjang 20 tahun', 'Protection for 20 years')}</h2><div class="hint">${t('Manfaat kematian / TPD · ikut PI', 'Death / TPD benefit · per PI')}</div></div>
    <div class="death">${cards}</div>
    <div class="mini">${t('Manfaat kematian/TPD seperti dalam jadual Ilustrasi Produk (PI). TPD hingga umur 70.', 'Death/TPD benefit as shown in the Product Illustration (PI) table. TPD to age 70.')} ${model}</div>`;
  }

  // boosters
  const maxIb = Math.max(...T.ibs, 1);
  const bars = T.ibs.map((ib, i) => {
    const y = i + 1;
    if (y === 20) return `<div class="bar mat"><span>${kk(T.mat)}+${kk(T.sav)}</span><i style="height:100%"></i></div>`;
    if (!ib) return `<div class="bar"><span></span><i style="height:0"></i></div>`;
    const tier = p.tiers.findIndex(([a, b]) => y >= a && y <= b) + 1;
    return `<div class="bar t${tier}"><span>${kk(ib)}</span><i style="height:${(ib / maxIb * 18).toFixed(1)}%"></i></div>`;
  }).join('');
  const tcol = ['#F2A6B2', 'var(--acc)', 'var(--deep)'];
  const legend = p.tiers.map(([a, b, r], i) => `<span><i style="background:${tcol[i]}"></i>${t('Thn', 'Yr')} ${a}–${b}: ${pct(r)} = ${RM(basic * r)}</span>`).join('') +
    `<span><i style="background:var(--gold)"></i>${t('Thn', 'Yr')} 20: Maturity ${pct(p.mat)} + Savings ${pct(p.sav)}</span>`;
  const fundSub = saver || adhoc ? t(`termasuk Saver-i + unit booster ${RMk(T.ibTotal)}`, `incl. Saver-i + ${RMk(T.ibTotal)} booster units`) : t(`termasuk unit booster ${RMk(T.ibTotal)}`, `incl. ${RMk(T.ibTotal)} booster units`);

  // snapshot
  const sameYears = !saver || saverYears === n;
  const sub1 = sameYears
    ? t(`≈ <b>${RM(annual / 12)} / bulan</b> untuk ${n} tahun sahaja`, `≈ <b>${RM(annual / 12)} / month</b> for ${n} years only`)
    : t(`Asas ${n} thn · Saver-i ${saverYears} thn`, `Basic ${n} yrs · Saver-i ${saverYears} yrs`);
  const split = saver ? `<div class="split2"><span>${t('Pelan asas', 'Basic plan')}<b>${RM(basic)}</b></span><span>${t('Tambahan Saver-i', 'Saver-i top-up')}<b>${RM(saver)}</b></span></div>` : '';
  const paidParts = [t(`Asas ${RM(basic * n)}`, `Basic ${RM(basic * n)}`)];
  if (saver) paidParts.push(`Saver-i ${RM(saver * saverYears)}`);
  if (adhoc) paidParts.push(t(`ad hoc ${RM(adhoc)}`, `ad hoc ${RM(adhoc)}`));
  const pills = `<span class="pill">A-Enrich Rezeki · ${s.plan}</span>${saver ? '<span class="pill">+ A-Plus Saver-i</span>' : ''}<span class="pill o">AIA PUBLIC Takaful Bhd.</span>`;

  const look = DATA.adse.look.map(([nm, v]) => `<div class="row"><span>${nm}</span><div class="b" style="width:${(v / 4.3 * 34).toFixed(1)}mm"></div><em>${v}%</em></div>`).join('');
  const perf = DATA.adse.perf.map(x => `<div${x.hl ? ' class="hl2"' : ''}><div class="p">${x.p}</div><div class="l">${x.l[lg]}</div><div class="bm">${x.b[lg]}</div></div>`).join('');

  return `<div class="doc tC lang-${S.lang}${dm === 'hide' ? ' nodeath' : ''}">
<section class="page">
  <div class="hero" style="padding:6mm 12mm 5mm">
    <div class="tag">${tag}</div>
    <h1>${h1}</h1>
    <div class="plans">${pills}</div>
    <div class="agebar">
      <div class="k">${t(`Garis masa ${tlWho}`, `${tlWho}'s timeline`)}</div>
      <div class="ages"><div><b>${tlAge}</b><small>${t('Mula', 'Start')}</small></div><div><b>${lastAge}</b><small>${t('Bayaran akhir', 'Last payment')}</small></div><div><b>${matAge}</b><small>${t('Matang', 'Maturity')}</small></div></div>
      <div class="track" style="background:linear-gradient(90deg,#fff 0 ${n * 5}%,rgba(255,255,255,.35) ${n * 5}% 100%)"></div>
      <div class="trackl"><span>${t(`Bayar ${n} thn`, `Pay ${n} yrs`)}</span><span>${t(`Berkembang ${20 - n} tahun`, `Grow ${20 - n} years`)}</span></div>
    </div>
  </div>
  <div class="pad">
    <div class="sec"><div class="n">1</div><h2>${t(`Pasukan kewangan ${name}`, `${name}'s financial team`)}</h2><div class="hint">${t('Setiap alat ada posisi sendiri', 'Every tool plays its own position')}</div></div>
    <div class="tagline">${t('Bukan soal siapa lagi bagus. Soal siapa main posisi apa. ⚽', "It's not about which is better. It's about who plays which position. ⚽")}</div>
    <div class="pitchwrap">${pitchSVG(def.pl)}</div>
    <div class="lineup">
      <div class="pos"><div class="pl">1 · ${t('Penjaga gol', 'Goalkeeper')}</div><div class="tl">${t('Dana kecemasan + takaful perlindungan', 'Emergency fund + protection takaful')}</div><div class="jb">${t('Selamatkan bila sakit, kemalangan atau bisnes slow.', 'Saves the day when illness, accidents or slow business hit.')}</div><div class="to">${t('Bukan untuk berkembang.', 'Not built to grow.')}</div>${ck(s.have.gk)}</div>
      <div class="pos"><div class="pl">2 · ${def.pl}</div><div class="tl">${def.tl}</div><div class="jb">${def.jb}</div><div class="to">${def.to}</div>${ck(s.have.df)}</div>
      <div class="pos"><div class="pl">3 · ${t('Tengah', 'Midfield')}</div><div class="tl">ASB / ASNB</div><div class="jb">${t('Enjin konsisten: dividen stabil, mudah dikeluarkan.', 'Steady engine: stable dividends, easy to withdraw.')}</div><div class="to">${t('Tertumpu di pasaran Malaysia.', 'Concentrated in Malaysia.')}</div>${ck(s.have.m1)}</div>
      <div class="pos"><div class="pl">4 · ${t('Tengah', 'Midfield')}</div><div class="tl">${t('Emas', 'Gold')}</div><div class="jb">${t('Pelindung nilai bila ringgit atau ekonomi goyang.', 'Stores value when the ringgit or economy wobbles.')}</div><div class="to">${t('Tiada dividen; nilai ikut harga emas.', 'No dividends; value follows the gold price.')}</div>${ck(s.have.m2)}</div>
      <div class="pos fw"><div class="pl">9 · ${t('Penyerang global', 'Global striker')}</div><div class="tl">A-Enrich Rezeki (ADSE)</div><div class="jb">${t('Cari pertumbuhan di pasaran dunia + perlindungan + disiplin 20 tahun + boosters.', 'Hunts growth in world markets + protection + 20-year discipline + boosters.')}</div><div class="to">${t('Nilai naik turun; komitmen jangka panjang.', 'Value goes up and down; long-term commitment.')}</div><div class="ck">★ ${t('Posisi yang biasanya kosong', 'The position most people leave empty')}</div></div>
    </div>
    <div class="snap" style="padding:3.5mm 0 0">
      <div class="card"><div class="k">${t('Caruman tahunan', 'Annual contribution')}</div><div class="big">${RM(annual)}<small> / ${t('thn', 'yr')}</small></div><div class="sub">${sub1}</div>${split}</div>
      <div class="card"><div class="k">${t('Jumlah anda bayar', 'Total you put in')}</div><div class="big">${RMk(T.paid)}</div><div class="sub">${paidParts.join(' + ')}</div></div>
      <div class="card"><div class="k">${t(`Unjuran ${at20} · trend 8%`, `Projected at ${at20} · trend 8%`)}</div><div class="big" style="color:var(--teal)">${RMk(T.total)}</div><div class="sub">${t(`<b>${T.mult.toFixed(2)}×</b> jumlah dibayar · ≈<b>${T.irr.toFixed(1)}%/thn</b> (IRR). Tidak dijamin.`, `<b>${T.mult.toFixed(2)}×</b> what you put in · ≈<b>${T.irr.toFixed(1)}%/yr</b> (IRR). Not guaranteed.`)}</div></div>
      ${card4}
    </div>
    <div class="sec"><div class="n">2</div><h2>${t(`3 senario pada ${at20}`, `3 scenarios at ${at20}`)}</h2><div class="hint">${t(`Jumlah dibayar ${RM(T.paid)} · pertumbuhan dana selepas fi`, `Total ${RM(T.paid)} paid · net-of-fee fund growth`)}</div></div>
    <div class="scen">${res.map((x, i) => `<div class="sc${i === 1 ? ' mid' : ''}"><div class="nm">${x.nm[lg]}${i === 1 ? ` <span class="badge2">${t('Kes asas', 'Base case')}</span>` : ''}</div><div class="rt">${x.rt[lg]}</div><div class="tv"${i === 0 ? ' style="color:#4A5568"' : i === 2 ? ' style="color:var(--red)"' : ''}>${RM(x.r.total)}</div><div class="mx"><span>${t('Gandaan', 'Multiple')}<b>${x.r.mult.toFixed(2)}×</b></span><span>IRR<b>${x.r.irr.toFixed(1)}%/${t('thn', 'yr')}</b></span></div></div>`).join('')}</div>
    ${sec3 || `<div class="mini" style="margin-top:2mm">${model}</div>`}
  </div>
  ${footer1().replace(t('Muka surat 1 / 2', 'Page 1 of 2'), t('Muka surat 1 / 2 · Ilustrasi; angka muktamad ikut PI.', 'Page 1 of 2 · Illustrative; final figures per PI.'))}
</section>

<section class="page">
  <div class="pad p2top">
    <div class="sec" style="margin-top:0"><div class="n">4</div><h2>${t('Rezeki boosters — naik setiap tahun', 'Rezeki boosters that climb every year')}</h2><div class="hint">${s.plan} · ${t(`% caruman asas tahunan ${RM(basic)}`, `% of basic annual contribution ${RM(basic)}`)}</div></div>
    <div class="boost">
      <div class="chartbox">
        <div class="k" style="color:var(--red)">${t('Investment Booster dikreditkan setiap tahun sebagai unit dana · Maturity + Savings Booster pada tahun 20', 'Investment Booster credited yearly as fund units · Maturity + Savings Booster at year 20')}</div>
        <div class="bars">${bars}</div>
        <div class="xl">${Array.from({ length: 20 }, (_, i) => `<span>${i === 0 ? t('T1', 'Y1') : i === 19 ? t('T20', 'Y20') : i + 1}</span>`).join('')}</div>
        <div class="legend">${legend}</div>
      </div>
      <div class="stack">
        <div class="k" style="color:#E7C9CF">${t(`${edu ? 'Tahun 20' : 'Umur ' + matAge} · senario trend 8%`, `${edu ? 'Year 20' : 'At ' + matAge} · trend scenario 8%`)}</div>
        <h3>${t('Susunan nilai matang', 'The maturity stack')}</h3>
        <div class="layer l1"><span>Maturity Booster · ${pct(p.mat)}</span><b>${RM(T.mat)}</b></div>
        <div class="layer l2"><span>Savings Booster · ${pct(p.sav)}*</span><b>${RM(T.sav)}</b></div>
        <div class="layer l3"><span>${t('Nilai Dana Pelaburan', 'Investment Fund value')}<br><span style="opacity:.75">${fundSub}</span></span><b>${RM(T.fund)}</b></div>
        <div class="layer l4"><span>+ Vitality Booster (${t('dari', 'from')} ≈${RM(basic * 0.2)})</span><b style="font-size:8.5pt">Bonus</b></div>
        <div class="tot"><span style="font-size:7.6pt;opacity:.85">${t('Jumlah unjuran', 'Projected total')}</span><b>${RM(T.total)}</b></div>
        <div class="note">${t('*Hanya jika semua caruman dibayar tepat masa dan tiada pengeluaran Dana Simpanan. Nilai dana tidak dijamin.', '*Only if all contributions are paid on time with no Savings Fund withdrawal. Fund value is not guaranteed.')}</div>
      </div>
    </div>
    <div class="sec"><div class="n">5</div><h2>${t(`Penyerang ${name}: ADSE = Sauh ⚓ + Roket 🚀`, `${name}'s striker: ADSE = Anchor ⚓ + Rocket 🚀`)}</h2><div class="hint">${t(`Fact sheet AIA setakat ${DATA.asOf.adse}`, `AIA fact sheet as at ${DATA.asOf.adse}`)}</div></div>
    <div class="ar">
      <div class="fc anchor"><div class="ic">⚓</div><div class="k">${t('Sauh', 'The anchor')}</div><h3>A-Dana Equity</h3><div class="pct">${DATA.adse.anchor}%</div><p>${t('Saham utama patuh Syariah Malaysia. Lebih stabil, tempatan.', 'Malaysian Shariah blue chips. Steadier, local.')}</p></div>
      <div class="fc rocket"><div class="ic">🚀</div><div class="k">${t('Roket', 'The rocket')}</div><h3>HSBC Islamic Global Equity Index</h3><div class="pct">${DATA.adse.rocket}%</div><p>${t('Gergasi teknologi global patuh Syariah. Tumbuh lebih laju, turun naik lebih besar (USD).', 'Global Shariah Big Tech. Higher growth, bigger swings (USD-based).')}</p></div>
      <div class="lt"><div class="k" style="color:#A87B1A">${t('Pandangan dalam · gergasi teknologi dunia dalam ADSE', 'Look-through · global tech giants in ADSE')}</div>${look}
        <div class="totl">≈ <b>${t(`RM${DATA.adse.lookTotal} daripada setiap RM100`, `RM${DATA.adse.lookTotal} of every RM100`)}</b> ${t('dalam ADSE berada secara tidak langsung dalam 7 syarikat ini.', 'in ADSE sits indirectly in these 7 companies.')}</div></div>
    </div>
    <div class="chartwrap">
      <div class="cbox">
        <div class="k" style="color:var(--teal)">${t('Kenapa gabung? Sauh vs Roket vs 50:50 · 2014–2024 · asas RM100', 'Why blend? Anchor vs Rocket vs 50:50 · 2014–2024 · RM100 base')}</div>
        ${chartSVG()}
        <div class="lg"><span><i style="background:#1F3B73"></i>A-Dana Equity (${t('sauh', 'anchor')})</span><span><i style="background:#C99A2E"></i>HSBC Islamic Global Equity (${t('roket', 'rocket')})</span><span><i style="background:#0E8A7E"></i>${t('Gabungan 50:50 (seperti ADSE)', '50:50 blend (like ADSE)')}</span></div>
        <div class="mini" style="margin-top:.6mm">${t('Simulasi sejarah dana asas, dilukis semula daripada kajian Mamu. Ilustrasi sahaja: bukan rekod sebenar ADSE, bukan unjuran.', "Historical simulation of the underlying funds, redrawn from Mamu's research. Illustrative only: not ADSE's actual record, not a projection.")}</div>
      </div>
      <div>
        <div class="k" style="color:var(--teal);margin-bottom:1.2mm">${t('ADSE sebenar · selepas fi', 'ADSE actual · net of fees')}</div>
        <div class="pgrid">${perf}</div>
        <div class="mini">${t(`Kes asas 8%/thn dibundarkan daripada rekod sebenar ADSE (≈7.1–7.6%/thn selepas fi; FMC 1.5% sudah termasuk). Pandangan dalam: pegangan utama HSBC (${DATA.asOf.lookthrough}) × wajaran ${DATA.adse.rocket}%; ${name} tidak memiliki saham ini secara langsung. <b>Prestasi lalu bukan petunjuk prestasi masa depan.</b>`, `Base-case 8%/yr is rounded from ADSE's actual 5-year and since-inception record (≈7.1–7.6%/yr after fees). FMC 1.5%/yr is already in NAV returns. Look-through: HSBC fund top holdings (${DATA.asOf.lookthrough.replace('Okt', 'Oct')}) × ADSE's ${DATA.adse.rocket}% weight; ${name} does not own these shares directly. <b>Past performance is not an indication of future performance.</b>`)}</div>
      </div>
    </div>
    <div class="sec"><div class="n">6</div><h2>${t('Perlu tahu', 'Good to know')}</h2></div>
    <div class="terms">
      <div class="box warn"><h3>${t('Syarat penting', 'Key conditions')}</h3><ul>
        <li>${t('Pelan jangka panjang: <b>tiada nilai serahan sehingga caruman 3 tahun</b> dibayar.', 'Long-term plan: <b>no surrender value until 3 years of contributions</b> are paid.')}</li>
        <li>${t('Keluar Dana Simpanan = Savings Booster batal; Dana Pelaburan boleh keluar separa.', 'Savings Fund withdrawal cancels the Savings Booster; Investment Fund allows partial withdrawals.')}</li>
        <li>${t('Nilai dana, termasuk unit booster dan Saver-i, <b>tidak dijamin</b>. ADSE dana berisiko lebih tinggi dengan pendedahan mata wang.', 'Fund values, including booster units and Saver-i, are <b>not guaranteed</b>. ADSE is a higher-risk fund with currency exposure.')}</li>
        <li>${t('Pelan tetap 20 tahun, bukan pencen seumur hidup. Caj ikut PI.', 'Fixed 20-year plan, not a lifelong pension. Charges per PI.')}</li>
      </ul></div>
      <div class="box tax"><div class="k">${t('Kelebihan tambahan', 'Extra perks')}</div><ul>
        <li>${t('Tiada pemeriksaan perubatan sehingga RM50,000/thn', 'No medical check-up up to RM50,000/yr')}</li>
        <li>${t(`Vitality Booster: bermula 20% caruman tahunan (≈${RM(basic * 0.2)}), naik ikut status AIA Vitality, maks 200%`, `Vitality Booster: starts at 20% of annual contribution (≈${RM(basic * 0.2)}), grows with AIA Vitality status, max 200%`)}</li>
        <li>${t('Mungkin layak pelepasan cukai insurans hayat / takaful keluarga (YA2026: sehingga RM3,000, ikut LHDN)', 'May qualify for life insurance / family takaful tax relief (YA2026: up to RM3,000, per LHDN)')}</li>
        <li>${t('Patuh Syariah · tempoh bertenang 15 hari', 'Shariah-compliant · 15-day free-look')}</li>
      </ul></div>
    </div>
  </div>
  <div class="foot"><span><b>${t('Penting:', 'Important:')}</b> ${t('Ilustrasi sahaja, bukan sijil takaful. Manfaat, caj dan pengecualian ikut Ilustrasi Produk, PDS dan sijil; tertakluk underwriting. Unjuran dan simulasi tidak dijamin. Prestasi lalu bukan petunjuk masa depan. Alat lain disebut untuk ilustrasi peranan sahaja, bukan nasihat. AIA PUBLIC Takaful Bhd. ahli PIDM.', 'Summary for illustration only, not a takaful certificate. Benefits, charges and exclusions per Product Illustration, PDS and certificate; subject to underwriting. Projections and simulations are not guaranteed. Past performance is not an indication of future performance. Mention of other savings tools is for illustration of roles only, not advice on them. AIA PUBLIC Takaful Bhd. is a member of PIDM.')}</span><span style="white-space:nowrap">${t('Muka surat 2 / 2', 'Page 2 of 2')}</span></div>
</section></div>`;
}

/* ---------------- validation ---------------- */
function warnings() {
  const w = [];
  if (S.prod === 'idaman') {
    const s = S.i, ps = s.persons.filter(p => p.name.trim() || num(p.m));
    if (!ps.length) w.push('Masukkan sekurang-kurangnya seorang (nama + caruman bulanan).');
    ps.forEach(p => { if (!num(p.m)) w.push(`Caruman bulanan ${p.name || '?'} kosong.`); if (!p.name.trim()) w.push('Ada orang tanpa nama.'); });
    if (!num(s.sum)) w.push('Jumlah perlindungan Kematian/TPD kosong.');
    if (!DATA.hospitals[s.state]) w.push('Tiada hospital panel dalam senarai AIA untuk negeri ini — proposal tunjuk nota "semak app AIA+".');
    else if (Array.isArray(s.hosp) && hospChosen(s).length > MAX_HOSP) w.push(`Hanya ${MAX_HOSP} hospital pertama dipaparkan (muat 1 muka surat). Kurangkan pilihan.`);
  } else {
    const { s, p, basic, saver, saverYears, age } = rezekiInputs();
    if (!s.name.trim()) w.push('Nama pelanggan kosong.');
    if (!age) w.push('Umur kosong.');
    if (!basic) w.push('Caruman asas kosong.');
    else if (basic < p.min) w.push(`Caruman asas bawah minimum ${s.plan} (RM${p.min.toLocaleString('en-US')}/thn).`);
    if (basic + saver > 50000) w.push('Caruman tahunan melebihi RM50,000: mungkin perlu pemeriksaan perubatan. Kad "Extra perks" masih sebut had RM50k; semak.');
    if (saver && !(saverYears > 0)) w.push('Saver-i tahun = 0; Saver-i tidak dikira.');
    if (s.use === 'edu' && s.childAge === '') w.push('Umur anak kosong: garis masa guna umur orang dilindungi.');
    if (s.deathMode === 'values' && !s.death.some(d => num(d.v))) w.push('Seksyen 3 mod "Isi dari PI" tapi tiada nilai dimasukkan.');
  }
  return w;
}

/* ---------------- render + preview ---------------- */
let rT = 0;
function schedule() { clearTimeout(rT); rT = setTimeout(render, 120); }
function render() {
  const doc = $('#doc');
  doc.innerHTML = S.prod === 'idaman' ? renderIdaman() : renderRezeki();
  tight = 0;
  fitPreview();
  requestAnimationFrame(() => setTimeout(checkLayout, 60));
}
let tight = 0;
function overflowPages() {
  const over = [];
  $$('#doc .page').forEach((pg, i) => {
    const f = pg.querySelector('.foot'); if (!f) return;
    const ft = f.getBoundingClientRect().top; let m = 0;
    pg.querySelectorAll('*').forEach(e => { if (e.closest('.foot')) return; const r = e.getBoundingClientRect(); if (r.height && r.bottom > m) m = r.bottom; });
    if (m > ft + 0.5) over.push(i + 1);
  });
  return over;
}
function checkLayout() {
  const w = warnings();
  let over = overflowPages();
  const d = $('#doc .doc');
  while (over.length && tight < 3 && d) { tight++; d.classList.add('tight' + tight); over = overflowPages(); }
  if (over.length) w.push(`Muka surat ${over.join(', ')} terlebih isi (bertindih footer). Pendekkan nama/hubungan atau kurangkan orang.`);
  const box = $('#warn');
  if (w.length) { box.className = 'warnbox show'; box.innerHTML = '<b>Semak dulu:</b><br>• ' + w.map(esc).join('<br>• '); }
  else { box.className = 'warnbox show okbox'; box.innerHTML = '<b>✓ Sedia untuk PDF.</b> Semak angka caruman dengan SQS sekali lagi.'; }
  $('#status').textContent = (S.prod === 'idaman' ? 'A-Life Idaman + Health360-i' : 'A-Enrich Rezeki') + ' · ' + (S.lang === 'bm' ? 'Bahasa Melayu' : 'English') + ' · 2 muka surat A4';
}
let zoomBig = false;
function fitPreview() {
  const main = $('#main'), doc = $('#doc');
  const avail = main.clientWidth - (window.innerWidth <= 980 ? 24 : 40);
  const fit = Math.min(1.25, Math.max(0.3, avail / 793.7));
  const z = zoomBig && fit < 0.85 ? 0.85 : fit;
  doc.style.zoom = z;
  main.style.overflowX = z > fit ? 'auto' : '';
  const zb = $('#zoomBtn'); if (zb) zb.textContent = zoomBig ? '↔ Muat skrin' : '🔍 Besarkan';
}

/* ---------------- form binding ---------------- */
function syncForm() {
  $$('#panel [data-k]').forEach(el => {
    const v = getK(el.dataset.k);
    if (el.type === 'checkbox') el.checked = !!v; else if (document.activeElement !== el) el.value = v ?? '';
  });
  $$('#panel [data-pick]').forEach(g => { const v = String(getK(g.dataset.pick)); g.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === v)); });
  $('#prodSel').value = S.prod;
  $('#prodDesc').textContent = S.prod === 'idaman' ? 'Takaful keluarga + kad perubatan · 2 muka surat' : 'Simpanan + pelaburan 20 tahun · 2 muka surat';
  $$('#langSeg button').forEach(b => b.classList.toggle('on', b.dataset.lang === S.lang));
  $('#formIdaman').classList.toggle('hide', S.prod !== 'idaman');
  $('#formRezeki').classList.toggle('hide', S.prod !== 'rezeki');
  $('#eduRow').classList.toggle('hide', S.r.use !== 'edu');
  buildHospUI();
  $('#deathInputs').classList.toggle('hide', S.r.deathMode !== 'values');
  $('#dfLabel').textContent = S.r.use === 'retire' ? 'KWSP / i-Saraan' : S.r.use === 'edu' ? 'SSPN' : 'KWSP';
  $('[data-k="r.saverYears"]').placeholder = 'ikut tempoh (' + PLANS[S.r.plan].term + ')';
  document.documentElement.lang = S.lang === 'bm' ? 'ms' : 'en';
}
function buildHospUI() {
  const s = S.i, areas = DATA.areas[s.state];
  $('#areaRow').classList.toggle('hide', !areas);
  if (areas) $('#areaPick').innerHTML = [['all', 'Semua']].concat(areas.map(a => [a[0], a[1]])).map(([v, l]) => `<button data-v="${v}" class="${s.area === v ? 'on' : ''}">${l}</button>`).join('');
  const pool = hospPool(s), chosen = new Set(hospChosen(s).map(h => h.nm));
  $('#hospCount').textContent = DATA.hospitals[s.state] ? `${chosen.size} dipilih daripada ${pool.length}` : 'tiada senarai';
  $('#hospList').innerHTML = pool.map(h => `<label class="chk"><input type="checkbox" data-hosp="${esc(h.nm)}"${chosen.has(h.nm) ? ' checked' : ''}><span>${esc(h.nm)} <small style="color:${h.s ? 'var(--red)' : 'var(--muted)'};font-weight:700">${h.s ? 'SMART' : 'umum'}</small></span></label>`).join('') || '<div class="hint">Tiada hospital untuk tapisan ini.</div>';
}
function buildPersons() {
  const box = $('#persons');
  box.innerHTML = S.i.persons.map((p, i) => `<div class="person">
    <label class="f"><span>Nama</span><input data-pk="${i}.name" value="${esc(p.name)}" placeholder="${i ? 'Nama' : 'Khairil'}"></label>
    <label class="f"><span>Hubungan</span><select data-pk="${i}.rel">${RELS.map(r => `<option value="${r[0]}"${p.rel === r[0] ? ' selected' : ''}>${r[1]}</option>`).join('')}</select></label>
    <label class="f"><span>RM / bulan</span><input data-pk="${i}.m" value="${esc(p.m)}" inputmode="decimal" placeholder="166"></label>
    <button class="x" data-del="${i}" aria-label="Buang" ${S.i.persons.length < 2 ? 'disabled style="opacity:.3"' : ''}>×</button></div>`).join('');
  $('#addPerson').disabled = S.i.persons.length >= 4;
  $('#addPerson').style.opacity = S.i.persons.length >= 4 ? .4 : 1;
}
function buildDeath() {
  $('#deathRows').innerHTML = S.r.death.map((d, i) => `<div class="death">
    <input data-dk="${i}.y" value="${esc(d.y)}" inputmode="numeric" aria-label="Tahun">
    <input data-dk="${i}.v" value="${esc(d.v)}" inputmode="numeric" placeholder="RM dari PI" aria-label="Nilai"></div>`).join('');
}
function saveAgent() { try { localStorage.setItem('ps_agent', JSON.stringify(S.a)); } catch (e) {} }

function toast(msg, ms = 5000) { const el = $('#toast'); el.innerHTML = msg; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), ms); }

function init() {
  const panel = $('#panel');
  panel.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.k) { setK(el.dataset.k, el.type === 'checkbox' ? el.checked : el.value); if (el.dataset.k.startsWith('a.')) saveAgent(); if (el.dataset.k === 'i.state') { S.i.area = 'all'; S.i.hosp = null; syncForm(); } }
    else if (el.dataset.pk) { const [i, k] = el.dataset.pk.split('.'); S.i.persons[+i][k] = el.value; }
    else if (el.dataset.dk) { const [i, k] = el.dataset.dk.split('.'); S.r.death[+i][k] = el.value; }
    else return;
    schedule();
  });
  $('#prodSel').addEventListener('change', e => { S.prod = e.target.value; syncForm(); render(); });
  panel.addEventListener('change', e => {
    if (e.target.type === 'checkbox' && e.target.dataset.k) { setK(e.target.dataset.k, e.target.checked); schedule(); }
    if (e.target.dataset.hosp !== undefined) { S.i.hosp = $$('#hospList [data-hosp]').filter(x => x.checked).map(x => x.dataset.hosp); buildHospUI(); schedule(); }
  });
  panel.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const g = b.closest('[data-pick]');
    if (g) { e.preventDefault(); setK(g.dataset.pick, b.dataset.v); if (['i.area', 'i.ptype'].includes(g.dataset.pick)) S.i.hosp = null; syncForm(); render(); return; }
    if (b.dataset.del !== undefined) { S.i.persons.splice(+b.dataset.del, 1); buildPersons(); render(); return; }
    if (b.id === 'addPerson') { if (S.i.persons.length < 4) S.i.persons.push({ name: '', rel: 'spouse', m: '' }); buildPersons(); render(); return; }
    if (b.id === 'sampleBtn') { loadSample(); return; }
    if (b.id === 'clearBtn') { const a = S.a, l = S.lang, p = S.prod; S = blankState(); S.a = a; S.lang = l; S.prod = p; buildPersons(); buildDeath(); syncForm(); render(); toast('Borang dikosongkan.', 2000); return; }
  });
  $('#langSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.lang = b.dataset.lang; syncForm(); render(); });
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#tabs button').forEach(x => x.classList.toggle('on', x === b));
    $('#body').className = 'body ' + (b.dataset.tab === 'form' ? 'show-form' : 'show-prev');
    fitPreview();
  });
  $('#printBtn').addEventListener('click', doPrint);
  $('#zoomBtn').addEventListener('click', () => { zoomBig = !zoomBig; fitPreview(); });
  window.addEventListener('resize', () => { clearTimeout(window._rz); window._rz = setTimeout(fitPreview, 100); });
  window.addEventListener('beforeprint', () => { $('#doc').style.zoom = 1; });
  window.addEventListener('afterprint', fitPreview);
  $('#asof').innerHTML = `<b>Data dalam app ini</b><br>ADSE fact sheet: ${DATA.asOf.adse} · Look-through: ${DATA.asOf.lookthrough}<br>Panel hospital AIA: semua negeri (berkuat kuasa ${DATA.asOf.panel}) · Manfaat produk: ${DATA.asOf.products} · Kontrak Idaman: ${DATA.asOf.idamanContract}<br>Kematian/TPD Rezeki: manual (formula belum disahkan).`;
  $('#stateSel').innerHTML = DATA.states.map(([k, bm]) => { const d = DATA.hospitals[k]; return `<option value="${k}">${bm}${!d ? ' · tiada senarai' : ''}</option>`; }).join('');
  buildPersons(); buildDeath(); syncForm(); render();
}

function doPrint() {
  const w = warnings();
  const nm = S.prod === 'idaman' ? (S.i.family || (S.i.persons[0] || {}).name || 'Client') : (S.r.name || 'Client');
  const prod = S.prod === 'idaman' ? 'Takaful_Proposal' : 'ARezeki_' + S.r.plan;
  const old = document.title;
  document.title = `${nm.trim().replace(/\s+/g, '_')}_${prod}_${S.lang.toUpperCase()}`;
  $('#doc').style.zoom = 1;
  if (w.length) toast('⚠️ Ada perkara belum lengkap (lihat kotak "Semak dulu"). PDF tetap dibuka.', 4000);
  setTimeout(() => {
    window.print();
    setTimeout(() => { document.title = old; fitPreview(); }, 500);
  }, 150);
  if (!w.length) toast('Dalam tetingkap cetak: pilih <b>Save as PDF</b>, Margins <b>None</b>, hidupkan <b>Background graphics</b>. Di iPad: tekan Share → Save to Files.', 7000);
}

function loadSample() {
  if (S.prod === 'idaman') {
    Object.assign(S.i, { family: 'Khairil', persons: [{ name: 'Khairil', rel: 'self', m: '166' }, { name: 'Isteri', rel: 'spouse', m: '176' }], sum: '6000', term: '70', plan: '200', ded: 'none', state: 'penang', area: 'all', ptype: 'all', hosp: null });
    buildPersons();
  } else {
    Object.assign(S.r, { name: 'Eddy', age: '40', use: 'retire', child: '', childAge: '', plan: '5Pay20', basic: '20000', saver: '10000', saverYears: '', adhoc: '', have: { gk: true, df: true, m1: false, m2: false }, deathMode: 'blank' });
  }
  syncForm(); render(); toast('Contoh dimuatkan.', 1800);
}

document.addEventListener('DOMContentLoaded', init);
