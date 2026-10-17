/* =====================================================================
   TOOLS · Analisis Keperluan (fact-finding) + Perbandingan Pelan
   Uses helpers from app.js: S, t, num, esc, RM, RM2, RMk, kk, $, $$, getK, setK, dateStr, schedule, render, syncForm
   ===================================================================== */

const FACTS = {
  medTrend: { y26: 16.0, y27: 14.7, src: 'Aon, 2027 Global Medical Trend Rates Report (Okt 2026)', srcEn: 'Aon, 2027 Global Medical Trend Rates Report (Oct 2026)' },
  lifeCover: { src: 'Bank Negara Malaysia, ucapan Timbalan Gabenor, 28 Ogos 2024', srcEn: 'Bank Negara Malaysia, Deputy Governor speech, 28 Aug 2024' },
  medAssume: 0.12,   // projection assumption, deliberately below Aon's 2026/2027 figures
  indepAge: 23,      // age a child is assumed to be independent
};
const DREAM_TYPES = [['edu', '🎓', 'Pendidikan anak', "Children's education"], ['haji', '🕋', 'Haji & umrah', 'Hajj & umrah'], ['house', '🏠', 'Rumah', 'Home'], ['retire', '🌴', 'Persaraan', 'Retirement'], ['biz', '🏪', 'Bisnes', 'Business'], ['other', '⭐', 'Lain-lain', 'Other']];
const DEBT_TYPES = [['house', '🏠', 'Pinjaman rumah', 'Home loan'], ['car', '🚗', 'Pinjaman kereta', 'Car loan'], ['personal', '💳', 'Pinjaman peribadi', 'Personal loan'], ['card', '💳', 'Kad kredit', 'Credit card'], ['ptptn', '🎓', 'PTPTN', 'PTPTN'], ['biz', '🏪', 'Pinjaman bisnes', 'Business loan'], ['other', '📄', 'Lain-lain', 'Other']];
const typeRow = (list, k) => list.find(x => x[0] === k) || list[list.length - 1];

function ffBlank() {
  return {
    name: '', age: '', status: 'married', incomeM: '', spouseIncomeM: '', expensesM: '',
    dreams: [{ type: 'edu', name: '', amt: '', yrs: '' }],
    debts: [{ type: 'house', amt: '' }],
    kids: '', youngest: '', parentsM: '',
    exLife: '', exCI: '', exMed: 'none', exMedLimit: '', savings: '',
    hibahX: '10', hibahC: '', ciX: '5', ciC: '', budgetP: '10', budgetC: '', bill: '30000',
  };
}
function cmpPlanBlank() { return { preset: 'custom', name: '', monthly: '', death: '', ci: '', medLimit: '', rb: '', ded: '', ncb: '', cover: '', savings: '', extra: '' }; }
function cmpBlank() { return { n: '3', rec: '1', title: '', plans: [cmpPlanBlank(), cmpPlanBlank(), cmpPlanBlank()] }; }

const CMP_PRESETS = {
  custom: { label: 'Kosong / pelan lain' },
  idaman200: { label: 'A-Life Idaman + Health360-i Plan 200', name: 'A-Life Idaman + A-Plus Health360-i (Plan 200)', medLimit: '1500000', rb: '200', ncb: '1000', cover: '70 / 80 → 100', extra: 'Hayat + TPD + kad perubatan, Health Wallet, Badal Hajj RM5,000' },
  idaman300: { label: 'A-Life Idaman + Health360-i Plan 300', name: 'A-Life Idaman + A-Plus Health360-i (Plan 300)', medLimit: '3000000', rb: '300', ncb: '2500', cover: '70 / 80 → 100', extra: 'Hayat + TPD + kad perubatan, Prevention & Primary Care, Health Wallet' },
  mediflex180: { label: 'A-Life MediFlex-i Plan 180', name: 'A-Life MediFlex-i (Plan 180)', medLimit: '180000', rb: '180', ncb: '0', death: '0', extra: 'Kad perubatan sahaja (tiada hayat)' },
  mediflex250: { label: 'A-Life MediFlex-i Plan 250', name: 'A-Life MediFlex-i (Plan 250)', medLimit: '250000', rb: '250', ncb: '0', death: '0', extra: 'Kad perubatan sahaja (tiada hayat)' },
  mediflex350: { label: 'A-Life MediFlex-i Plan 350', name: 'A-Life MediFlex-i (Plan 350)', medLimit: '350000', rb: '350', ncb: '0', death: '0', extra: 'Kad perubatan sahaja (tiada hayat)' },
  rezeki5: { label: 'A-Enrich Rezeki 5Pay20', name: 'A-Enrich Rezeki (5Pay20)', ncb: '0', cover: '20 tahun', savings: 'Unjuran ikut PI / kalkulator', extra: 'Simpanan + pelaburan (ADSE) + boosters' },
  rezeki10: { label: 'A-Enrich Rezeki 10Pay20', name: 'A-Enrich Rezeki (10Pay20)', ncb: '0', cover: '20 tahun', savings: 'Unjuran ikut PI / kalkulator', extra: 'Simpanan + pelaburan (ADSE) + boosters' },
};

/* ---------------- calculations ---------------- */
function pickVal(pick, custom) { return pick === 'c' ? num(custom) : num(pick); }
function ffCalc(f) {
  const incM = num(f.incomeM), annual = incM * 12;
  const hibahYrs = pickVal(f.hibahX, f.hibahC), ciYrs = pickVal(f.ciX, f.ciC), budgetP = pickVal(f.budgetP, f.budgetC);
  const debts = f.debts.filter(d => num(d.amt) > 0);
  const dreams = f.dreams.filter(d => num(d.amt) > 0);
  const debtTotal = debts.reduce((a, d) => a + num(d.amt), 0);
  const eduTotal = dreams.filter(d => d.type === 'edu').reduce((a, d) => a + num(d.amt), 0);
  const dreamTotal = dreams.reduce((a, d) => a + num(d.amt), 0);
  const hibahNeed = annual * hibahYrs;
  const deathNeed = hibahNeed + debtTotal + eduTotal, deathHave = num(f.exLife);
  const ciNeed = annual * ciYrs, ciHave = num(f.exCI);
  const exp = num(f.expensesM) || incM;
  const emNeed = exp * 6, emHave = num(f.savings);
  const budgetM = incM * budgetP / 100;
  const kids = Math.round(num(f.kids)), youngest = f.youngest === '' ? null : Math.round(num(f.youngest));
  const indepYrs = kids && youngest !== null ? Math.max(0, FACTS.indepAge - youngest) : null;
  const needAll = deathNeed + ciNeed + emNeed, haveAll = Math.min(deathHave, deathNeed) + Math.min(ciHave, ciNeed) + Math.min(emHave, emNeed);
  const covered = needAll ? Math.round(haveAll / needAll * 100) : 0;
  return { incM, annual, hibahYrs, ciYrs, budgetP, debts, dreams, debtTotal, eduTotal, dreamTotal, hibahNeed, deathNeed, deathHave, deathGap: Math.max(0, deathNeed - deathHave),
    ciNeed, ciHave, ciGap: Math.max(0, ciNeed - ciHave), exp, emNeed, emHave, emGap: Math.max(0, emNeed - emHave), budgetM, kids, youngest, indepYrs, covered };
}

/* ---------------- shared bits ---------------- */
function ftr(n, total, extra) {
  const a = S.a;
  return `<div class="foot"><span><b>${t('Disediakan oleh', 'Prepared by')} ${esc(a.name || 'Mamu')}</b> · ${esc(a.title)}${a.phone ? ' · ' + esc(a.phone) : ''}</span><span style="white-space:nowrap">${dateStr()} · ${t(`Muka surat ${n} / ${total}`, `Page ${n} of ${total}`)}${extra ? ' · ' + extra : ''}</span></div>`;
}
function gaugeSVG(p) {
  const v = Math.max(0, Math.min(100, p)), col = v >= 80 ? '#0E8A7E' : v >= 50 ? '#C99A2E' : '#C8102E';
  return `<svg viewBox="0 0 42 42" style="width:30mm;height:30mm"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#F1EDEF" stroke-width="5"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="${col}" stroke-width="5" stroke-dasharray="${v} ${100 - v}" stroke-dashoffset="25" stroke-linecap="${v > 0 && v < 100 ? 'round' : 'butt'}"/><text x="21" y="22.5" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="8.5" fill="#1E1B22">${v}%</text><text x="21" y="28" text-anchor="middle" font-family="Inter" font-size="3" fill="#6B6570">${t('dilindungi', 'covered')}</text></svg>`;
}
function gapBlock(need, have, isMoney = true) {
  const max = Math.max(need, have, 1), f = v => (v / max * 100).toFixed(1) + '%';
  return `<div class="gbar">
    <div class="row"><span>${t('Keperluan', 'Need')}</span><div class="track"><div class="fill need" style="width:${f(need)}"></div></div><span class="v">${RM(need)}</span></div>
    <div class="row"><span>${t('Sedia ada', 'Existing')}</span><div class="track"><div class="fill have" style="width:${f(have)}"></div></div><span class="v">${RM(have)}</span></div>
  </div>`;
}
function gapResult(gap, need) {
  if (!need) return `<div class="gres ok"><span>${t('Isi pendapatan untuk kira', 'Enter income to calculate')}</span><b>—</b></div>`;
  return gap > 0 ? `<div class="gres bad"><span>${t('Jurang perlindungan', 'Protection gap')}</span><b>${RM(gap)}</b></div>`
    : `<div class="gres ok"><span>${t('Keperluan dipenuhi', 'Need is covered')}</span><b>✓</b></div>`;
}

/* ---------------- TEMPLATE F1 · Analisis Keperluan ---------------- */
function renderFactFind() {
  const f = S.f, c = ffCalc(f), lg = L();
  const name = esc(f.name.trim() || t('Pelanggan', 'Client'));
  const dreamRows = c.dreams.length ? c.dreams.map(d => {
    const tr = typeRow(DREAM_TYPES, d.type), yrs = num(d.yrs), amt = num(d.amt);
    const per = yrs ? amt / (yrs * 12) : 0;
    return `<div class="it"><div class="l">${tr[1]} ${esc(d.name.trim() || tr[2 + lg])}<small>${yrs ? t(`dalam ${yrs} tahun`, `in ${yrs} years`) : t('tempoh belum ditetapkan', 'no timeline yet')}</small></div><div class="r">${RM(amt)}${per ? `<small>≈ ${RM(per)}${t('/bln', '/mth')}</small>` : ''}</div></div>`;
  }).join('') : `<div class="empty">${t('Belum diisi.', 'Not filled in yet.')}</div>`;
  const dreamMonthly = c.dreams.reduce((a, d) => a + (num(d.yrs) ? num(d.amt) / (num(d.yrs) * 12) : 0), 0);
  const debtRows = c.debts.length ? c.debts.map(d => { const tr = typeRow(DEBT_TYPES, d.type); return `<div class="it"><div class="l">${tr[1]} ${tr[2 + lg]}</div><div class="r">${RM(num(d.amt))}</div></div>`; }).join('') : `<div class="empty">${t('Tiada hutang direkodkan.', 'No debts recorded.')}</div>`;
  const spouse = f.status === 'married';
  const depNote = c.indepYrs !== null
    ? t(`Anak bongsu berumur ${c.youngest}: perlukan sokongan kira-kira <b>${c.indepYrs} tahun</b> lagi (hingga umur ${FACTS.indepAge}).`, `Youngest child is ${c.youngest}: needs support for about <b>${c.indepYrs} more years</b> (to age ${FACTS.indepAge}).`)
    : t('Isi bilangan anak & umur anak bongsu untuk anggaran tempoh tanggungan.', 'Add number of children & youngest age to estimate the support period.');
  const bopts = [10, 20].map(p => ({ p, v: c.incM * p / 100, on: f.budgetP === String(p) }));
  bopts.push({ p: f.budgetP === 'c' ? num(f.budgetC) : null, v: f.budgetP === 'c' ? c.budgetM : null, on: f.budgetP === 'c', custom: true });
  const chips = bopts.map(o => `<div class="chip${o.on ? ' on' : ''}"><div class="p">${o.custom ? (o.p ? o.p + '%' : t('Lain-lain', 'Custom')) : o.p + '%'}</div><b>${o.v !== null ? RM(o.v) : '—'}</b><small>${t('/bulan', '/month')}</small></div>`).join('');
  const bp = Math.max(0, Math.min(100, c.budgetP));
  const hh = num(f.spouseIncomeM);
  const cf = (() => {
    const inc = c.incM + hh, ex = num(f.expensesM), dm = dreamMonthly, bal = inc - ex - c.budgetM - dm;
    const tot = Math.max(inc, ex + c.budgetM + dm, 1), w = v => (v / tot * 100).toFixed(2) + '%';
    const seg = (cls, v, lab) => v > 0 ? `<div class="${cls}" style="width:${w(v)}">${v / tot > 0.09 ? lab : ''}</div>` : '';
    const segs = seg('ex', ex, RMk(ex)) + seg('tk', c.budgetM, RMk(c.budgetM)) + seg('dm', dm, RMk(dm)) + (bal >= 0 ? seg('bl', bal, RMk(bal)) : seg('ov', -bal, '−' + RMk(-bal)));
    return { inc, ex, dm, bal, segs };
  })();

  const p1 = `<section class="page">
  <div class="hero">
    <div class="tag">${t('Analisis Keperluan Kewangan', 'Financial Needs Analysis')}</div>
    <h1>${t(`Gambaran kewangan ${name}.`, `${name}'s financial picture.`)}<br><span>${t('Biar nombor yang bercerita.', 'Let the numbers tell the story.')}</span></h1>
    <p>${t('Sebelum bercakap tentang produk, kita lihat dulu apa yang anda ada, apa yang anda tanggung, dan apa yang anda impikan.', 'Before talking about any product, we first look at what you have, what you carry, and what you dream of.')}</p>
    <div class="hbox"><div class="k">${t('Pendapatan', 'Income')}</div><b>${RM(c.incM)}<small> ${t('/bulan', '/month')}</small></b>
      <div class="two"><div>${t('Setahun', 'Per year')}<b>${RMk(c.annual)}</b></div><div>${t('Isi rumah', 'Household')}<b>${RMk((c.incM + hh) * 12)}</b></div></div></div>
  </div>
  <div class="snap">
    <div class="card"><div class="k">${t('Umur · status', 'Age · status')}</div><div class="big">${f.age ? esc(f.age) : '—'}<small> ${spouse ? t('· berkahwin', '· married') : t('· bujang', '· single')}</small></div><div class="sub">${t('Perbelanjaan bulanan', 'Monthly expenses')}: <b>${num(f.expensesM) ? RM(num(f.expensesM)) : '—'}</b></div></div>
    <div class="card"><div class="k">${t('Tanggungan', 'Dependants')}</div><div class="big">${(spouse ? 1 : 0) + c.kids}<small> ${t('orang', 'people')}</small></div><div class="sub">${spouse ? t('Pasangan', 'Spouse') + ' + ' : ''}${c.kids} ${t('anak', 'children')}${num(f.parentsM) ? ' · ' + t('ibu bapa', 'parents') + ' ' + RM(num(f.parentsM)) + t('/bln', '/mth') : ''}</div></div>
    <div class="card"><div class="k">${t('Jumlah hutang', 'Total debt')}</div><div class="big">${RMk(c.debtTotal)}</div><div class="sub">${c.debts.length} ${t('pinjaman', 'loans')} · ${c.annual ? (c.debtTotal / c.annual).toFixed(1) + '× ' + t('pendapatan tahunan', 'annual income') : ''}</div></div>
    <div class="card"><div class="k">${t('Impian kewangan', 'Financial dreams')}</div><div class="big">${RMk(c.dreamTotal)}</div><div class="sub">${c.dreams.length} ${t('matlamat', 'goals')}${dreamMonthly ? ' · ≈ ' + RM(dreamMonthly) + t('/bln perlu disimpan', '/mth to save') : ''}</div></div>
  </div>
  <div class="pad">
    <div class="sec"><div class="n">1</div><h2>${t('3D: Dreams · Debt · Dependants', '3D: Dreams · Debt · Dependants')}</h2><div class="hint">${t('Apa yang perlu dilindungi', 'What needs protecting')}</div></div>
    <div class="three">
      <div class="d3 dr"><h3><i>✨</i>Dreams</h3><div class="lead">${t('Matlamat yang anda nak capai', 'Goals you want to reach')}</div>${dreamRows}${c.dreams.length ? `<div class="tot"><span>${t('Jumlah', 'Total')}</span><b>${RM(c.dreamTotal)}</b></div>` : ''}</div>
      <div class="d3 db"><h3><i>⚖️</i>Debt</h3><div class="lead">${t('Yang perlu dilangsaikan', 'What must be settled')}</div>${debtRows}${c.debts.length ? `<div class="tot"><span>${t('Jumlah', 'Total')}</span><b>${RM(c.debtTotal)}</b></div>` : ''}</div>
      <div class="d3 dp"><h3><i>👨‍👩‍👧</i>Dependants</h3><div class="lead">${t('Yang bergantung pada anda', 'Who depends on you')}</div>
        <div class="dep"><div><b>${spouse ? 1 : 0}</b><span>${t('pasangan', 'spouse')}</span></div><div><b>${c.kids}</b><span>${t('anak', 'children')}</span></div></div>
        ${num(f.parentsM) ? `<div class="it" style="margin-top:1.2mm"><div class="l">${t('Sokongan ibu bapa', 'Support to parents')}</div><div class="r">${RM(num(f.parentsM))}<small>${t('/bulan', '/month')}</small></div></div>` : ''}
        <div class="note">${depNote}</div></div>
    </div>
    <div class="sec"><div class="n">2</div><h2>${t('Bajet takaful & aliran tunai', 'Takaful budget & cash flow')}</h2><div class="hint">${t(`Bajet = ${c.budgetP}% daripada pendapatan anda`, `Budget = ${c.budgetP}% of your income`)}</div></div>
    <div class="budget">
      <div class="bwrap"><div class="k">${t('Aliran tunai isi rumah / bulan', 'Household cash flow / month')} · ${RM(cf.inc)}</div>
        <div class="cf">${cf.segs}</div>
        <div class="cfl"><div><i style="background:#8E8389"></i>${t('Perbelanjaan', 'Expenses')}<b>${RM(cf.ex)}</b></div><div><i style="background:var(--teal)"></i>${t('Takaful', 'Takaful')}<b>${RM(c.budgetM)}</b></div><div><i style="background:var(--gold)"></i>${t('Simpan untuk impian', 'Save for dreams')}<b>${RM(cf.dm)}</b></div><div><i style="background:${cf.bal < 0 ? 'var(--red)' : '#BFE3DE'}"></i>${cf.bal < 0 ? t('Kurang', 'Short by') : t('Baki', 'Left over')}<b>${RM(Math.abs(cf.bal))}</b></div></div>
        ${cf.inc ? `<div class="cfwarn ${cf.bal < 0 ? 'bad' : 'ok'}">${cf.bal < 0 ? t('Komitmen + impian melebihi pendapatan. Impian perlu disusun semula atau tempoh dipanjangkan.', 'Commitments + dreams exceed income. Dreams need re-planning or a longer timeline.') : t('Bajet takaful dan simpanan impian muat dalam pendapatan isi rumah.', 'The takaful budget and dream savings fit within household income.')}</div>` : ''}
        <div class="chips">${chips}</div></div>
      <div class="bsum"><div class="k">${t('Bajet pilihan anda', 'Your chosen budget')}</div><b>${RM(c.budgetM)}<span style="font-size:9pt;font-weight:500"> ${t('/bulan', '/month')}</span></b>
        <p>${t(`≈ ${RM2(c.budgetM * 12 / 365)} sehari. Pelan akan dicadangkan dalam bajet ini, bukan sebaliknya.`, `≈ ${RM2(c.budgetM * 12 / 365)} a day. Plans will be proposed within this budget, not the other way round.`)}</p></div>
    </div>
    <div class="sec"><div class="n">3</div><h2>${t('Kenapa perlu fikir sekarang', 'Why think about it now')}</h2></div>
    <div class="facts">
      <div class="fact"><b>2 / 5</b><p>${t('Hanya kira-kira 2 daripada 5 rakyat Malaysia ada perlindungan hayat.', 'Only about 2 in 5 Malaysians have life protection.')}</p><small>${t(FACTS.lifeCover.src, FACTS.lifeCover.srcEn)}</small></div>
      <div class="fact"><b>${FACTS.medTrend.y26}%</b><p>${t(`Unjuran kenaikan kos perubatan Malaysia 2026 (${FACTS.medTrend.y27}% untuk 2027).`, `Projected Malaysian medical cost trend for 2026 (${FACTS.medTrend.y27}% for 2027).`)}</p><small>${t(FACTS.medTrend.src, FACTS.medTrend.srcEn)}</small></div>
      <div class="fact"><b>${c.annual ? RMk(c.annual) : '—'}</b><p>${t('Pendapatan setahun yang hilang jika anda tidak dapat bekerja. Siapa yang akan gantikan?', 'Income lost each year if you cannot work. Who will replace it?')}</p><small>${t('Berdasarkan maklumat anda', 'Based on your details')}</small></div>
    </div>
    <div class="mini">${t('Analisis ini berdasarkan maklumat yang anda kongsikan. Ia anggaran untuk perbincangan, bukan nasihat kewangan atau cadangan produk.', 'This analysis is based on the details you shared. It is an estimate for discussion, not financial advice or a product recommendation.')}</div>
  </div>
  ${ftr(1, 2)}
</section>`;

  // page 2
  const hOpts = [5, 10, 15].map(y => `<div class="${c.hibahYrs === y && f.hibahX !== 'c' ? 'on' : ''}">${y}×<b>${RMk(c.annual * y)}</b></div>`).join('') + (f.hibahX === 'c' ? `<div class="on">${c.hibahYrs}×<b>${RMk(c.hibahNeed)}</b></div>` : '');
  const cOpts = [3, 5].map(y => `<div class="${c.ciYrs === y && f.ciX !== 'c' ? 'on' : ''}">${y}×<b>${RMk(c.annual * y)}</b></div>`).join('') + (f.ciX === 'c' ? `<div class="on">${c.ciYrs}×<b>${RMk(c.ciNeed)}</b></div>` : '');
  const bill = num(f.bill) || 30000, yrsI = [0, 5, 10, 15, 20], vals = yrsI.map(y => bill * Math.pow(1 + FACTS.medAssume, y)), vmax = vals[vals.length - 1];
  const inflCols = vals.map(v => `<div class="c"><span>${RMk(v)}</span><i style="height:${(v / vmax * 85).toFixed(1)}%"></i></div>`).join('');
  const inflX = yrsI.map(y => `<span>${y ? t(`+${y} thn`, `+${y} yrs`) : t('Hari ini', 'Today')}</span>`).join('');
  const medOk = f.exMed === 'have';
  const gapsTotal = c.deathGap + c.ciGap + c.emGap;
  const p2 = `<section class="page">
  <div class="p2head">
    <div><div class="k" style="color:var(--red)">${t('Jurang perlindungan', 'Protection gap')}</div>
      <h1>${t(`Jika esok sesuatu berlaku,<br><span>adakah keluarga ${name} bersedia?</span>`, `If something happened tomorrow,<br><span>would ${name}'s family be ready?</span>`)}</h1>
      <p>${t('Keperluan dikira daripada pendapatan, hutang dan tanggungan anda; "sedia ada" ialah perlindungan & simpanan yang anda ada sekarang.', 'Needs are worked out from your income, debts and dependants; "existing" is the cover & savings you have today.')}</p></div>
    <div class="gauge">${gaugeSVG(c.covered)}<div class="k">${t('Keperluan yang sudah dilindungi', 'Of needs already covered')}</div></div>
  </div>
  <div class="pad">
    <div class="gaps" style="margin-top:3.5mm">
      <div class="gap"><h3><i>🛡️</i>${t('Kematian / TPD · hibah keluarga', 'Death / TPD · family hibah')}</h3>
        <div class="f">${t(`Pendapatan ${c.hibahYrs} tahun (${RM(c.hibahNeed)}) + hutang (${RM(c.debtTotal)}) + pendidikan anak (${RM(c.eduTotal)})`, `${c.hibahYrs} years of income (${RM(c.hibahNeed)}) + debts (${RM(c.debtTotal)}) + children's education (${RM(c.eduTotal)})`)}</div>
        ${gapBlock(c.deathNeed, c.deathHave)}${gapResult(c.deathGap, c.deathNeed)}
        <div class="k" style="margin-top:1.8mm">${t('Berapa lama keluarga perlu duit ini bertahan?', 'How long should the money last the family?')}</div><div class="opts">${hOpts}</div></div>
      <div class="gap"><h3><i>❤️‍🩹</i>${t('Penyakit kritikal', 'Critical illness')}</h3>
        <div class="f">${t(`Pendapatan ${c.ciYrs} tahun untuk tempoh rawatan & pemulihan, tanpa sentuh simpanan keluarga.`, `${c.ciYrs} years of income to cover treatment & recovery without touching family savings.`)}</div>
        ${gapBlock(c.ciNeed, c.ciHave)}${gapResult(c.ciGap, c.ciNeed)}
        <div class="k" style="margin-top:1.8mm">${t('Berapa tahun pendapatan diganti?', 'How many years of income to replace?')}</div><div class="opts">${cOpts}</div></div>
      <div class="gap"><h3><i>🏥</i>${t('Kos perubatan', 'Medical costs')}</h3>
        <div class="medstat ${medOk ? 'ok' : 'bad'}">${medOk ? t(`✓ Ada kad perubatan${num(f.exMedLimit) ? ' · had tahunan ' + RM(num(f.exMedLimit)) : ''}`, `✓ Has a medical card${num(f.exMedLimit) ? ' · annual limit ' + RM(num(f.exMedLimit)) : ''}`) : t('✗ Tiada kad perubatan peribadi', '✗ No personal medical card')}</div>
        <div class="infl"><div class="k" style="margin-bottom:1mm">${t(`Contoh bil hospital ${RM(bill)} jika kos naik ${Math.round(FACTS.medAssume * 100)}% setahun`, `Example hospital bill of ${RM(bill)} if costs rise ${Math.round(FACTS.medAssume * 100)}% a year`)}</div>
          <div class="cols">${inflCols}</div><div class="xl">${inflX}</div></div>
        <div class="f" style="margin-top:1.4mm">${t(`Andaian ${Math.round(FACTS.medAssume * 100)}% lebih rendah daripada unjuran Aon (${FACTS.medTrend.y26}% 2026, ${FACTS.medTrend.y27}% 2027). Kad perubatan syarikat biasanya tamat bila berhenti kerja atau bersara.`, `The ${Math.round(FACTS.medAssume * 100)}% assumption is below Aon's projections (${FACTS.medTrend.y26}% 2026, ${FACTS.medTrend.y27}% 2027). Employer medical cards usually end when you leave or retire.`)}</div></div>
      <div class="gap"><h3><i>🧰</i>${t('Dana kecemasan', 'Emergency fund')}</h3>
        <div class="f">${t(`6 bulan perbelanjaan (${RM(c.exp)}/bln) untuk hilang kerja, bisnes perlahan atau kecemasan keluarga. Panduan biasa: 3–6 bulan.`, `6 months of expenses (${RM(c.exp)}/mth) for job loss, slow business or family emergencies. Common guideline: 3–6 months.`)}</div>
        ${gapBlock(c.emNeed, c.emHave)}${gapResult(c.emGap, c.emNeed)}
        <div class="f" style="margin-top:1.6mm">${c.exp ? t(`Simpanan sekarang cukup untuk kira-kira <b>${(c.emHave / c.exp).toFixed(1)} bulan</b>.`, `Current savings last about <b>${(c.emHave / c.exp).toFixed(1)} months</b>.`) : ''}</div></div>
    </div>
    <div class="next">
      <div class="cta"><div class="k">${t('Ringkasan', 'Summary')}</div><b>${gapsTotal ? t(`Jumlah jurang: ${RM(gapsTotal)}`, `Total gap: ${RM(gapsTotal)}`) : t('Tiada jurang besar dikesan', 'No major gap found')}</b>
        <p>${t(`Bajet takaful yang anda pilih: <b>${RM(c.budgetM)}/bulan</b> (${c.budgetP}% pendapatan). Langkah seterusnya: lihat pelan yang paling banyak menutup jurang ini dalam bajet tersebut.`, `Your chosen takaful budget: <b>${RM(c.budgetM)}/month</b> (${c.budgetP}% of income). Next step: see which plan closes the most of this gap within that budget.`)}</p></div>
      <div class="list"><div class="k">${t('Soalan untuk difikirkan', 'Questions to think about')}</div><ul>
        <li>${t('Jika pendapatan berhenti esok, berapa bulan keluarga boleh bertahan?', 'If your income stopped tomorrow, how many months could the family manage?')}</li>
        <li>${t('Siapa yang akan langsaikan hutang rumah & kereta?', 'Who would settle the home & car loans?')}</li>
        <li>${t('Adakah impian anak-anak masih boleh diteruskan?', "Could the children's dreams still go ahead?")}</li>
      </ul></div>
    </div>
    <div class="mini">${t('Formula: Kematian/TPD = pendapatan tahunan × tahun dipilih + jumlah hutang + matlamat pendidikan − perlindungan hayat sedia ada. Penyakit kritikal = pendapatan tahunan × tahun dipilih − perlindungan CI sedia ada. Dana kecemasan = perbelanjaan bulanan × 6 − simpanan tunai. Anggaran kasar untuk perbincangan; tiada pulangan pelaburan atau inflasi diambil kira kecuali contoh bil perubatan. Bukan nasihat kewangan.', 'Formulas: Death/TPD = annual income × chosen years + total debts + education goals − existing life cover. Critical illness = annual income × chosen years − existing CI cover. Emergency fund = monthly expenses × 6 − cash savings. Rough estimates for discussion; no investment returns or inflation assumed except the medical bill example. Not financial advice.')}</div>
  </div>
  ${ftr(2, 2)}
</section>`;
  return `<div class="doc tF lang-${S.lang}">${p1}${p2}</div>`;
}

/* ---------------- TEMPLATE F2 · Perbandingan Pelan ---------------- */
function renderCompare() {
  const cm = S.c, n = cm.n === '2' ? 2 : 3, plans = cm.plans.slice(0, n), rec = Math.min(n, Math.max(1, num(cm.rec))) - 1;
  const f = S.f, fc = ffCalc(f), hasFF = fc.incM > 0;
  const who = esc(f.name.trim());
  const col = (i, inner, cls = '') => `<td class="${i === rec ? 'rec ' : ''}${cls}">${inner}</td>`;
  const dash = '<span class="no">—</span>';
  const money = v => num(v) ? `<span class="vv">${RM(num(v))}</span>` : dash;
  const head = plans.map((p, i) => {
    const m = num(p.monthly);
    return `<th class="${i === rec ? 'rec' : ''}"><div class="ph">${i === rec ? `<span class="ribbon">★ ${t('Cadangan', 'Recommended')}</span>` : ''}<div class="pn">${t('Pelan', 'Plan')} ${i + 1}</div><div class="nm">${esc(p.name || '—')}</div><div class="pr">${m ? RM(m) : '—'}<small>${t('/bln', '/mth')}</small></div><div class="dy">${m ? '≈ ' + RM2(m * 12 / 365) + t(' sehari', ' a day') : '&nbsp;'}</div></div></th>`;
  }).join('');
  const row = (lab, fn, cls) => `<tr><td class="lab">${lab}</td>${plans.map((p, i) => col(i, fn(p, i), cls)).join('')}</tr>`;
  const grp = lab => `<tr class="grp"><td colspan="${n + 1}">${lab}</td></tr>`;
  const pctBar = (have, gap) => {
    if (!gap) return `<span class="yes">✓</span><span class="sm">${t('tiada jurang', 'no gap')}</span>`;
    const p = Math.min(100, Math.round(have / gap * 100));
    return `<span class="vv">${p}%</span><div class="pbar"><i style="width:${p}%"></i></div>`;
  };
  let body = grp(t('Perlindungan', 'Protection'))
    + row(t('Kematian / TPD', 'Death / TPD'), p => money(p.death))
    + row(t('Penyakit kritikal', 'Critical illness'), p => money(p.ci))
    + grp(t('Perubatan', 'Medical'))
    + row(t('Had tahunan kad perubatan', 'Medical card annual limit'), p => num(p.medLimit) ? `<span class="vv">${RMk(num(p.medLimit))}</span>` : dash)
    + row(t('Bilik & penginapan / hari', 'Room & board / day'), p => num(p.rb) ? `<span class="vv">RM${num(p.rb)}</span>` : dash)
    + row('Deductible', p => p.ded ? esc(p.ded) : dash)
    + row(t('Health Wallet (NCB / thn)', 'Health Wallet (NCB / yr)'), p => num(p.ncb) ? `<span class="yes">✓</span> <span class="vv">${RM(num(p.ncb))}</span>` : dash)
    + grp(t('Lain-lain', 'Others'))
    + row(t('Perlindungan hingga', 'Covered until'), p => p.cover ? esc(p.cover) : dash)
    + row(t('Simpanan / nilai matang', 'Savings / maturity value'), p => p.savings ? esc(p.savings) : dash, 'txt')
    + row(t('Kelebihan utama', 'Key strengths'), p => p.extra ? esc(p.extra) : dash, 'txt');
  if (hasFF) {
    body += grp(t(`Ikut analisis keperluan${who ? ' ' + who : ''}`, `Against ${who ? who + "'s " : 'the '}needs analysis`))
      + row(t(`Tutup jurang kematian/TPD (${RMk(fc.deathGap)})`, `Closes death/TPD gap (${RMk(fc.deathGap)})`), p => pctBar(num(p.death), fc.deathGap))
      + row(t(`Tutup jurang CI (${RMk(fc.ciGap)})`, `Closes CI gap (${RMk(fc.ciGap)})`), p => pctBar(num(p.ci), fc.ciGap))
      + row(t(`Dalam bajet (${RM(fc.budgetM)}/bln)`, `Within budget (${RM(fc.budgetM)}/mth)`), p => { const m = num(p.monthly); if (!m || !fc.budgetM) return dash; return m <= fc.budgetM ? `<span class="yes">✓ ${t('Ya', 'Yes')}</span><span class="sm">${t('baki', 'left')} ${RM(fc.budgetM - m)}</span>` : `<span class="over">${t('Lebih', 'Over by')} ${RM(m - fc.budgetM)}</span>`; });
  }
  const title = esc(cm.title.trim()) || (who ? t(`Pilihan pelan untuk ${who}`, `Plan options for ${who}`) : t('Perbandingan pelan', 'Plan comparison'));
  return `<div class="doc tF lang-${S.lang}"><section class="page">
  <div class="hero" style="padding:6mm 12mm 5mm">
    <div class="tag">${t('Perbandingan Pelan', 'Plan Comparison')}</div>
    <h1 style="max-width:none">${title}<br><span>${t(`${n} pilihan, satu keputusan yang anda faham.`, `${n} options, one decision you understand.`)}</span></h1>
    <p style="max-width:160mm">${t('Bandingkan perlindungan, kad perubatan dan caruman secara bersebelahan. Pelan bertanda ★ ialah cadangan ejen berdasarkan keperluan dan bajet anda.', 'Compare protection, medical card and contributions side by side. The ★ plan is the agent\'s recommendation based on your needs and budget.')}</p>
  </div>
  <div class="cmpwrap"><table class="cmp"><thead><tr><th style="width:34mm"></th>${head}</tr></thead><tbody>${body}</tbody></table>
    <div class="legend2"><span>★ ${t('Cadangan ejen', "Agent's recommendation")}</span><span>— ${t('tiada / tidak berkenaan', 'none / not applicable')}</span>${hasFF ? `<span>% = ${t('bahagian jurang yang ditutup oleh pelan', 'share of the gap the plan closes')}</span>` : ''}</div>
    <div class="mini">${t('Caruman dan manfaat adalah ilustrasi; angka muktamad ikut Ilustrasi Produk (PI), PDS dan sijil. Tabarru\' dan caruman perubatan tidak dijamin dan boleh meningkat ikut umur. Nilai simpanan/pelaburan tidak dijamin. Permohonan tertakluk underwriting. AIA PUBLIC Takaful Bhd. ahli PIDM.', 'Contributions and benefits are illustrative; final figures per Product Illustration (PI), PDS and certificate. Tabarru\' and medical contributions are not guaranteed and may increase with age. Savings/investment values are not guaranteed. Subject to underwriting. AIA PUBLIC Takaful Bhd. is a member of PIDM.')}</div>
  </div>
  ${ftr(1, 1)}
</section></div>`;
}

/* ---------------- warnings ---------------- */
function toolsWarnings() {
  const w = [];
  if (S.prod === 'ff') {
    const f = S.f;
    if (!f.name.trim()) w.push('Nama pelanggan kosong.');
    if (!num(f.incomeM)) w.push('Pendapatan bulanan kosong — semua kalkulator perlukan pendapatan.');
    if (f.hibahX === 'c' && !num(f.hibahC)) w.push('Hibah "Lain": isi bilangan tahun.');
    if (f.ciX === 'c' && !num(f.ciC)) w.push('CI "Lain": isi bilangan tahun.');
    if (f.budgetP === 'c' && !num(f.budgetC)) w.push('Bajet "Lain": isi peratus.');
    if (f.exMed === 'have' && !num(f.exMedLimit)) w.push('Ada kad perubatan: had tahunan belum diisi (pilihan).');
  } else if (S.prod === 'cmp') {
    const n = S.c.n === '2' ? 2 : 3;
    S.c.plans.slice(0, n).forEach((p, i) => { if (!p.name.trim()) w.push(`Pelan ${i + 1}: nama kosong.`); if (!num(p.monthly)) w.push(`Pelan ${i + 1}: caruman bulanan kosong (dari SQS).`); });
    if (!num(S.f.incomeM)) w.push('Tip: isi Analisis Keperluan dulu untuk tunjuk % jurang ditutup & padanan bajet.');
  }
  return w;
}

/* ---------------- form builders ---------------- */
function optList(list, sel) { return list.map(([k, ic, bm]) => `<option value="${k}"${k === sel ? ' selected' : ''}>${ic} ${bm}</option>`).join(''); }
function buildDreams() {
  $('#dreamRows').innerHTML = S.f.dreams.map((d, i) => `<div class="frow">
    <label class="f"><span>Jenis</span><select data-k="f.dreams.${i}.type">${optList(DREAM_TYPES, d.type)}</select></label>
    <label class="f"><span>Nama (pilihan)</span><input data-k="f.dreams.${i}.name" value="${esc(d.name)}" placeholder="cth. Universiti Aisyah"></label>
    <label class="f"><span>Jumlah (RM)</span><input data-k="f.dreams.${i}.amt" value="${esc(d.amt)}" inputmode="numeric" placeholder="100000"></label>
    <label class="f"><span>Dalam (thn)</span><input data-k="f.dreams.${i}.yrs" value="${esc(d.yrs)}" inputmode="numeric" placeholder="15"></label>
    <button class="x" data-delrow="f.dreams.${i}" aria-label="Buang">×</button></div>`).join('');
}
function buildDebts() {
  $('#debtRows').innerHTML = S.f.debts.map((d, i) => `<div class="frow two">
    <label class="f"><span>Jenis hutang</span><select data-k="f.debts.${i}.type">${optList(DEBT_TYPES, d.type)}</select></label>
    <label class="f"><span>Baki (RM)</span><input data-k="f.debts.${i}.amt" value="${esc(d.amt)}" inputmode="numeric" placeholder="350000"></label>
    <button class="x" data-delrow="f.debts.${i}" aria-label="Buang">×</button></div>`).join('');
}
function buildCmp() {
  const n = S.c.n === '2' ? 2 : 3;
  $('#cmpPlans').innerHTML = S.c.plans.slice(0, n).map((p, i) => `<div class="card cmpcard">
    <h3><span class="n">${i + 1}</span>Pelan ${i + 1}${String(i + 1) === S.c.rec ? ' <span class="recb">★ Cadangan</span>' : ''}</h3>
    <label class="f"><span>Isi pantas dari produk</span><select data-preset="${i}">${Object.entries(CMP_PRESETS).map(([k, v]) => `<option value="${k}"${k === p.preset ? ' selected' : ''}>${v.label}</option>`).join('')}</select></label>
    <label class="f"><span>Nama pelan</span><input data-k="c.plans.${i}.name" value="${esc(p.name)}"></label>
    <div class="row"><label class="f"><span>Caruman / bulan (RM, SQS)</span><input data-k="c.plans.${i}.monthly" value="${esc(p.monthly)}" inputmode="decimal"></label>
      <label class="f"><span>Kematian / TPD (RM)</span><input data-k="c.plans.${i}.death" value="${esc(p.death)}" inputmode="numeric"></label></div>
    <div class="row"><label class="f"><span>Penyakit kritikal (RM)</span><input data-k="c.plans.${i}.ci" value="${esc(p.ci)}" inputmode="numeric"></label>
      <label class="f"><span>Had tahunan perubatan (RM)</span><input data-k="c.plans.${i}.medLimit" value="${esc(p.medLimit)}" inputmode="numeric"></label></div>
    <div class="row"><label class="f"><span>Bilik / hari (RM)</span><input data-k="c.plans.${i}.rb" value="${esc(p.rb)}" inputmode="numeric"></label>
      <label class="f"><span>Deductible</span><input data-k="c.plans.${i}.ded" value="${esc(p.ded)}" placeholder="cth. Tiada / RM500"></label></div>
    <div class="row"><label class="f"><span>Health Wallet NCB / thn (RM)</span><input data-k="c.plans.${i}.ncb" value="${esc(p.ncb)}" inputmode="numeric"></label>
      <label class="f"><span>Perlindungan hingga</span><input data-k="c.plans.${i}.cover" value="${esc(p.cover)}" placeholder="cth. 70 / 80 → 100"></label></div>
    <label class="f"><span>Simpanan / nilai matang</span><input data-k="c.plans.${i}.savings" value="${esc(p.savings)}" placeholder="cth. Nilai akaun (tidak dijamin)"></label>
    <label class="f"><span>Kelebihan utama</span><input data-k="c.plans.${i}.extra" value="${esc(p.extra)}"></label>
  </div>`).join('');
}
function toolsBuild() { buildDreams(); buildDebts(); buildCmp(); }
function toolsSync() {
  $('#formFF').classList.toggle('hide', S.prod !== 'ff');
  $('#formCmp').classList.toggle('hide', S.prod !== 'cmp');
  ['hibah', 'ci', 'budget'].forEach(k => { const el = $(`#${k}CRow`); if (el) el.classList.toggle('hide', S.f[k + (k === 'budget' ? 'P' : 'X')] !== 'c'); });
  $('#medLimitRow').classList.toggle('hide', S.f.exMed !== 'have');
  const c = ffCalc(S.f);
  const hint = $('#ffKidsHint');
  if (hint) hint.textContent = c.indepYrs !== null ? `Anak bongsu berdikari dalam ±${c.indepYrs} tahun → hibah ${c.indepYrs}× pendapatan mungkin sesuai.` : '';
}
function toolsClick(b) {
  if (b.dataset.addrow) {
    const path = b.dataset.addrow, arr = getK(path);
    if (arr.length < 6) arr.push(path === 'f.dreams' ? { type: 'other', name: '', amt: '', yrs: '' } : { type: 'other', amt: '' });
    toolsBuild(); syncForm(); render(); return true;
  }
  if (b.dataset.delrow) {
    const parts = b.dataset.delrow.split('.'), idx = +parts.pop(), arr = getK(parts.join('.'));
    arr.splice(idx, 1); if (!arr.length) arr.push(parts[1] === 'dreams' ? { type: 'edu', name: '', amt: '', yrs: '' } : { type: 'house', amt: '' });
    toolsBuild(); syncForm(); render(); return true;
  }
  return false;
}
function toolsChange(el) {
  if (el.dataset.preset !== undefined) {
    const i = +el.dataset.preset, pr = CMP_PRESETS[el.value] || {}, p = S.c.plans[i], keep = { monthly: p.monthly, death: p.death, ci: p.ci };
    Object.assign(p, cmpPlanBlank(), keep, { preset: el.value });
    ['name', 'medLimit', 'rb', 'ncb', 'cover', 'savings', 'extra', 'death', 'ded'].forEach(k => { if (pr[k] !== undefined) p[k] = pr[k]; });
    if (el.value.startsWith('idaman')) p.ded = p.ded || 'Tiada';
    if (el.value.startsWith('mediflex')) p.ded = 'RM500 / RM20,000';
    buildCmp(); render(); return true;
  }
  return false;
}
function toolsSample() {
  if (S.prod === 'ff') {
    S.f = Object.assign(ffBlank(), { name: 'Khairil', age: '35', status: 'married', incomeM: '6000', spouseIncomeM: '3500', expensesM: '4500',
      dreams: [{ type: 'edu', name: 'Universiti 2 anak', amt: '200000', yrs: '15' }, { type: 'haji', name: '', amt: '60000', yrs: '10' }, { type: 'retire', name: '', amt: '500000', yrs: '25' }],
      debts: [{ type: 'house', amt: '380000' }, { type: 'car', amt: '65000' }, { type: 'card', amt: '8000' }],
      kids: '2', youngest: '3', parentsM: '500', exLife: '100000', exCI: '0', exMed: 'none', savings: '15000' });
  } else if (S.prod === 'cmp') {
    S.c = cmpBlank();
    const set = (i, preset, extra) => { const el = { dataset: { preset: String(i) }, value: preset }; toolsChange(el); Object.assign(S.c.plans[i], extra); };
    set(0, 'mediflex250', { monthly: '120' });
    set(1, 'idaman200', { monthly: '320', death: '300000' });
    set(2, 'idaman300', { monthly: '450', death: '500000', ci: '100000', name: 'A-Life Idaman + Health360-i (Plan 300) + rider CI', extra: 'Hayat + TPD + penyakit kritikal (rider) + kad perubatan Plan 300' });
    S.c.rec = '2';
  }
}
function toolsDocName() {
  const nm = (S.f.name || 'Client').trim().replace(/\s+/g, '_');
  return S.prod === 'ff' ? `${nm}_Analisis_Keperluan_${S.lang.toUpperCase()}` : `${nm}_Perbandingan_Pelan_${S.lang.toUpperCase()}`;
}
