'use strict';
/* ====================== helpers ====================== */
const $ = (s, r = document) => r.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const fmt = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return fmt(d); };
const todayStr = () => fmt(new Date());
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOWL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONS = MON.map(m => m.slice(0, 3));
const ord = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) ? 0 : (n % 10 < 4 ? n % 10 : 0)]);
const longDay = s => { const d = parse(s); return DOWL[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + ord(d.getDate()); };
const niceDate = s => { const d = parse(s); return d.getDate() + ' ' + MONS[d.getMonth()] + ' ' + d.getFullYear(); };
const shortDate = s => { const d = parse(s); return MONS[d.getMonth()] + ' ' + d.getDate(); };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : NaN; };
const fnum = n => String(Math.round(n * 100) / 100);
const est1rm = (reps, lbs) => reps > 0 && lbs > 0 ? lbs * (1 + reps / 30) : 0; // Epley; matches the 31.67 lbs in the original (8 x 25)
const clock = ms => { const s = Math.max(0, Math.floor(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ':' + pad(m) : m) + ':' + pad(s % 60); };
const lbl = (d) => d === todayStr() ? 'Today' : d === addDays(todayStr(), 1) ? 'Tomorrow' : d === addDays(todayStr(), -1) ? 'Yesterday' : longDay(d);

/* ====================== icons ====================== */
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  utensils: '<path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M7 3v5M17 21V3c-2.5 1.4-3.5 4.4-3.5 8H17"/>',
  chevr: '<path d="m9 6 6 6-6 6"/>', chevl: '<path d="m15 6-6 6 6 6"/>', chevd: '<path d="m6 9 6 6 6-6"/>', chevu: '<path d="m6 15 6-6 6 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  more: '<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
  move: '<path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  pencil: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>',
  flame: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
  scale: '<circle cx="12" cy="13" r="8.5"/><path d="M12 13l3.6-3.6M12 4.5v1.8M5.2 8l1.3 1.1M18.8 8l-1.3 1.1"/>',
  note: '<rect x="5.5" y="4" width="13" height="17" rx="2.5"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  msg: '<path d="M4 5h16v11H9l-5 4z"/><path d="M12 8v4M10 10h4"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
  repeat: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>', upload: '<path d="M12 15V3M7 8l5-5 5 5M4 21h16"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  play: '<path d="M7 4v16l13-8z" fill="currentColor"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  heart: '<path d="M12 20s-7-4.6-9-9.2C1.8 7.2 4 4 7 4c2 0 3.4 1.2 5 3 1.6-1.8 3-3 5-3 3 0 5.2 3.2 4 6.8-2 4.6-9 9.2-9 9.2z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  steps: '<path d="M8 4c2 0 3 2 3 4s-1 4-3 4-3-1-3-3 1-5 3-5zM16 11c2 0 3 2 3 4s-1 4-3 4-3-1-3-3 1-5 3-5z"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'
};
const ic = (n, s = 22, c = '', sw = 1.9) => `<svg class="ic ${c}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
const KIND = { legs: ['#38bdf8', '#2563eb'], back: ['#a78bfa', '#6d28d9'], chest: ['#fb7185', '#be123c'], shoulders: ['#fbbf24', '#d97706'], arms: ['#34d399', '#047857'], core: ['#f472b6', '#be185d'] };
const thumb = (k, sz = 52) => { const c = KIND[k] || KIND.legs; return `<div class="thumb" style="width:${sz}px;height:${sz}px;background:linear-gradient(135deg,${c[0]},${c[1]})">${ic('dumbbell', Math.round(sz * .5), '', 2.1)}</div>`; };
const EQ = { Barbell: 'dumbbell', Cable: 'repeat', Machine: 'sliders', Dumbbell: 'dumbbell' };

/* ---- native haptics (Capacitor iOS app); harmless in the browser ---- */
let _hap = null;
const buzz = (style = 'LIGHT') => { try { if (_hap === null) _hap = (window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) ? Capacitor.registerPlugin('Haptics') : false; if (_hap) _hap.impact({ style }); } catch (e) { } };

/* ====================== state ====================== */
const KEY = 'mytraining.v2';
let S;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
if (!S || S.v !== 2) S = (typeof seedState === 'function') ? seedState() : null; // public build ships no personal data: S stays null until unlocked
let MEAL_PLAN = null;
function ensureGyms() { if (!S) return; if (!Array.isArray(S.gyms) || !S.gyms.length) S.gyms = [{ id: 'g1', name: 'My gym' }]; if (!S.gyms.some(g => g.id === S.gym)) S.gym = S.gyms[0].id; }
const syncPlan = () => { ensureGyms(); MEAL_PLAN = (S && S.mealPlan) || (typeof MEAL_PLAN_SEED !== 'undefined' ? MEAL_PLAN_SEED : null); };
syncPlan();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }

let tab = 'home', selDay = todayStr(), calSeg = 'list', mealsSeg = 'plan', planDay = null, diaryDay = todayStr();
let nav = [], sheet = null, sheetCb = null, toastMsg = null, restT = null, instrOpen = false;
let dp = null; // date-picker state
const curNav = () => nav[nav.length - 1];
const inst = id => S.schedule.find(x => x.id === id);
const wk = id => S.workouts[id];
const itemsOn = d => S.schedule.filter(x => x.date === d && S.workouts[x.wid]);
const planDayFor = d => (((diffDays(S.plan.start, d) % 7) + 7) % 7) + 1;
if (!planDay && S) planDay = planDayFor(todayStr());

/* ---- workout data model ---- */
// previous sets for an exercise relative to a session: latest entry from another session on/before this session's date
const gymName = id => (S.gyms.find(g => g.id === id) || S.gyms[0]).name;
const gymOf = i => (i && i.gym && S.gyms.some(g => g.id === i.gym)) ? i.gym : (i && i.done ? S.gyms[0].id : S.gym);
const hGym = h => (h.gym && S.gyms.some(g => g.id === h.gym)) ? h.gym : S.gyms[0].id;   // old entries (no gym tag) belong to your first gym
// previous sets are per-gym: weights differ between gyms. If this gym has no history yet, fall back to the latest elsewhere (flagged .fromGym)
function prevFor(ex, i) {
  const g = gymOf(i), all = ex.history.filter(h => h.instId !== i.id && h.date <= i.date).sort((a, b) => b.date.localeCompare(a.date));
  const e = all.find(h => hGym(h) === g); if (e) return e.sets;
  if (!all[0]) return null;
  const r = all[0].sets.slice(); r.fromGym = hGym(all[0]); return r;
}
// average across every saved session (all gyms), per set number
function avgFor(ex, i) {
  const all = ex.history.filter(h => h.instId !== i.id && h.date <= i.date); if (all.length < 2) return null;
  const n = Math.max(...all.map(h => h.sets.length)), out = [];
  for (let k = 0; k < n; k++) { const ss = all.map(h => h.sets[k]).filter(Boolean); if (!ss.length) continue; out.push({ reps: ss.reduce((a, x) => a + num(x.reps), 0) / ss.length, lbs: ss.reduce((a, x) => a + num(x.lbs), 0) / ss.length }); }
  return { n: all.length, sets: out };
}
const r1 = x => fnum(Math.round(x * 10) / 10);
function exLog(i, ex) {
  i.log = i.log || {};
  const pv = prevFor(ex, i);
  const want = Math.max(pv ? pv.length : (ex.sets || 2), (i.log[ex.id] || []).length, 1);
  const lg = i.log[ex.id] = i.log[ex.id] || [];
  while (lg.length < want) lg.push({ reps: '', lbs: '' });
  return lg;
}
function deltaOf(pv, k, cur) {
  if (pv && pv.fromGym) return null;   // other gym's numbers aren't comparable
  const p = pv && (pv[k] || pv[pv.length - 1]); const r = num(cur.reps), l = num(cur.lbs);
  if (!p || isNaN(r) || isNaN(l)) return null;
  const pr = num(p.reps), pl = num(p.lbs), dl = l - pl, dr = r - pr;
  if (dl > 0) return { d: 'up', t: '+' + fnum(dl) + ' lb' };
  if (dl < 0) return { d: 'down', t: fnum(dl) + ' lb' };
  if (dr > 0) return { d: 'up', t: '+' + dr + ' rep' };
  if (dr < 0) return { d: 'down', t: dr + ' rep' };
  return { d: 'same', t: 'same' };
}
const filled = lg => (lg || []).filter(s => s.reps !== '' && s.lbs !== '' && !isNaN(num(s.reps)) && !isNaN(num(s.lbs)));
const volume = sets => sets.reduce((a, s) => a + num(s.reps) * num(s.lbs), 0);
const bestOf = ex => { let b = 0; ex.history.forEach(h => h.sets.forEach(s => b = Math.max(b, est1rm(num(s.reps), num(s.lbs))))); return b; };

function commitWorkout(i, durationMs) {
  const w = wk(i.wid); const sum = { ex: [], up: 0, down: 0, same: 0, prs: 0, vol: 0, pvol: 0, logged: 0 };
  w.ex.forEach(ex => {
    const sets = filled(i.log && i.log[ex.id]).map(s => ({ reps: String(num(s.reps)), lbs: String(num(s.lbs)) }));
    const pv0 = prevFor(ex, i), pv = pv0 && pv0.fromGym ? null : pv0, gid = gymOf(i);
    const priorBest = (() => { let b = 0; ex.history.filter(h => h.instId !== i.id && hGym(h) === gid).forEach(h => h.sets.forEach(s => b = Math.max(b, est1rm(num(s.reps), num(s.lbs))))); return b; })();
    ex.history = ex.history.filter(h => h.instId !== i.id);
    if (sets.length) {
      ex.history.push({ date: i.date, instId: i.id, w: w.name, sets, gym: gid });
      ex.history.sort((a, b) => b.date.localeCompare(a.date));
      sum.logged++;
      const ds = sets.map((s, k) => deltaOf(pv, k, s)).filter(Boolean);
      const dir = ds.some(d => d.d === 'up') && !ds.some(d => d.d === 'down') ? 'up' : ds.some(d => d.d === 'down') && !ds.some(d => d.d === 'up') ? 'down' : ds.length && ds.every(d => d.d === 'same') ? 'same' : (ds.some(d => d.d === 'up') ? 'up' : 'same');
      sum[dir]++;
      const nb = Math.max(...sets.map(s => est1rm(num(s.reps), num(s.lbs))));
      const pr = pv && nb > priorBest + 0.01;
      if (pr) sum.prs++;
      sum.vol += volume(sets); if (pv) sum.pvol += volume(pv);
      sum.ex.push({ name: ex.name, sets, dir: pv ? dir : 'new', pr, pv });
    }
  });
  i.gym = gymOf(i); S.gym = i.gym;
  i.done = true; i.doneAt = Date.now(); if (durationMs) i.duration = durationMs;
  if (S.active && S.active.id === i.id) S.active = null;
  save();
  return sum;
}

/* ---- nutrition ---- */
const dayMeals = d => S.diary[d] || [];
function totals(d) { return dayMeals(d).reduce((a, x) => ({ cal: a.cal + +x.cal, p: a.p + +x.p, c: a.c + +x.c, f: a.f + +x.f }), { cal: 0, p: 0, c: 0, f: 0 }); }
function logPlanMeal(date, n, k) {
  const id = `plan-${n}-${k}`; const arr = S.diary[date] = S.diary[date] || [];
  const at = arr.findIndex(x => x.id === id);
  if (at >= 0) { arr.splice(at, 1); } else {
    const m = MEAL_PLAN.days[n - 1].meals[k];
    arr.push({ id, name: (m[1] || m[0]), slot: m[0], cal: m[3], p: m[4], c: m[5], f: m[6], plan: true });
  }
  save();
}

/* ---- goals ---- */
const goalsList = () => (S.goals = S.goals || []);
function bestLift(name, minReps) { let b = 0; Object.values(S.workouts).forEach(w => w.ex.forEach(e => { if (e.name === name) e.history.forEach(h => h.sets.forEach(s => { if (num(s.reps) >= (minReps || 1)) b = Math.max(b, num(s.lbs)); })); })); return b; }
function goalProgress(g) {
  let cur, pct, label;
  if (g.type === 'weight') { const l = mlatest('weight'); cur = l ? num(l[1]) : g.startVal; const st = g.startVal ?? cur; pct = st === g.target ? (cur === g.target ? 1 : 0) : (st - cur) / (st - g.target); label = fnum(cur) + ' → ' + fnum(g.target) + ' lbs'; }
  else if (g.type === 'lift') { cur = bestLift(g.exName, g.reps); pct = g.target ? cur / g.target : 0; label = 'best ' + fnum(cur) + ' / ' + fnum(g.target) + ' lbs' + (g.reps > 1 ? ' × ' + g.reps : ''); }
  else { const st = g.startVal || 0; cur = g.cur ?? st; pct = g.target === st ? (cur >= g.target ? 1 : 0) : (cur - st) / (g.target - st); label = fnum(cur) + ' / ' + fnum(g.target) + ' ' + (g.unit || ''); }
  return { cur, pct: Math.max(0, Math.min(1, isNaN(pct) ? 0 : pct)), label };
}
function goalCard(g) {
  const p = goalProgress(g), days = g.by ? diffDays(todayStr(), g.by) : null;
  return `<div class="card press" data-act="goalmenu" data-id="${g.id}"><div class="row"><span style="color:var(--accent2)">${ic(g.type === 'lift' ? 'dumbbell' : g.type === 'weight' ? 'scale' : 'target', 24)}</span><div class="grow"><div class="b" style="font-size:16px">${esc(g.name)}</div><div class="xs mute">${esc(p.label)}${days != null ? ' · ' + (days >= 0 ? days + ' day' + (days === 1 ? '' : 's') + ' left' : 'overdue') : ''}</div></div><span class="b">${Math.round(p.pct * 100)}%</span></div>
  <div class="pbar ${p.pct >= 1 ? 'done' : ''}"><i style="width:${p.pct * 100}%"></i></div>${p.pct >= 1 ? '<div class="xs" style="color:var(--green);font-weight:700;margin-top:8px">Goal reached 🎉</div>' : ''}</div>`;
}
const allExNames = () => [...new Set(Object.values(S.workouts).flatMap(w => w.ex.map(e => e.name)))];
const BASE_EQ = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Kettlebell', 'Bands'];
const GROUPS = [['legs', 'Legs'], ['back', 'Back'], ['chest', 'Chest'], ['shoulders', 'Shoulders'], ['arms', 'Arms'], ['core', 'Core']];
const allEquip = () => [...BASE_EQ, ...(S.equipment || []).filter(x => !BASE_EQ.includes(x))];
const equipOf = w => [...new Set([...(w.equip || []), ...w.ex.flatMap(e => e.equip || [])])];
const wShort = w => w.name.split('/')[0];

/* ---- habits / metrics ---- */
function streaks(h) {
  let run = 0, best = h.longest || 0; const t = todayStr();
  for (let d = '2026-10-27'; d <= t; d = addDays(d, 1)) { if (S.habitDone[d + '|' + h.id]) { run++; best = Math.max(best, run); } else run = 0; }
  let cur = 0, dd = S.habitDone[t + '|' + h.id] ? t : addDays(t, -1);
  while (S.habitDone[dd + '|' + h.id]) { cur++; dd = addDays(dd, -1); }
  return { cur, best };
}
const METRICS = {
  weight: { name: 'Body Weight', unit: 'lbs', icon: 'scale', step: 0.1, ph: 'e.g. 150.5' },
  steps: { name: 'Steps', unit: 'steps', icon: 'steps', step: 1, ph: 'e.g. 10000' },
  sleep: { name: 'Sleep', unit: 'hrs', icon: 'moon', step: 0.1, ph: 'e.g. 7.5' },
  bodyfat: { name: 'Body Fat', unit: '%', icon: 'flame', step: 0.1, ph: 'e.g. 14.5' },
  rhr: { name: 'Resting Heart Rate', unit: 'bpm', icon: 'heart', step: 1, ph: 'e.g. 58' },
  bp: { name: 'Blood Pressure', unit: 'mmHg', icon: 'heart', text: true, ph: 'e.g. 118/76' }
};
const mseries = k => Object.entries(S.metrics[k] || {}).sort((a, b) => a[0].localeCompare(b[0]));
const mlatest = k => { const s = mseries(k); return s.length ? s[s.length - 1] : null; };

/* ====================== chart helpers ====================== */
function lineChart(pts, o = {}) {
  if (pts.length < 2) return `<div class="empty small" style="padding:24px 0">${pts.length ? 'Add another entry to see the trend line.' : 'No entries yet.'}</div>`;
  const W = 320, H = o.h || 130, pd = 8; const ys = pts.map(p => p.y); let lo = Math.min(...ys), hi = Math.max(...ys); if (hi === lo) { hi += 1; lo -= 1; }
  const span = (hi - lo) * 1.2, mn = lo - (hi - lo) * .1;
  const x0 = diffDays(pts[0].x, pts[0].x), xs = pts.map(p => diffDays(pts[0].x, p.x)), xm = Math.max(...xs) || 1;
  const X = i => pd + (xs[i] / xm) * (W - 2 * pd), Y = v => H - pd - ((v - mn) / span) * (H - 2 * pd);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.y).toFixed(1)).join(' ');
  const area = line + ` L${X(pts.length - 1).toFixed(1)} ${H} L${X(0).toFixed(1)} ${H} Z`;
  const gid = 'g' + uid();
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px"><defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${o.color || '#f5c518'}" stop-opacity=".35"/><stop offset="1" stop-color="${o.color || '#f5c518'}" stop-opacity="0"/></linearGradient></defs>
  <path d="${area}" fill="url(#${gid})"/><path d="${line}" fill="none" stroke="${o.color || '#e6b400'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  ${pts.length <= 40 ? pts.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="3.2" fill="var(--card)" stroke="${o.color || '#e6b400'}" stroke-width="2" vector-effect="non-scaling-stroke"/>`).join('') : ''}</svg>
  <div class="chartlab"><span>${shortDate(pts[0].x)}</span><span>${fnum(lo)} – ${fnum(hi)} ${o.unit || ''}</span><span>${shortDate(pts[pts.length - 1].x)}</span></div></div>`;
}
function barChart(vals, goal, color) {
  const W = 320, H = 100, n = vals.length, bw = W / n; const mx = Math.max(goal * 1.25, ...vals.map(v => v.v), 1);
  const gy = H - (goal / mx) * H;
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">
  ${vals.map((v, i) => { const h = (v.v / mx) * H; return `<rect x="${(i * bw + bw * .18).toFixed(1)}" y="${(H - h).toFixed(1)}" width="${(bw * .64).toFixed(1)}" height="${Math.max(h, v.v ? 2 : 0).toFixed(1)}" rx="3" fill="${color}" opacity="${v.d === todayStr() ? 1 : .8}"/>`; }).join('')}
  <line x1="0" x2="${W}" y1="${gy}" y2="${gy}" stroke="#f5c518" stroke-width="1.5" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/></svg>
  <div class="chartlab"><span>${shortDate(vals[0].d)}</span><span>goal ${goal}</span><span>${shortDate(vals[n - 1].d)}</span></div></div>`;
}
function ring(val, goal, color, sz, main, sub) {
  const r = (sz - 9) / 2, c = 2 * Math.PI * r, p = Math.min(1, goal ? val / goal : 0);
  return `<div style="position:relative;width:${sz}px;height:${sz}px;margin:6px auto"><svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}"><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="5"/><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${sz / 2} ${sz / 2})"/></svg>
  <div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;line-height:1.1"><div><b style="font-size:16px">${main}</b><div class="xs mute" style="font-size:10px">${sub}</div></div></div></div>`;
}
const macroRings = d => { const t = totals(d), g = S.goal; return `<div class="macros">
  <div><div class="l">Calories</div>${ring(t.cal, g.cal, '#e5484d', 64, Math.round(t.cal), '/ ' + g.cal + ' cal')}<div class="r">${Math.max(0, g.cal - Math.round(t.cal))} cal left</div></div>
  <div><div class="l">Protein</div>${ring(t.p, g.p, '#22a559', 64, Math.round(t.p) + 'g', '/ ' + g.p + 'g')}<div class="r">${Math.max(0, g.p - Math.round(t.p))}g left</div></div>
  <div><div class="l">Carbs</div>${ring(t.c, g.c, '#0a7aff', 64, Math.round(t.c) + 'g', '/ ' + g.c + 'g')}<div class="r">${Math.max(0, g.c - Math.round(t.c))}g left</div></div>
  <div><div class="l">Fat</div>${ring(t.f, g.f, '#f59e0b', 64, Math.round(t.f) + 'g', '/ ' + g.f + 'g')}<div class="r">${Math.max(0, g.f - Math.round(t.f))}g left</div></div></div>`; };

/* ====================== views ====================== */
function workoutCard(i) {
  const w = wk(i.wid); const n = w.ex.filter(e => filled(i.log && i.log[e.id]).length).length;
  const prog = S.active && S.active.id === i.id;
  return `<div class="card press wcard" data-act="open" data-id="${i.id}"><div class="row"><div class="dotc blue ${i.done ? 'on' : ''} ${prog ? 'prog' : ''}">${i.done ? ic('check', 15, '', 3) : ''}</div><div class="grow name">${esc(w.name)}</div>
    <button class="iconbtn" data-act="move" data-id="${i.id}" aria-label="Move to another day">${ic('move', 20)}</button><span class="chev">${ic('chevr', 20)}</span></div>
    <div class="meta">${i.done ? `Completed · ${n}/${w.ex.length} exercises logged${i.duration ? ' · ' + Math.round(i.duration / 60000) + ' min' : ''}` : prog ? 'In progress — tap to resume' : 'Complete your scheduled workout.'}</div></div>`;
}
function weightCard(d) {
  const v = S.metrics.weight[d];
  return `<div class="card press" data-act="weightlog" data-d="${d}"><div class="row"><div class="dotc orange ${v ? '' : ''}" style="${v ? '' : 'background:transparent'}">${v ? ic('check', 15, '', 3) : ''}</div>
  <div class="grow"><div class="b" style="font-size:17px">${v ? v + ' lbs' : 'Log your weight'}</div><div class="small mute">${v ? 'Tap to edit' : 'Takes 3 seconds — track it every day'}</div></div>${v ? '' : `<span class="chip on" style="padding:8px 14px">${ic('plus', 16, '', 2.6)} Add</span>`}</div></div>`;
}
function nutritionCard(d) {
  return `<div class="card press" data-act="gomeals" data-d="${d}"><div class="row"><div class="dotc red"></div><div class="grow b" style="font-size:17px">Daily nutrition goal</div><span class="chev">${ic('chevr', 20)}</span></div>
  ${macroRings(d)}<div class="xs mute" style="text-align:center;margin-top:12px">Meal plan · Day ${planDayFor(d)} — tap to log meals</div></div>`;
}
function habitRows(d) {
  return S.habits.map(h => { const on = S.habitDone[d + '|' + h.id]; return `<div class="card press" data-act="habit" data-id="${h.id}" data-d="${d}" style="padding:14px 16px"><div class="row"><div class="dotc ${on ? 'on' : ''}">${on ? ic('check', 15, '', 3) : ''}</div><div class="grow ell" style="font-size:16px">${esc(h.short)}</div><span class="chev">${ic('chevr', 20)}</span></div></div>`; }).join('');
}
const dayItems = d => weightCard(d) + nutritionCard(d) + itemsOn(d).map(workoutCard).join('') + habitRows(d);

function avatarBtn() { return `<button class="avatar" data-act="settings" aria-label="Settings">A</button>`; }

function homeView() {
  const t = todayStr(); let days = '';
  for (let k = -7; k <= 14; k++) {
    const d = addDays(t, k), dt = parse(d), w = itemsOn(d).length;
    days += `<div class="day ${d === selDay ? 'sel' : ''}" id="day-${d}" data-act="selday" data-d="${d}"><b>${dt.getDate()}</b><span>${DOW[dt.getDay()]}</span><i class="${w ? 'w' : d === t ? 't' : ''}"></i></div>`;
  }
  return `<div class="large"><div class="grow"><div class="sub">${selDay === t ? 'Today' : DOW[parse(selDay).getDay()]}</div><h1>${MON[parse(selDay).getMonth()]} ${ord(parse(selDay).getDate())}</h1></div>${selDay !== t ? `<button class="chip" data-act="gotoday">Today</button>` : ''}${avatarBtn()}</div>
  <div class="scroll" id="sc-home"><div class="strip" id="strip">${days}</div>${dayItems(selDay)}
  <div class="sec"><span class="grow">My Progress</span></div><div class="tiles">${tiles()}</div></div>`;
}
function tiles() {
  const mk = (k, ic_) => { const m = METRICS[k], l = mlatest(k); const ser = mseries(k).slice(-14).map(([d, v]) => ({ x: d, y: num(v) })).filter(p => !isNaN(p.y));
    const spark = ser.length > 1 ? (() => { const ys = ser.map(p => p.y), lo = Math.min(...ys), hi = Math.max(...ys) || 1, rg = (hi - lo) || 1; return `<svg viewBox="0 0 100 24" preserveAspectRatio="none" style="position:absolute;left:0;right:0;bottom:0;width:100%;height:26px"><path d="${ser.map((p, i) => (i ? 'L' : 'M') + (i / (ser.length - 1) * 100).toFixed(1) + ' ' + (22 - (p.y - lo) / rg * 18).toFixed(1)).join(' ')}" fill="none" stroke="#f5c518" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`; })() : '';
    return `<div class="tile press" data-act="metric" data-k="${k}"><div class="row"><span class="tt grow">${m.name}</span><span class="faint">${ic(m.icon, 18)}</span></div>
    ${l ? `<div class="s">${l[0] === addDays(todayStr(), -1) ? 'Yesterday' : l[0] === todayStr() ? 'Today' : shortDate(l[0])}</div><div class="v">${esc(l[1])} <small>${m.unit}</small></div>` : `<div class="v faint">—</div><div class="s">Tap to add</div>`}${spark}</div>`; };
  const t = totals(todayStr());
  return mk('weight') + mk('steps') + mk('sleep') + mk('bodyfat') + mk('rhr') + mk('bp') +
    `<div class="tile press" data-act="nutgraph"><div class="row"><span class="tt grow">Caloric Intake</span><span class="faint">${ic('utensils', 18)}</span></div><div class="s">Today</div><div class="v">${Math.round(t.cal)} <small>cal</small></div></div>`;
}

function calGrid(y, m, sel, mark) {
  const first = new Date(y, m, 1), start = new Date(y, m, 1 - first.getDay()); let h = DOW.map(d => `<div class="h">${d[0]}</div>`).join('');
  for (let k = 0; k < 42; k++) { const d = new Date(start); d.setDate(start.getDate() + k); const s = fmt(d);
    h += `<div class="d ${d.getMonth() !== m ? 'out' : ''} ${s === todayStr() ? 'today' : ''} ${s === sel ? 'sel' : ''}" data-act="dppick" data-d="${s}">${d.getDate()}${mark && mark(s) ? '<i></i>' : ''}</div>`; }
  return `<div class="calhd"><button class="iconbtn" data-act="dpnav" data-n="-1">${ic('chevl')}</button><b>${MON[m]} ${y}</b><button class="iconbtn" data-act="dpnav" data-n="1">${ic('chevr')}</button></div><div class="cal">${h}</div>`;
}
function calendarView() {
  const t = todayStr();
  let body = '';
  if (calSeg === 'month') {
    dp = dp && dp.kind === 'cal' ? dp : { kind: 'cal', y: parse(selDay).getFullYear(), m: parse(selDay).getMonth() };
    body = `<div class="card" id="dpwrap">${calGrid(dp.y, dp.m, selDay, d => itemsOn(d).length)}</div><div class="dayhead">${lbl(selDay)}</div>${dayItems(selDay)}`;
  } else {
    for (let k = -10; k <= 14; k++) { const d = addDays(t, k); body += `<div class="dayhead" id="cal-${d}">${d === t ? '<span class="dd"></span>' : ''}${d === t ? 'Today, ' + MON[parse(d).getMonth()] + ' ' + ord(parse(d).getDate()) : d === addDays(t, 1) ? 'Tomorrow, ' + MON[parse(d).getMonth()] + ' ' + ord(parse(d).getDate()) : d === addDays(t, -1) ? 'Yesterday, ' + MON[parse(d).getMonth()] + ' ' + ord(parse(d).getDate()) : longDay(d)}</div>${dayItems(d)}`; }
  }
  return `<div class="large"><h1>Calendar</h1>${avatarBtn()}</div><div class="scroll" id="sc-cal"><div class="seg"><button class="${calSeg === 'list' ? 'on' : ''}" data-act="calseg" data-v="list">List</button><button class="${calSeg === 'month' ? 'on' : ''}" data-act="calseg" data-v="month">Month</button></div>${body}</div>`;
}
function workoutsView() {
  const p = S.program;
  return `<div class="large"><h1>${esc(p.name)}</h1>${avatarBtn()}</div><div class="scroll"><div class="row" style="margin:6px 2px 0"><span class="chip" style="padding:4px 10px;font-size:12px">${esc(p.label)}</span></div>
  <div class="b" style="margin:14px 2px 2px;font-size:18px">${p.weeks}</div><div class="small mute" style="margin:0 2px 8px">${p.range}</div>
  ${Object.values(S.workouts).map(w => { const id = w.id; const grad = id === 'lower' ? '#38bdf8,#1d4ed8' : id === 'upper' ? '#a78bfa,#5b21b6' : ['#34d399,#047857', '#fb7185,#be123c', '#fbbf24,#d97706', '#f472b6,#be185d'][[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 4]; return `<div class="card press row" data-act="tmpl" data-id="${id}" style="padding:12px;gap:14px"><div class="thumb" style="width:84px;height:84px;border-radius:14px;background:linear-gradient(135deg,${grad})">${ic('dumbbell', 40, '', 2)}</div><div class="grow"><div class="b" style="font-size:17px;line-height:1.25">${esc(w.name)}</div><div class="small mute" style="margin-top:8px">est. ${esc(w.est)} · ${w.ex.length} Exercises</div></div><span class="chev">${ic('chevr', 20)}</span></div>`; }).join('')}
  <button class="btn soft block" data-act="newworkout" style="margin-top:6px">${ic('plus', 18, '', 2.4)} &nbsp;New workout</button>
  <div class="sec"><span class="grow">Schedule a workout</span></div>
  <div class="card"><div class="small mute" style="margin-bottom:12px">Put a workout on any day. You can always move it later from the calendar.</div><div class="chips">${Object.values(S.workouts).map(w => `<button class="chip on" data-act="schedule" data-id="${w.id}">${ic('plus', 15, '', 2.6)} ${esc(wShort(w))}</button>`).join('')}</div></div></div>`;
}
function goalsView() {
  const g = S.goal, tot = g.p * 4 + g.c * 4 + g.f * 9 || 1;
  return `<div class="large"><h1>Goals</h1>${avatarBtn()}</div><div class="scroll"><div class="card press" data-act="editgoal"><div class="row" style="align-items:flex-start"><span style="color:var(--accent2)">${ic('target', 26)}</span><div class="grow b" style="font-size:17px">Eat ${g.cal} Calories per day, with the following macro split</div></div>
  <div class="macros" style="text-align:left;margin-top:14px;grid-template-columns:repeat(3,1fr)"><div><b style="font-size:17px">${Math.round(g.p * 4 / tot * 100)}% ${g.p}g</b><div class="xs mute">Protein Goal</div></div><div><b style="font-size:17px">${Math.round(g.c * 4 / tot * 100)}% ${g.c}g</b><div class="xs mute">Carbs Goal</div></div><div><b style="font-size:17px">${Math.round(g.f * 9 / tot * 100)}% ${g.f}g</b><div class="xs mute">Fat Goal</div></div></div></div>
  <div class="row" style="gap:10px"><button class="btn soft grow sm" data-act="nutgraph">${ic('trend', 16)} Nutrition Graph</button><button class="btn soft grow sm" data-act="metric" data-k="weight">${ic('scale', 16)} Weight Trend</button></div>
  <div class="sec"><span class="grow">My goals</span><button data-act="addgoal">+ Add goal</button></div>
  ${goalsList().length ? goalsList().map(goalCard).join('') : `<div class="card press" data-act="addgoal" style="text-align:center;padding:26px 16px"><div style="color:var(--accent2)">${ic('target', 34)}</div><div class="b" style="margin:8px 0 4px">Set your first goal</div><div class="small mute">Body weight, a lift (e.g. 225 lb bench), a daily habit, or anything custom.</div></div>`}
  <div class="sec"><span class="grow">Habits</span><button data-act="addhabit">+ Add habit</button></div>
  ${S.habits.length ? S.habits.map(h => { const s = streaks(h); return `<div class="hbanner ${s.cur ? 'on' : ''}">${s.cur ? '🔥 ' + s.cur + '-day streak — keep it going' : 'Start a new streak by completing this habit.'}</div><div class="card" style="margin-top:0;border-radius:0 0 18px 18px"><div class="row" style="align-items:flex-start"><div class="grow b" style="font-size:17px">${esc(h.name)}</div><button class="iconbtn" style="margin:-8px -8px 0 0" data-act="habitmenu" data-id="${h.id}">${ic('more', 20)}</button></div><div class="xs mute" style="margin-top:4px">${h.range}</div>
   <div class="streak"><div>Current streak<br><b>${s.cur || '-'}</b> ${s.cur === 1 ? 'day' : 'days'}</div><div>Longest streak<br><b>${s.best || '-'}</b> ${s.best === 1 ? 'day' : 'days'}</div></div></div>`; }).join('') : '<div class="empty small">No habits yet — add one above.</div>'}</div>`;
}

/* ---- meals ---- */
function planDayView() {
  const n = planDay, D = MEAL_PLAN.days[n - 1], ld = selDay; const logged = new Set(dayMeals(ld).map(x => x.id));
  const nowDay = planDayFor(todayStr());
  return `<div class="hscroll" style="margin-bottom:6px">${MEAL_PLAN.days.map(d => `<button class="chip ${d.n === n ? 'on' : ''}" data-act="pday" data-n="${d.n}">Day ${d.n}${d.n === nowDay ? ' · today' : ''}</button>`).join('')}</div>
  <div class="card"><div class="row"><div class="grow"><div class="b" style="font-size:19px">Day ${n}</div><div class="small mute">${D.tot[0].toLocaleString()} cal · P ${D.tot[1]}g · C ${D.tot[2]}g · F ${D.tot[3]}g</div></div><button class="btn sm" data-act="logday" data-n="${n}">Log day</button></div>
  <div class="xs mute" style="margin-top:6px">Logging to <b>${lbl(ld)}</b> · <button class="link" data-act="logdate" style="font-size:12px">change</button></div>
  <div style="margin-top:8px">${D.meals.map((m, k) => `<div class="meal"><div><div class="sl">${m[0].toUpperCase()}</div>${m[1] ? `<div class="mt">${esc(m[1])}</div>` : ''}<div class="md">${esc(m[2])}</div></div><div class="mc"><b>${m[3]} cal</b>P${m[4]} · C${m[5]} · F${m[6]}<button class="lg ${logged.has(`plan-${n}-${k}`) ? 'on' : ''}" data-act="logmeal" data-n="${n}" data-k="${k}" aria-label="Log meal">${ic('check', 15, '', 3)}</button></div></div>`).join('')}</div></div>`;
}
function diaryView() {
  const d = diaryDay, ml = dayMeals(d);
  return `<div class="card"><div class="row"><button class="iconbtn" data-act="diaryn" data-n="-1">${ic('chevl')}</button><div class="grow b" style="text-align:center;font-size:17px">${lbl(d)}</div><button class="iconbtn" data-act="diaryn" data-n="1">${ic('chevr')}</button></div>${macroRings(d)}</div>
  ${ml.length ? `<div class="card" style="padding:4px 16px">${ml.map((m, k) => `<div class="sumrow"><div class="grow"><div class="b" style="font-size:15px">${esc(m.name)}</div><div class="xs mute">${m.slot ? m.slot + ' · ' : ''}${Math.round(m.cal)} cal · P${Math.round(m.p)} C${Math.round(m.c)} F${Math.round(m.f)}</div></div><button class="iconbtn" data-act="delmeal" data-d="${d}" data-k="${k}">${ic('trash', 18)}</button></div>`).join('')}</div>` :
    `<div class="empty"><div style="color:var(--faint)">${ic('utensils', 56, '', 1.4)}</div><div class="b" style="font-size:18px;color:var(--ink);margin:12px 0 4px">No meals added for ${d === todayStr() ? 'today' : 'this day'}</div>Log from your plan or add your own.</div>`}
  <div class="row" style="gap:10px"><button class="btn soft grow sm" data-act="mealsseg" data-v="plan" data-pick="${d}">From meal plan</button><button class="btn grow sm" data-act="addmeal" data-d="${d}">${ic('plus', 16, '', 2.6)} Add meal</button></div>`;
}
const swapsView = () => `<div class="card"><div class="small mute" style="margin-bottom:6px">${MEAL_PLAN.swapsNote}</div>${MEAL_PLAN.swaps.map(s => `<div class="swp"><div class="sh2">${esc(s[0])}</div><div style="font-size:15px;line-height:1.5">${esc(s[1])}</div></div>`).join('')}</div>`;
const recipesView = () => `<div class="card">${MEAL_PLAN.recipes.map(r => `<div class="rcp"><div class="rh"><b>${esc(r[0])}</b><span class="xs mute">${esc(r[1])}</span></div><div style="font-size:15px;line-height:1.5;margin-top:6px">${esc(r[2])}</div></div>`).join('')}</div>`;
function groceryView() {
  const gc = S.plan.grocery; const all = MEAL_PLAN.grocery.flatMap(g => g[1]); const done = all.filter(i => gc[i[0]]).length;
  return `<div class="row" style="margin:4px 2px"><div class="grow small mute">${MEAL_PLAN.groceryNote} · ${done}/${all.length} checked</div><button class="link small" data-act="grocopy">Copy list</button><button class="link small" data-act="groclear" style="margin-left:12px">Clear</button></div>
  ${MEAL_PLAN.grocery.map(g => `<div class="sec" style="margin-top:14px">${g[0]}</div><div class="card" style="padding:2px 16px;margin-top:0">${g[1].map(i => `<div class="gro ${gc[i[0]] ? 'done' : ''}" data-act="grocheck" data-n="${esc(i[0])}"><div class="dotc ${gc[i[0]] ? 'on' : ''} green" style="width:24px;height:24px">${gc[i[0]] ? ic('check', 13, '', 3) : ''}</div><div class="grow gn" style="font-size:15px">${esc(i[0])}</div><div class="small mute" style="text-align:right;max-width:46%">${esc(i[1])}</div></div>`).join('')}</div>`).join('')}`;
}
function mealsView() {
  const segs = [['plan', 'Plan'], ['diary', 'Diary'], ['swaps', 'Swaps'], ['recipes', 'Recipes'], ['grocery', 'Grocery']];
  const body = { plan: planDayView, diary: diaryView, swaps: swapsView, recipes: recipesView, grocery: groceryView }[mealsSeg]();
  return `<div class="large"><div class="grow"><div class="sub">${esc(MEAL_PLAN.title)} · ${MEAL_PLAN.macros.cal.toLocaleString()} cal · ${MEAL_PLAN.macros.p}P · ${MEAL_PLAN.macros.c}C · ${MEAL_PLAN.macros.f}F</div><h1>Meals</h1></div>${avatarBtn()}</div>
  <div class="scroll" id="sc-meals"><div class="seg">${segs.map(s => `<button class="${mealsSeg === s[0] ? 'on' : ''}" data-act="mealsseg" data-v="${s[0]}">${s[1]}</button>`).join('')}</div>${body}</div>`;
}

const baseViews = { home: homeView, calendar: calendarView, workouts: workoutsView, goals: goalsView, meals: mealsView };
function tabbar() {
  const T = [['home', 'home', 'Home'], ['calendar', 'calendar', 'Calendar'], ['workouts', 'dumbbell', 'Workouts'], ['goals', 'target', 'Goals'], ['meals', 'utensils', 'Meals']];
  return `<div class="tabbar">${T.map(x => `<button class="tab ${tab === x[0] ? 'on' : ''}" data-act="tab" data-t="${x[0]}"><span class="pill">${ic(x[1], 22)}</span>${x[2]}</button>`).join('')}</div>`;
}
function activeBanner() {
  if (!S.active) return '';
  const i = inst(S.active.id); if (!i) return '';
  return `<div class="banner" data-act="resume"><span class="rd"></span><div class="grow ell"><b>Workout in progress</b><div class="xs" style="opacity:.8">${esc(wk(i.wid).name)}</div></div><span class="b" id="bannerclk">${clock(Date.now() - S.active.startedAt)}</span><button class="bx" data-act="endmenu" aria-label="End workout">${ic('x', 18, '', 2.4)}</button></div>`;
}

/* ---- screens (pushed) ---- */
function previewView(p) {
  const i = p.id ? inst(p.id) : null, w = wk(i ? i.wid : p.wid);
  const ttl = i ? (i.date === todayStr() ? 'Today' : longDay(i.date)) : 'Workout';
  return `<div class="top"><button class="iconbtn" data-act="back">${ic('x')}</button><div class="t">${ttl}</div><button class="iconbtn" data-act="${i ? 'move' : 'schedule'}" data-id="${i ? i.id : w.id}">${ic(i ? 'move' : 'plus')}</button><button class="iconbtn" data-act="wmenu2" data-w="${w.id}" aria-label="Workout options">${ic('more')}</button></div>
  <div class="scroll"><div class="row" style="align-items:flex-start;margin-top:4px"><div class="dotc blue ${i && i.done ? 'on' : ''}" style="margin-top:6px">${i && i.done ? ic('check', 15, '', 3) : ''}</div><h1 class="grow" style="margin:0;font-size:27px;line-height:1.2;letter-spacing:-.4px">${esc(w.name)}</h1></div>
  <div class="row" style="margin-top:16px;color:var(--mute)">${ic('list', 18)}<span class="grow ink" style="color:var(--ink)">Regular</span>${i && !i.done ? `<button class="link" data-act="complete" data-id="${i.id}">Mark as Complete</button>` : ''}</div>
  ${i ? `<div class="row press" data-act="gympick" data-id="${i.id}" style="margin-top:14px;color:var(--mute)">${ic('target', 18)}<span class="grow" style="color:var(--ink)">Gym: <b>${esc(gymName(gymOf(i)))}</b></span><span class="link">Change</span></div>` : ''}
  <div class="row" style="margin-top:10px;color:var(--mute)">${ic('clock', 18)}<span style="color:var(--ink)">est. ${w.est}</span></div>
  <div class="row" style="margin-top:10px;color:var(--mute)">${ic('dumbbell', 18)}<span style="color:var(--ink)">${w.ex.length} Exercises</span></div>
  <div class="sec" style="margin-top:22px">Equipment</div><div class="row" style="gap:12px;flex-wrap:wrap">${!equipOf(w).length ? '<button class="link" data-act="eqsheet" data-w="' + w.id + '">+ Add equipment</button>' : ''}${equipOf(w).map(e => `<div style="text-align:center;font-size:12px;font-weight:600"><div class="thumb" style="background:var(--card);color:var(--ink);box-shadow:var(--shadow);width:68px;height:56px;margin-bottom:6px">${ic(EQ[e] || 'dumbbell', 24)}</div>${e}</div>`).join('')}</div>
  <div class="sec">Instructions</div><div class="card" style="margin-top:0;white-space:pre-line;font-size:15px;line-height:1.5">${esc(w.instr)}</div>
  <div class="sec"><span class="grow">Exercises</span></div>
  ${w.ex.length ? '' : '<div class="empty small">No exercises yet — add your first one below.</div>'}
  ${w.ex.map(e => `<div class="card press row" data-act="exinfo" data-w="${w.id}" data-e="${e.id}" style="padding:12px;margin:8px 0">${thumb(e.kind, 50)}<div class="grow"><div class="exn">${esc(e.name)}</div><div class="exd">${esc(e.desc)}, ${e.rest}m rest between sets</div></div><span style="color:var(--blue)">${ic('note', 20)}</span><button class="iconbtn" style="width:34px" data-act="exedit" data-w="${w.id}" data-e="${e.id}" aria-label="Exercise options">${ic('more', 20)}</button></div>`).join('')}
  <button class="add" data-act="addex" data-w="${w.id}" style="margin:10px auto">${ic('plus', 18, '', 2.4)} Add exercise</button></div>
  <div class="sticky"><button class="btn" ${w.ex.length ? '' : 'disabled style="opacity:.5"'} data-act="start" data-id="${i ? i.id : ''}" data-w="${w.id}" style="min-width:210px">${i && i.done ? 'Edit Log' : S.active && i && S.active.id === i.id ? 'Resume' : 'Start Now'}</button></div>`;
}
function exInfoView(p) {
  const w = wk(p.w), e = w.ex.find(x => x.id === p.e); if (exGym !== 'all' && !S.gyms.some(g => g.id === exGym)) exGym = 'all';
  const hist = e.history.filter(h => exGym === 'all' || hGym(h) === exGym).sort((a, b) => b.date.localeCompare(a.date)); const multi = S.gyms.length > 1;
  const best = (() => { let b = 0; hist.forEach(h => h.sets.forEach(s => b = Math.max(b, est1rm(num(s.reps), num(s.lbs))))); return b; })();
  const pts = hist.slice().reverse().map(h => ({ x: h.date, y: Math.max(...h.sets.map(s => est1rm(num(s.reps), num(s.lbs)))) })).filter(p => p.y > 0);
  const bd = (() => { let b = 0, d = ''; hist.forEach(h => h.sets.forEach(s => { const v = est1rm(num(s.reps), num(s.lbs)); if (v > b) { b = v; d = h.date; } })); return d; })();
  return `<div class="top"><button class="iconbtn" data-act="back">${ic('chevl')}</button><div class="t"></div><button class="iconbtn" data-act="editnote" data-w="${w.id}" data-e="${e.id}">${ic('pencil')}</button></div>
  <div class="scroll"><div class="thumb" style="width:100%;height:150px;border-radius:20px;background:linear-gradient(135deg,${(KIND[e.kind] || KIND.legs)[0]},${(KIND[e.kind] || KIND.legs)[1]})">${ic('dumbbell', 72, '', 1.6)}</div>
  <h1 style="font-size:25px;margin:16px 2px 6px;line-height:1.2">${esc(e.name)}</h1><div class="small mute" style="margin:0 2px 4px">${esc(e.desc)}, ${e.rest}m rest between sets</div>
  <div class="card"><div class="row"><b class="grow">Note</b><button class="iconbtn" data-act="editnote" data-w="${w.id}" data-e="${e.id}">${ic('pencil', 18)}</button><button class="iconbtn" data-act="delnote" data-w="${w.id}" data-e="${e.id}">${ic('trash', 18)}</button></div><div style="margin-top:4px;white-space:pre-line;font-size:15px;line-height:1.5">${e.note ? esc(e.note) : '<span class="mute">No note yet — tap the pencil to add how it felt, machine settings, form cues…</span>'}</div></div>
  ${best ? `<div class="pr"><div><div class="xs mute">Personal Best To Beat</div><div class="b" style="font-size:16px">Estimated 1 rep max</div>${bd ? `<div class="xs mute">${niceDate(bd)}</div>` : ''}</div><b>${best.toFixed(2)} <small style="font-size:15px;font-weight:600">lbs</small></b></div>` : ''}
  ${pts.length > 1 ? `<div class="card"><b>Strength trend</b><div class="xs mute">Estimated 1RM per session</div>${lineChart(pts, { unit: 'lbs', h: 120 })}</div>` : ''}
  ${multi ? `<div class="row" style="gap:8px;flex-wrap:wrap;margin:14px 0 0"><button class="chip ${exGym === 'all' ? 'on' : ''}" data-act="exgym" data-g="all">All gyms</button>${S.gyms.map(g => `<button class="chip ${exGym === g.id ? 'on' : ''}" data-act="exgym" data-g="${g.id}">${esc(g.name)}</button>`).join('')}</div>` : ''}
  ${multi ? (() => { const rows = S.gyms.map(g => { const hs = e.history.filter(h => hGym(h) === g.id).sort((a, b) => b.date.localeCompare(a.date)); if (!hs.length) return ''; const st = hs.flatMap(h => h.sets), l = hs[0], top = l.sets.reduce((a, x) => num(x.lbs) > num(a.lbs) ? x : a, l.sets[0]);
      return `<div class="gr"><div class="grow"><b>${esc(g.name)}</b><div class="xs mute">${hs.length} session${hs.length === 1 ? '' : 's'}</div></div><div style="text-align:right"><div class="xs mute">Last (${niceDate(l.date)})</div><b>${top.reps} × ${top.lbs} lbs</b></div><div style="text-align:right;min-width:92px"><div class="xs mute">Average</div><b>${r1(st.reduce((a, x) => a + num(x.reps), 0) / st.length)} × ${r1(st.reduce((a, x) => a + num(x.lbs), 0) / st.length)} lbs</b></div></div>`; }).join(''); return rows ? `<div class="card"><b>By gym</b><div class="xs mute" style="margin-bottom:4px">Last session's top set and the average of every set</div>${rows}</div>` : ''; })() : ''}
  <div class="sec"><span class="grow">History</span></div>
  ${hist.length ? hist.map((h, k) => { const nx = hist.slice(k + 1).find(x => hGym(x) === hGym(h)); const top = Math.max(...h.sets.map(s => num(s.lbs))), ptop = nx ? Math.max(...nx.sets.map(s => num(s.lbs))) : null; const b = ptop == null ? '' : top > ptop ? `<span class="badge g">▲ +${fnum(top - ptop)} lb</span>` : top < ptop ? `<span class="badge r">▼ ${fnum(top - ptop)} lb</span>` : `<span class="badge y">= same weight</span>`;
    return `<div class="hist"><div class="hr"><span>${esc(h.w)}${multi ? ' · ' + esc(gymName(hGym(h))) : ''}</span><span class="mute" style="font-weight:500">${niceDate(h.date)}</span></div><div class="hs">${h.sets.map((s, j) => `<div><span style="width:44px">Set ${j + 1}</span><span>${s.reps} x ${s.lbs} lbs</span></div>`).join('')}</div><div style="margin-top:8px">${b}</div></div>`; }).join('') : `<div class="empty small">History appears here after you save this workout.</div>`}</div>`;
}
function loggerView(p) {
  const i = inst(p.id), w = wk(i.wid); const ins = w.instr.split('\n');
  const prog = (S.active && S.active.id === i.id) ? S.active.startedAt : null;
  return `<div class="top" id="lt"><button class="iconbtn" data-act="minimize" aria-label="Minimize">${ic('chevd', 26)}</button><div class="t" id="elapsed">${prog ? clock(Date.now() - prog) : (i.done ? 'Editing log' : '')}</div>
   <button class="iconbtn" data-act="clockinfo">${ic('timer')}</button><button class="iconbtn" data-act="wnote">${ic('msg')}</button><button class="iconbtn" data-act="wmenu">${ic('more')}</button><button class="chip on" data-act="finish" style="margin-left:2px">Save</button></div>
  <div class="scroll" id="sc-log"><h1 style="font-size:27px;line-height:1.2;margin:6px 2px 10px;letter-spacing:-.4px">${esc(w.name)}</h1>
  <button class="chip" data-act="gympick" data-id="${i.id}" style="margin:0 2px 10px">📍 ${esc(gymName(gymOf(i)))} ▾</button>
  <div style="font-size:14.5px;line-height:1.5;color:var(--mute);margin:0 2px;white-space:pre-line">${esc(instrOpen ? w.instr : ins.slice(0, 4).join('\n'))}${instrOpen ? '' : '…'} <button class="link" data-act="instr" style="font-size:14.5px">${instrOpen ? 'See less' : 'See more'}</button></div>
  ${i.note ? `<div class="note" style="margin:10px 0"><span><b>Workout note</b><br>${esc(i.note)}</span></div>` : ''}
  <div class="row card" style="margin:14px 0 4px;padding:14px 16px"><div class="grow b">Auto fill stats <span class="faint" style="font-weight:500;font-size:13px">· fills blanks from last time</span></div><div class="tog ${S.autofill ? 'on' : ''}" data-act="autofill"></div></div>
  ${w.ex.map(e => exCard(i, w, e)).join('')}
  <button class="add" data-act="insertex" style="margin:10px auto;font-size:16px">${ic('plus', 18, '', 2.4)} Insert Exercise</button>
  <div style="text-align:center;margin-top:6px"><button class="btn" data-act="finish" style="padding:15px 80px">Save</button></div></div>`;
}
function exCard(i, w, e) {
  const lg = exLog(i, e), pv = prevFor(e, i);
  return `<div class="ex" id="ex-${e.id}"><div class="row" style="align-items:flex-start">${thumb(e.kind, 50)}<div class="grow" data-act="exinfo" data-w="${w.id}" data-e="${e.id}"><div class="exn">${esc(e.name)}</div><div class="exd">${esc(e.desc)}</div></div>
   <button class="iconbtn" style="width:36px;color:var(--blue)" data-act="exinfo" data-w="${w.id}" data-e="${e.id}">${ic('note', 20)}</button><button class="iconbtn" style="width:36px;color:var(--blue)" data-act="exmenu" data-e="${e.id}">${ic('repeat', 20)}</button></div>
   ${e.note ? `<div class="note" data-act="exinfo" data-w="${w.id}" data-e="${e.id}"><span class="ell">${esc(e.note.split('\n')[0])}</span><span class="link" style="flex:none">See more</span></div>` : ''}
   ${pv && pv.fromGym ? `<div class="xs" style="margin:8px 2px 0;color:var(--mute)">No numbers at ${esc(gymName(gymOf(i)))} yet — showing ${esc(gymName(pv.fromGym))}</div>` : ''}
   ${(() => { const a = avgFor(e, i); return a ? `<div class="avgln"><b>Avg</b> all gyms · ${a.n} sessions<br>${a.sets.map((x, k) => `<span>S${k + 1}: ${r1(x.reps)} × ${r1(x.lbs)} lbs</span>`).join('')}</div>` : ''; })()}
   <div class="rest"><span>${ic('timer', 16, '', 2)} &nbsp;Rest between each set</span><button class="pl" data-act="rest" data-e="${e.id}">${ic('clock', 15, '', 2.2)} ${e.rest}m</button></div>
   <div class="sh"><span>Set</span><span>Previous</span><span style="text-align:center">Reps</span><span style="text-align:center">Lbs</span><span></span></div>
   ${lg.map((s, k) => setRow(e, pv, lg, k)).join('')}
   <div class="exfoot"><button class="add" data-act="addset" data-e="${e.id}">${ic('plus', 17, '', 2.4)} Add new set</button>${lg.length > 1 ? `<button class="add rm" data-act="rmset" data-e="${e.id}">${ic('minus', 15, '', 2.4)} Remove</button>` : ''}</div>
   <div class="sug" id="sug-${e.id}"></div></div>`;
}
function setRow(e, pv, lg, k) {
  const s = lg[k], d = deltaOf(pv, k, s), p = pv && pv[k];
  return `<div class="srow"><span class="sn">${k + 1}</span><span class="sp" data-act="usePrev" data-e="${e.id}" data-k="${k}">${p ? p.reps + ' x ' + p.lbs + ' lbs' : '—'}</span>
  <input class="in" inputmode="decimal" enterkeyhint="next" placeholder="${p ? p.reps : ''}" data-e="${e.id}" data-k="${k}" data-f="reps" value="${esc(s.reps)}" aria-label="Reps set ${k + 1}">
  <input class="in" inputmode="decimal" enterkeyhint="done" placeholder="${p ? p.lbs : ''}" data-e="${e.id}" data-k="${k}" data-f="lbs" value="${esc(s.lbs)}" aria-label="Lbs set ${k + 1}">
  <div class="sd ${d ? d.d : ''}" id="d-${e.id}-${k}">${d ? (d.d === 'up' ? ic('up', 15, '', 3) : d.d === 'down' ? ic('down', 15, '', 3) : '=') + `<small>${d.t}</small>` : ''}</div></div>`;
}
function refreshSet(i, e, k) {
  const lg = exLog(i, e), pv = prevFor(e, i), d = deltaOf(pv, k, lg[k]); const el = $('#d-' + e.id + '-' + k);
  if (el) { el.className = 'sd ' + (d ? d.d : ''); el.innerHTML = d ? (d.d === 'up' ? ic('up', 15, '', 3) : d.d === 'down' ? ic('down', 15, '', 3) : '=') + `<small>${d.t}</small>` : ''; }
  const f = filled(lg), sg = $('#sug-' + e.id);
  if (sg) { const hit = f.length >= 1 && f.length === lg.length && f.every(s => num(s.reps) >= 9); sg.className = 'sug' + (hit ? ' show' : ''); sg.innerHTML = hit ? '🔥 You hit 9–10 reps — increase the weight next session' : ''; }
}
function diffView(p) {
  const L = ['EFFORTLESS', 'EASY', 'EASY', 'MODERATE', 'MODERATE', 'CHALLENGING', 'CHALLENGING', 'HARD', 'VERY HARD', 'MAXIMAL'], v = p.v;
  const col = v <= 3 ? '#22a559' : v <= 6 ? '#e6b400' : v <= 8 ? '#f97316' : '#e5484d';
  return `<div class="top"><button class="iconbtn" data-act="back">${ic('chevl')}</button><div class="sp"></div></div>
  <div class="scroll" style="padding-bottom:140px"><div style="text-align:center;font-size:22px;font-weight:750;margin:30px 20px 8px;line-height:1.3">How difficult was this workout?</div>
  <div id="dl" style="text-align:center;font-weight:800;letter-spacing:1px;color:${col};margin-top:10px">${L[v - 1]}</div>
  <div class="dial"><div id="fl" style="color:${col};transform:scale(${.8 + v * .08});transition:.15s">${ic('flame', 110, '', 1.6)}</div></div>
  <input type="range" min="1" max="10" value="${v}" id="dr"><div style="display:flex;justify-content:space-between;font-size:12px" class="mute"><span>Effortless</span><span>Maximal</span></div>
  <div style="text-align:center;margin-top:26px"><button class="btn soft" data-act="diffnote" style="padding:12px 50px">${p.comment ? 'Edit comment' : 'Tap to comment'}</button></div></div>
  <div class="sticky"><button class="btn block" data-act="diffdone" style="max-width:420px">Done</button></div>`;
}
function summaryView(p) {
  const s = p.sum, w = wk(inst(p.id).wid);
  const vd = s.pvol ? Math.round((s.vol - s.pvol) / s.pvol * 100) : null;
  return `<div class="top"><div class="t">Workout saved</div></div><div class="scroll">
  <div style="text-align:center;margin:10px 0 18px"><div class="thumb" style="width:72px;height:72px;border-radius:50%;margin:0 auto 12px;background:linear-gradient(135deg,#34d399,#047857)">${ic('check', 38, '', 3)}</div><div class="b" style="font-size:21px;overflow-wrap:anywhere;padding:0 12px;line-height:1.25">${esc(w.name)}</div><div class="small mute" style="margin-top:4px">${s.logged}/${w.ex.length} exercises logged</div></div>
  <div class="tiles"><div class="tile"><div class="s">Total volume</div><div class="v">${Math.round(s.vol).toLocaleString()}<small> lbs</small></div><div class="s" style="${vd == null ? '' : vd >= 0 ? 'color:var(--green)' : 'color:var(--red)'}">${vd == null ? 'First time logged' : (vd >= 0 ? '▲ +' : '▼ ') + vd + '% vs last time'}</div></div>
  <div class="tile"><div class="s">Progress</div><div class="v"><span style="color:var(--green)">${s.up}▲</span> <span style="color:var(--red)">${s.down}▼</span></div><div class="s">${s.same} unchanged${s.prs ? ' · ' + s.prs + ' PR' + (s.prs > 1 ? 's' : '') : ''}</div></div></div>
  <div class="sec">Exercises</div><div class="card" style="padding:4px 16px">${s.ex.map(e => `<div class="sumrow"><div class="grow"><div class="b" style="font-size:15px">${esc(e.name)}</div><div class="xs mute">${e.sets.map(x => x.reps + ' x ' + x.lbs).join('  ·  ')} lbs</div></div>${e.pr ? '<span class="badge y">PR</span>' : ''}${e.dir === 'up' ? '<span class="badge g">▲ Up</span>' : e.dir === 'down' ? '<span class="badge r">▼ Down</span>' : e.dir === 'same' ? '<span class="badge y">= Same</span>' : '<span class="badge y">New</span>'}</div>`).join('') || '<div class="empty small">No sets were filled in.</div>'}</div>
  <div class="small mute" style="text-align:center;margin:14px 20px">Next time this workout opens, the Previous column shows what you just saved.</div></div>
  <div class="sticky"><button class="btn block" data-act="sumdone" style="max-width:420px">Done</button></div>`;
}
function metricView(p) {
  const k = p.k, m = METRICS[k], ser = mseries(k), l = ser[ser.length - 1];
  const pts = ser.map(([d, v]) => ({ x: d, y: num(v) })).filter(q => !isNaN(q.y)).slice(-60);
  const chg = (d) => { if (!l || m.text) return null; const win = ser.filter(([x]) => x >= addDays(todayStr(), -d)); return win.length > 1 ? num(l[1]) - num(win[0][1]) : null; };
  const c7 = chg(7), c30 = chg(30), first = ser[0];
  const stat = (t, v) => `<div class="tile" style="min-height:auto"><div class="s">${t}</div><div class="v" style="font-size:20px;${v == null ? 'color:var(--faint)' : v > 0 ? '' : ''}">${v == null ? '—' : (v > 0 ? '+' : '') + fnum(v)} <small>${m.unit}</small></div></div>`;
  return `<div class="top"><button class="iconbtn" data-act="back">${ic('chevl')}</button><div class="t">${m.name}</div><div class="sp" style="flex:0 0 40px"></div></div>
  <div class="scroll"><div class="card" style="text-align:center"><div class="xs mute">${l ? (l[0] === todayStr() ? 'Today' : niceDate(l[0])) : 'No entries yet'}</div><div class="big">${l ? esc(l[1]) : '—'} <small style="font-size:18px;color:var(--mute);font-weight:600">${m.unit}</small></div></div>
  <div class="card"><b>Add entry</b><div class="row" style="margin-top:10px;gap:8px"><button class="chip" data-act="mdate" id="mdate" data-d="${todayStr()}" style="flex:none;padding:13px 14px">${ic('calendar', 16)} Today</button><input class="fi grow" id="mval" ${m.text ? '' : 'inputmode="decimal"'} placeholder="${m.ph}" style="min-width:0"><button class="btn sm" data-act="msave" data-k="${k}" style="flex:none">Add</button></div></div>
  ${!m.text ? `<div class="card"><b>Trend</b><div class="xs mute">${pts.length} entries</div>${lineChart(pts, { unit: m.unit })}</div>` : ''}
  ${!m.text && ser.length > 1 ? `<div class="tiles">${stat('Last 7 days', c7)}${stat('Last 30 days', c30)}</div>${first ? `<div class="small mute" style="margin:12px 4px">Since ${niceDate(first[0])}: ${(num(l[1]) - num(first[1]) > 0 ? '+' : '') + fnum(num(l[1]) - num(first[1]))} ${m.unit}</div>` : ''}` : ''}
  <div class="sec"><span class="grow">History</span></div>${ser.length ? `<div class="card" style="padding:4px 16px">${ser.slice().reverse().map(([d, v]) => `<div class="sumrow" data-act="medit" data-k="${k}" data-d="${d}"><div class="grow">${lbl(d)}<div class="xs mute">${niceDate(d)}</div></div><b>${esc(v)} <span class="mute" style="font-weight:500">${m.unit}</span></b><span class="faint">${ic('pencil', 16)}</span></div>`).join('')}</div>` : '<div class="empty small">Nothing logged yet.</div>'}</div>`;
}
function nutGraphView() {
  const end = todayStr(); const days = Array.from({ length: 14 }, (_, k) => addDays(end, k - 13)); const g = S.goal;
  const avg = key => { const v = days.map(d => totals(d)[key]).filter(x => x > 0); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0; };
  const blk = (name, key, goal, color, unit) => `<div class="card"><div class="row"><b class="grow">${name}</b><span class="xs mute">avg ${avg(key)}${unit} · goal ${goal}${unit}</span></div>${barChart(days.map(d => ({ d, v: totals(d)[key] })), goal, color)}</div>`;
  return `<div class="top"><button class="iconbtn" data-act="back">${ic('chevl')}</button><div class="t">Nutrition Graph</div><div class="sp" style="flex:0 0 40px"></div></div><div class="scroll"><div class="small mute" style="margin:0 4px">${niceDate(days[0])} – ${niceDate(end)} · logged from the Meals tab</div>
  ${blk('Calories', 'cal', g.cal, '#e5484d', '')}${blk('Protein (g)', 'p', g.p, '#22a559', 'g')}${blk('Carbs (g)', 'c', g.c, '#0a7aff', 'g')}${blk('Fat (g)', 'f', g.f, '#f59e0b', 'g')}</div>`;
}
function settingsView() {
  return `<div class="top"><button class="iconbtn" data-act="back">${ic('chevl')}</button><div class="t">Settings</div><div class="sp" style="flex:0 0 40px"></div></div><div class="scroll">
  <div class="card" style="padding:4px 16px"><div class="opt" data-act="planstart">${ic('calendar', 22, 'ico')}<div class="grow">Meal plan Day 1 starts<div class="xs mute">${niceDate(S.plan.start)} — Day ${planDayFor(todayStr())} is today</div></div>${ic('chevr', 18, 'chev')}</div></div>
  <div class="sec">Gyms</div><div class="card" style="padding:4px 16px"><div class="opt" data-act="gymspage">${ic('target', 22, 'ico')}<div class="grow">Manage gyms<div class="xs mute">${S.gyms.map(g => esc(g.name)).join(' · ')} — each gym keeps its own previous weights</div></div>${ic('chevr', 18, 'chev')}</div></div>
  <div class="sec">Your data</div><div class="card" style="padding:4px 16px">
  <div class="opt" data-act="export">${ic('download', 22, 'ico')}<div class="grow">Back up data<div class="xs mute">Saves a JSON file with all workouts, weights and meals</div></div></div>
  <div class="opt" data-act="import">${ic('upload', 22, 'ico')}<div class="grow">Restore from backup</div></div>
  <div class="opt" data-act="mergeseed">${ic('repeat', 22, 'ico')}<div class="grow">Restore missing starter workouts, numbers &amp; notes</div></div>
  <div class="opt danger" data-act="reset">${ic('trash', 22, 'ico')}<div class="grow">Reset everything to the original numbers</div></div></div>
  <div class="sec">Install on iPhone</div><div class="card small" style="line-height:1.6">Open this page in <b>Safari</b> → tap the <b>Share</b> button → <b>Add to Home Screen</b>. It then opens full-screen like a native app and works offline. Everything is stored on your phone, so use <b>Back up data</b> now and then.</div>
  <div class="small faint" style="text-align:center;margin:18px">My Training · personal build</div></div>`;
}
const viewOf = n => ({ gyms: gymsView, preview: previewView, exinfo: exInfoView, logger: loggerView, diff: diffView, summary: summaryView, metric: metricView, nutgraph: nutGraphView, settings: settingsView })[n.screen](n);

/* ====================== sheets ====================== */
function openSheet(html, cb) { sheet = html; sheetCb = cb || null; renderOverlay(); }
function closeSheet() { sheet = null; sheetCb = null; dpSheet = null; renderOverlay(); }
let dpSheet = null;
const sheetWrap = (inner, h) => `<div class="dim" data-act="closesheet"></div><div class="sheet" role="dialog">${'<div class="grab"></div>'}${h ? `<h3>${h}</h3>` : ''}${inner}</div>`;
function menu(title, items) {
  window._menu = items;
  openSheet(sheetWrap(items.map((it, k) => `<button class="opt ${it.danger ? 'danger' : ''}" data-act="menuitem" data-k="${k}" style="width:100%;text-align:left">${it.icon ? ic(it.icon, 22, 'ico') : ''}<span class="grow">${esc(it.label)}</span></button>`).join(''), title));
}
function formSheet(title, fields, ok, cb, extra) {
  openSheet(sheetWrap(fields.map(f => `<div class="field"><label for="f-${f.id}">${f.label}</label>${f.type === 'select' ? `<select class="fi" id="f-${f.id}">${f.options.map(o => `<option value="${esc(o)}" ${o === f.value ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>` : f.type === 'textarea' ? `<textarea class="fi" id="f-${f.id}" placeholder="${esc(f.ph || '')}">${esc(f.value ?? '')}</textarea>` : `<input class="fi" id="f-${f.id}" type="${f.type || 'text'}" ${f.type === 'number' ? 'inputmode="decimal" step="any"' : ''} placeholder="${esc(f.ph || '')}" value="${esc(f.value ?? '')}">`}</div>`).join('') + `<div class="row" style="margin-top:16px;gap:10px"><button class="btn soft grow" data-act="closesheet">Cancel</button><button class="btn grow" data-act="formok">${ok || 'Save'}</button></div>${extra || ''}`, title), cb);
  setTimeout(() => { const f = $('#f-' + fields[0].id); f && f.focus(); }, 320);
}
function confirmSheet(title, msg, ok, cb, danger = true) {
  openSheet(sheetWrap(`<div class="mute" style="margin:6px 0 18px;line-height:1.5">${esc(msg)}</div><div class="row" style="gap:10px"><button class="btn soft grow" data-act="closesheet">Cancel</button><button class="btn ${danger ? 'danger' : ''} grow" data-act="formok">${ok}</button></div>`, title), cb);
}
function datePicker(title, sel, onPick, extra) {
  dpSheet = { y: parse(sel).getFullYear(), m: parse(sel).getMonth(), sel, onPick, mark: d => itemsOn(d).length };
  openSheet(sheetWrap(`<div id="dpwrap2">${calGrid(dpSheet.y, dpSheet.m, sel, dpSheet.mark)}</div>${extra || ''}`, title));
}
function moveSheet(i, mode) {
  mode = mode || 'move'; const t = todayStr();
  const chips = Array.from({ length: 7 }, (_, k) => { const d = addDays(t, k); return `<button class="chip ${d === i.date ? 'on' : ''}" data-act="moveto" data-id="${i.id}" data-d="${d}" data-mode="${mode}"><span>${k === 0 ? 'Today' : k === 1 ? 'Tomorrow' : DOW[parse(d).getDay()] + ' ' + parse(d).getDate()}</span></button>`; }).join('');
  dpSheet = { y: parse(i.date).getFullYear(), m: parse(i.date).getMonth(), sel: i.date, mark: d => itemsOn(d).length, onPick: d => applyMove(i, d, mode) };
  openSheet(sheetWrap(`<div class="small mute" style="margin-bottom:10px">${esc(wk(i.wid).name)} · now on ${longDay(i.date)}</div>
   <div class="seg" style="margin-top:0"><button class="${mode === 'move' ? 'on' : ''}" data-act="movemode" data-id="${i.id}" data-v="move">Move</button><button class="${mode === 'copy' ? 'on' : ''}" data-act="movemode" data-id="${i.id}" data-v="copy">Copy to another day</button></div>
   <div class="hscroll" style="margin-bottom:8px">${chips}</div><div id="dpwrap2">${calGrid(dpSheet.y, dpSheet.m, i.date, dpSheet.mark)}</div>
   <button class="opt danger" data-act="unschedule" data-id="${i.id}" style="width:100%;margin-top:8px">${ic('trash', 22, 'ico')}<span>Remove from calendar</span></button>`, mode === 'move' ? 'Move workout' : 'Copy workout'));
}
function applyMove(i, d, mode) {
  if (mode === 'copy') { S.schedule.push({ id: uid(), wid: i.wid, date: d, done: false, log: {}, diff: null }); toast('Copied to ' + lbl(d)); }
  else { i.date = d; toast('Moved to ' + lbl(d)); if (S.active && S.active.id === i.id) { } }
  save(); selDay = d; closeSheet(); nav = nav.filter(n => n.screen !== 'preview' && n.screen !== 'logger'); layersReset(); render();
}
function scheduleSheet(wid) {
  const t = todayStr();
  dpSheet = { y: parse(t).getFullYear(), m: parse(t).getMonth(), sel: t, mark: d => itemsOn(d).length, onPick: d => { S.schedule.push({ id: uid(), wid, date: d, done: false, log: {}, diff: null }); save(); selDay = d; closeSheet(); toast('Scheduled for ' + lbl(d)); render(); } };
  openSheet(sheetWrap(`<div class="hscroll" style="margin-bottom:8px">${Array.from({ length: 7 }, (_, k) => { const d = addDays(t, k); return `<button class="chip" data-act="schedto" data-w="${wid}" data-d="${d}">${k === 0 ? 'Today' : k === 1 ? 'Tomorrow' : DOW[parse(d).getDay()] + ' ' + parse(d).getDate()}</button>`; }).join('')}</div><div id="dpwrap2">${calGrid(dpSheet.y, dpSheet.m, t, dpSheet.mark)}</div>`, 'Schedule ' + esc(wk(wid).name)));
}
function fabSheet() {
  menu('Add', [
    { label: 'Log body weight', icon: 'scale', fn: () => weightQuick(selDay) },
    { label: 'Add a meal', icon: 'utensils', fn: () => addMealSheet(selDay) },
    ...Object.values(S.workouts).map(w => ({ label: 'Schedule ' + w.name, icon: 'dumbbell', fn: () => scheduleSheet(w.id) })),
    { label: 'Log steps / sleep / more', icon: 'steps', fn: () => menuMetrics() }
  ]);
}
function menuMetrics() { menu('Log a metric', Object.keys(METRICS).map(k => ({ label: METRICS[k].name, icon: METRICS[k].icon, fn: () => pushScreen('metric', { k }) }))); }
function weightQuick(d) {
  const cur = S.metrics.weight[d];
  formSheet('Weight · ' + lbl(d), [{ id: 'v', label: 'Body weight (lbs)', type: 'number', value: cur ?? '', ph: cur ? '' : (mlatest('weight') ? mlatest('weight')[1] : '150.0') }], 'Save', () => {
    const v = num($('#f-v').value); if (isNaN(v) || v <= 0) return toast('Enter a number'); S.metrics.weight[d] = v; save(); closeSheet(); toast('Weight saved · ' + v + ' lbs'); render();
  }, cur ? `<button class="btn danger block" style="margin-top:10px" data-act="weightdel" data-d="${d}">Delete this entry</button>` : '');
}
function addMealSheet(d) {
  formSheet('Add meal · ' + lbl(d), [{ id: 'n', label: 'Name', ph: 'e.g. Chipotle bowl' }, { id: 'cal', label: 'Calories', type: 'number', ph: '0' }, { id: 'p', label: 'Protein (g)', type: 'number', ph: '0' }, { id: 'c', label: 'Carbs (g)', type: 'number', ph: '0' }, { id: 'f', label: 'Fat (g)', type: 'number', ph: '0' }], 'Add', () => {
    const g = id => num($('#f-' + id).value) || 0; S.diary[d] = S.diary[d] || []; S.diary[d].push({ id: 'c' + uid(), name: $('#f-n').value.trim() || 'Meal', cal: g('cal'), p: g('p'), c: g('c'), f: g('f') }); save(); closeSheet(); toast('Meal added'); render();
  });
}
function insertExSheet(w, replaceId, after) {
  const all = []; const seen = new Set();
  Object.values(S.workouts).forEach(x => x.ex.forEach(e => { if (!seen.has(e.name)) { seen.add(e.name); all.push(e); } }));
  window._ie = { w, replaceId, all, after };
  openSheet(sheetWrap(`<button class="btn block" data-act="iecreate" style="margin-bottom:12px">${ic('plus', 18, '', 2.4)} &nbsp;Create custom exercise</button><div class="small mute" style="margin:2px 2px 8px">Or pick one you already use</div><input class="fi" id="iesearch" placeholder="Search your exercises" oninput="ieFilter()" autocomplete="off"><div id="ielist" style="margin-top:8px">${ieList('')}</div>`, replaceId ? 'Replace exercise' : 'Add exercise'));
}
function ieList(q) {
  const { all } = window._ie; const f = all.filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  return f.map(e => `<button class="opt" data-act="iepick" data-n="${esc(e.name)}" style="width:100%;text-align:left">${thumb(e.kind, 38)}<span class="grow">${esc(e.name)}</span></button>`).join('') + (q.trim() && !all.some(e => e.name.toLowerCase() === q.trim().toLowerCase()) ? `<button class="opt" data-act="iecreate" data-n="${esc(q.trim())}" style="width:100%;text-align:left"><span class="ico">${ic('plus', 22)}</span><span class="grow">Create “${esc(q.trim())}”</span></button>` : '');
}
window.ieFilter = () => { $('#ielist').innerHTML = ieList($('#iesearch').value); };

let exf = null;
function exfInner() {
  return `<div class="field"><label for="x-name">Exercise name</label><input class="fi" id="x-name" value="${esc(exf.name)}" placeholder="e.g. Incline Dumbbell Curl" autocomplete="off"></div>
  <div class="field"><label>Muscle group</label><div class="chips">${GROUPS.map(g => `<button class="chip sm2 ${exf.kind === g[0] ? 'on' : ''}" data-act="exf_kind" data-v="${g[0]}">${g[1]}</button>`).join('')}</div></div>
  <div class="field"><label>Equipment</label><div class="chips">${allEquip().map(e => `<button class="chip sm2 ${exf.equip.includes(e) ? 'on' : ''}" data-act="exf_eq" data-v="${esc(e)}">${esc(e)}</button>`).join('')}</div>
   <div class="row" style="margin-top:10px;gap:8px"><input class="fi" id="x-neweq" placeholder="Add your own equipment" style="padding:11px 14px"><button class="btn soft sm" data-act="exf_addeq" style="flex:none">Add</button></div></div>
  <div class="field"><label for="x-desc">Target / instructions</label><input class="fi" id="x-desc" value="${esc(exf.desc)}" placeholder="2 sets x 6-10 Rep range both sets to FAILURE"></div>
  <div class="row" style="gap:12px"><div class="field grow"><label for="x-sets">Sets</label><input class="fi" id="x-sets" inputmode="numeric" value="${exf.sets}"></div><div class="field grow"><label>Rest</label><div class="chips">${[1, 2, 3, 4].map(m => `<button class="chip sm2 ${exf.rest === m ? 'on' : ''}" data-act="exf_rest" data-v="${m}">${m}m</button>`).join('')}</div></div></div>`;
}
function exerciseSheet(w, ex, after, opts = {}) {
  exf = { w: w.id, exId: ex ? ex.id : null, name: ex ? ex.name : (opts.name || ''), kind: ex ? ex.kind : 'arms', equip: ex ? [...(ex.equip || [])] : [], desc: ex ? ex.desc : '2 sets x 6-10 Rep range both sets to FAILURE', sets: ex ? (ex.sets || ex.history[0] && ex.history[0].sets.length || 2) : 2, rest: ex ? ex.rest : 2, replaceId: opts.replaceId, after };
  openSheet(sheetWrap(`<div id="exfbody">${exfInner()}</div><div class="row" style="margin-top:16px;gap:10px"><button class="btn soft grow" data-act="closesheet">Cancel</button><button class="btn grow" data-act="exf_save">${ex ? 'Save' : 'Add exercise'}</button></div>`, ex ? 'Edit exercise' : 'New exercise'));
  setTimeout(() => { const f = $('#x-name'); f && !ex && f.focus(); }, 340);
}
function exfRead() { const n = $('#x-name'); if (!n) return; exf.name = n.value; exf.desc = $('#x-desc').value; const sv = num($('#x-sets').value); exf.sets = isNaN(sv) ? 2 : Math.max(1, Math.min(10, Math.round(sv))); }
function exfRender() { exfRead(); const b = $('#exfbody'); if (b) b.innerHTML = exfInner(); }
function equipSheet(w) {
  window._eqw = w; const body = () => `<div class="chips">${allEquip().map(e => `<button class="chip ${(w.equip || []).includes(e) ? 'on' : ''}" data-act="weq" data-v="${esc(e)}">${esc(e)}</button>`).join('')}</div><div class="row" style="margin-top:14px;gap:8px"><input class="fi" id="eq-new" placeholder="Add your own equipment" style="padding:11px 14px"><button class="btn soft sm" data-act="weq_add" style="flex:none">Add</button></div>`;
  window._eqbody = body; openSheet(sheetWrap(`<div id="eqbody">${body()}</div><button class="btn block" data-act="closesheet" style="margin-top:18px">Done</button>`, 'Equipment'));
}
function goalForm(type, g) {
  const ex = g || {};
  if (type === 'weight') {
    const l = mlatest('weight');
    return formSheet(g ? 'Edit weight goal' : 'Body weight goal', [{ id: 's', label: 'Starting weight (lbs)', type: 'number', value: ex.startVal ?? (l ? l[1] : ''), ph: 'e.g. 150' }, { id: 't', label: 'Target weight (lbs)', type: 'number', value: ex.target ?? '', ph: 'e.g. 140' }, { id: 'b', label: 'Target date (optional)', type: 'date', value: ex.by || '' }], 'Save', () => {
      const st = num($('#f-s').value), t = num($('#f-t').value); if (isNaN(st) || isNaN(t) || st <= 0 || t <= 0) return toast('Enter start and target weight');
      const goal = Object.assign(g || { id: 'g' + uid(), type: 'weight' }, { type: 'weight', startVal: st, target: t, by: $('#f-b').value || '', name: 'Reach ' + fnum(t) + ' lbs' }); if (!g) goalsList().push(goal); save(); closeSheet(); render(); toast('Goal saved');
    });
  }
  if (type === 'lift') {
    const names = allExNames();
    return formSheet(g ? 'Edit lift goal' : 'Lift goal', [{ id: 'e', label: 'Exercise', type: 'select', options: names, value: ex.exName || names[0] }, { id: 't', label: 'Target weight (lbs)', type: 'number', value: ex.target ?? '', ph: 'e.g. 225' }, { id: 'r', label: 'At least this many reps', type: 'number', value: ex.reps ?? 1, ph: '1' }, { id: 'b', label: 'Target date (optional)', type: 'date', value: ex.by || '' }], 'Save', () => {
      const t = num($('#f-t').value), r = Math.max(1, Math.round(num($('#f-r').value) || 1)); if (isNaN(t) || t <= 0) return toast('Enter a target weight');
      const exName = $('#f-e').value; const goal = Object.assign(g || { id: 'g' + uid(), type: 'lift' }, { type: 'lift', exName, target: t, reps: r, by: $('#f-b').value || '', name: exName + ' — ' + fnum(t) + ' lbs' + (r > 1 ? ' × ' + r : '') }); if (!g) goalsList().push(goal); save(); closeSheet(); render(); toast('Goal saved');
    });
  }
  return formSheet(g ? 'Edit goal' : 'Custom goal', [{ id: 'n', label: 'Goal', value: ex.name || '', ph: 'e.g. Run a 5K, 100 pull-ups…' }, { id: 's', label: 'Starting value', type: 'number', value: ex.startVal ?? 0, ph: '0' }, { id: 't', label: 'Target value', type: 'number', value: ex.target ?? '', ph: 'e.g. 100' }, { id: 'u', label: 'Unit', value: ex.unit || '', ph: 'e.g. reps, miles, lbs' }, { id: 'b', label: 'Target date (optional)', type: 'date', value: ex.by || '' }], 'Save', () => {
    const name = $('#f-n').value.trim(), st = num($('#f-s').value) || 0, t = num($('#f-t').value); if (!name || isNaN(t)) return toast('Add a name and a target');
    const goal = Object.assign(g || { id: 'g' + uid(), type: 'custom', cur: st }, { type: 'custom', name, startVal: st, target: t, unit: $('#f-u').value.trim(), by: $('#f-b').value || '' }); if (!g) goalsList().push(goal); save(); closeSheet(); render(); toast('Goal saved');
  });
}

/* ====================== render engine ====================== */
const scrollOf = el => { const s = el && el.querySelector('.scroll'); return s ? s.scrollTop : 0; };
const setScroll = (el, v) => { const s = el && el.querySelector('.scroll'); if (s) s.scrollTop = v; };
let lastTab = null;
function centerIn(box, el, smooth) {
  if (!box || !el) return; const b = box.getBoundingClientRect(), r = el.getBoundingClientRect();
  const left = box.scrollLeft + (r.left - b.left) - (b.width - r.width) / 2;
  box.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
}
function renderBase() {
  const b = $('#base'), sv = scrollOf(b), strip = $('#strip'), sl = strip ? strip.scrollLeft : null; const tabChanged = lastTab !== tab;
  b.innerHTML = baseViews[tab]() + tabbar() + ((tab === 'home' || tab === 'calendar') ? `<button class="fab" data-act="fab" aria-label="Add">${ic('plus', 28, '', 2.4)}</button>` : '') + (curNav() ? '' : activeBanner());
  if (!tabChanged) setScroll(b, sv);
  lastTab = tab;
  const st = $('#strip');
  if (st) { if (!tabChanged && sl != null) st.scrollLeft = sl; else centerIn(st, $('#day-' + selDay)); }
  if (tab === 'calendar' && calSeg === 'list' && (tabChanged || window._calFirst)) {
    const sc = $('#sc-cal'), el = $('#cal-' + todayStr());
    if (sc && el) sc.scrollTop = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 6;
    window._calFirst = false;
  }
}
function renderTop(anim) {
  const L = $('#layers'); const live = () => [...L.children].filter(c => !c.classList.contains('leave'));
  while (live().length < nav.length) { const d = document.createElement('div'); d.className = 'layer' + (anim ? (anim === 'up' ? ' up' : ' enter') : ''); L.appendChild(d); }
  const ls = live(), top = ls[nav.length - 1]; if (!top) return;
  const sv = scrollOf(top); top.innerHTML = viewOf(curNav()); setScroll(top, sv);
}
let _lastSheet = null;
function renderOverlay() {
  const o = $('#overlay');
  if (!o.firstChild) o.innerHTML = '<div id="sheetbox"></div><div id="toastbox"></div><div id="restbox"></div>';
  if (_lastSheet !== sheet) { $('#sheetbox').innerHTML = sheet || ''; _lastSheet = sheet; }   // typing in a sheet is never wiped by a toast/timer
  $('#toastbox').innerHTML = toastMsg ? `<div class="toast">${esc(toastMsg)}</div>` : '';
  $('#restbox').innerHTML = restHtml();
}
const restHtml = () => restT ? `<div class="restpill" id="restpill"><span>Rest</span><span class="tm" id="rt">${clock(restT.left * 1000)}</span><button data-act="restadd">+15s</button><button data-act="restskip">Skip</button></div>` : '';
function render() { if (!S) return renderLock(); renderBase(); if (nav.length) renderTop(); renderOverlay(); }
function layersReset() { const L = $('#layers'); const live = [...L.children].filter(c => !c.classList.contains('leave')); live.slice(nav.length).forEach(c => c.remove()); }
function pushScreen(screen, p = {}) { nav.push({ screen, ...p }); renderTop(screen === 'logger' ? 'up' : 'push'); }
function popScreen(down) {
  const L = $('#layers'); const live = [...L.children].filter(c => !c.classList.contains('leave')); const top = live[live.length - 1];
  nav.pop();
  if (top) { top.classList.remove('enter', 'up'); top.classList.add('leave'); if (down) top.classList.add('down'); setTimeout(() => top.remove(), 280); }
  renderBase(); if (nav.length) renderTop();
}
function toast(m) { toastMsg = m; renderOverlay(); clearTimeout(window._tt); window._tt = setTimeout(() => { toastMsg = null; renderOverlay(); }, 2000); }

/* ---- timers ---- */
function startRest(min) {
  restT = { left: Math.round(min * 60) }; renderOverlay();
}
setInterval(() => {
  const now = Date.now();
  if (restT) { restT.left--; if (restT.left <= 0) { restT = null; try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { } renderOverlay(); } else { const el = $('#rt'); if (el) el.textContent = clock(restT.left * 1000); } }
  if (S.active) { const t = clock(now - S.active.startedAt); const a = $('#elapsed'); if (a && curNav() && curNav().screen === 'logger') a.textContent = t; const bc = $('#bannerclk'); if (bc) bc.textContent = t; }
}, 1000);

/* ====================== actions ====================== */
function startWorkout(id) {
  const i = inst(id); if (!i) return;
  if (!i.gym) i.gym = gymOf(i);
  if (!i.done && (!S.active || S.active.id !== id)) S.active = { id, startedAt: Date.now() };  // editing a finished workout never creates an "in progress" banner
  if (S.autofill) autofill(i);
  save(); nav = nav.filter(n => n.screen !== 'preview'); layersReset(); pushScreenReplace('logger', { id });
}
function pushScreenReplace(screen, p) { // swap whole stack with a single logger screen without flicker
  const L = $('#layers'); L.innerHTML = ''; nav = []; pushScreen(screen, p); renderBase();
}
function autofill(i) { wk(i.wid).ex.forEach(ex => { const lg = exLog(i, ex), pv = prevFor(ex, i); lg.forEach((s, k) => { if (!s.reps && !s.lbs && pv && !pv.fromGym && pv[k]) { s.reps = String(pv[k].reps); s.lbs = String(pv[k].lbs); } }); }); }
function minimize() { save(); const L = $('#layers'); nav = []; const top = [...L.children].pop(); if (top) { top.className = 'layer down leave'; setTimeout(() => { L.innerHTML = ''; }, 280); } renderBase(); }
function finishWorkout() {
  if (!curNav() || curNav().screen !== 'logger') return; // ignore double taps
  restT = null; renderOverlay(); const t = curNav(); const i = inst(t.id); pushScreen('diff', { id: t.id, v: i.diff || 5, comment: i.comment || '' });
}
function afterSave(id, v, comment) {
  const i = inst(id); i.diff = v; if (comment) i.comment = comment;
  const dur = S.active && S.active.id === id ? Date.now() - S.active.startedAt : (i.duration || 0);
  buzz('HEAVY'); const sum = commitWorkout(i, dur); S.active = null; restT = null; renderOverlay(); save();
  const L = $('#layers'); L.innerHTML = ''; nav = []; pushScreen('summary', { id, sum }); renderBase();
}
function endMenu(id) {
  const i = inst(id); if (!i) return;
  menu('End workout?', [
    { label: 'Save workout', icon: 'check', fn: () => { if (!curNav() || curNav().screen !== 'logger') pushScreenReplace('logger', { id }); finishWorkout(); } },
    { label: 'Discard what I entered', icon: 'trash', danger: true, fn: () => confirmSheet('Discard this workout?', 'Everything typed into this session is erased. Your saved history is not touched.', 'Discard', () => { if (!i.done) i.log = {}; if (S.active && S.active.id === id) S.active = null; save(); closeSheet(); nav = []; $('#layers').innerHTML = ''; restT = null; render(); toast('Workout discarded'); }) },
    { label: 'Keep going', icon: 'play', fn: () => { if (!curNav()) pushScreenReplace('logger', { id }); } }]);
}
function openInst(id) { const i = inst(id); if (S.active && S.active.id === id && !i.done) { pushScreenReplace('logger', { id }); } else pushScreen('preview', { id }); }
function saveMetric(k, d, raw) {
  const m = METRICS[k]; let v = raw.trim(); if (!v) return toast('Enter a value');
  if (!m.text) { const n = num(v); if (isNaN(n) || n <= 0) return toast('Enter a number'); v = n; }
  S.metrics[k][d] = v; save(); toast(m.name + ' saved'); render();
}
function exportData() {
  const json = JSON.stringify(S, null, 1), name = 'my-training-backup-' + todayStr() + '.json';
  try { const f = new File([json], name, { type: 'application/json' }); if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: 'My Training backup' }).catch(() => { }); return; } } catch (e) { }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = name; document.body.appendChild(a); a.click(); a.remove();
}
function importData() {
  const f = document.createElement('input'); f.type = 'file'; f.accept = '.json,application/json';
  f.onchange = () => { const r = new FileReader(); r.onload = () => { try { const j = JSON.parse(r.result); if (j.v !== 2) throw 0; S = j; syncPlan(); if (!planDay) planDay = planDayFor(todayStr()); save(); nav = []; $('#layers').innerHTML = ''; render(); toast('Backup restored'); } catch (e) { toast('That file is not a valid backup'); } }; r.readAsText(f.files[0]); };
  f.click();
}

document.addEventListener('input', e => {
  const el = e.target; if (!el.dataset || !el.dataset.f) return; const t = curNav(); if (!t || t.screen !== 'logger') return;
  const i = inst(t.id), ex = wk(i.wid).ex.find(x => x.id === el.dataset.e); const k = +el.dataset.k;
  exLog(i, ex)[k][el.dataset.f] = el.value; save(); refreshSet(i, ex, k);
});
document.addEventListener('change', e => {
  const el = e.target; if (!el.dataset || !el.dataset.f) return; const t = curNav(); if (!t || t.screen !== 'logger') return;
  const i = inst(t.id), ex = wk(i.wid).ex.find(x => x.id === el.dataset.e); const s = exLog(i, ex)[+el.dataset.k];
  if (s.reps !== '' && s.lbs !== '' && !i.done) { startRest(ex.rest); buzz('MEDIUM'); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.dataset && e.target.dataset.f) { const ins = [...document.querySelectorAll('#sc-log input.in')]; const n = ins[ins.indexOf(e.target) + 1]; if (n) { e.preventDefault(); n.focus(); } else e.target.blur(); }
  if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.id && e.target.id.startsWith('f-')) { const ok = $('[data-act="formok"]'); ok && ok.click(); }
  if (e.key === 'Enter' && e.target.id === 'lockcode') { unlockSeed(e.target.value); }
  if (e.key === 'Enter' && e.target.id === 'mval') { const b = $('[data-act="msave"]'); b && b.click(); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'dr') { const t = curNav(); if (!t || t.screen !== 'diff') return; t.v = +e.target.value; const L = ['EFFORTLESS', 'EASY', 'EASY', 'MODERATE', 'MODERATE', 'CHALLENGING', 'CHALLENGING', 'HARD', 'VERY HARD', 'MAXIMAL']; const v = t.v, col = v <= 3 ? '#22a559' : v <= 6 ? '#e6b400' : v <= 8 ? '#f97316' : '#e5484d'; const dl = $('#dl'); dl.textContent = L[v - 1]; dl.style.color = col; const fl = $('#fl'); fl.style.color = col; fl.style.transform = `scale(${.8 + v * .08})`; }
});

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return; const a = el.dataset.act, d = el.dataset;
  if (el.classList.contains('iconbtn') || a === 'habit' || a === 'move' || a === 'logmeal' || a === 'delmeal') e.stopPropagation();
  const A = {
    tab() { if (curNav()) { nav = []; $('#layers').innerHTML = ''; } tab = d.t; render(); },
    selday() { selDay = d.d; renderBase(); centerIn($('#strip'), $('#day-' + selDay), true); },
    gotoday() { selDay = todayStr(); render(); },
    calseg() { calSeg = d.v; window._calFirst = true; renderBase(); if (calSeg === 'month') { const sc = $('#sc-cal'); if (sc) sc.scrollTop = 0; } },
    fab() { fabSheet(); },
    back() { popScreen(); },
    settings() { pushScreen('settings'); },
    habit() { buzz(); const k = d.d + '|' + d.id; S.habitDone[k] = !S.habitDone[k]; save(); renderBase(); },
    open() { openInst(d.id); },
    tmpl() { pushScreen('preview', { wid: d.id }); },
    gomeals() { diaryDay = d.d; mealsSeg = 'diary'; tab = 'meals'; selDay = d.d; nav = []; $('#layers').innerHTML = ''; render(); },
    exinfo() { pushScreen('exinfo', { w: d.w, e: d.e }); },
    complete() { const i = inst(d.id); i.done = true; save(); popScreen(); toast('Marked complete'); },
    start() { let id = d.id; if (!id) { const t = todayStr(); let i = S.schedule.find(x => x.wid === d.w && x.date === t && !x.done); if (!i) { i = { id: uid(), wid: d.w, date: t, done: false, log: {}, diff: null }; S.schedule.push(i); } id = i.id; } startWorkout(id); },
    endmenu() { if (S.active) endMenu(S.active.id); },
    resume() { pushScreenReplace('logger', { id: S.active.id }); },
    minimize() { minimize(); },
    clockinfo() { const s = S.active; toast(s ? 'Workout time: ' + clock(Date.now() - s.startedAt) : 'Not started'); },
    wnote() { const i = inst(curNav().id); formSheet('Workout note', [{ id: 'n', label: 'Note', type: 'textarea', value: i.note || '', ph: 'How did this session feel?' }], 'Save', () => { i.note = $('#f-n').value.trim(); save(); closeSheet(); renderTop(); }); },
    wmenu() { const i = inst(curNav().id); menu(wk(i.wid).name, [
      ...(!i.done ? [{ label: 'End workout…', icon: 'x', fn: () => endMenu(i.id) }] : []),
      { label: 'Move to another day', icon: 'move', fn: () => moveSheet(i) },
      { label: 'Fill blanks from last time', icon: 'repeat', fn: () => { autofill(i); save(); renderTop(); toast('Filled from last time'); } },
      { label: 'Clear all entries', icon: 'trash', danger: true, fn: () => confirmSheet('Clear entries?', 'This empties every reps/lbs box for this workout.', 'Clear', () => { i.log = {}; save(); closeSheet(); renderTop(); }) }]); },
    instr() { instrOpen = !instrOpen; renderTop(); },
    autofill() { S.autofill = !S.autofill; if (S.autofill) { const t = curNav(); if (t && t.screen === 'logger') autofill(inst(t.id)); } save(); renderTop(); },
    addset() { const i = inst(curNav().id), ex = wk(i.wid).ex.find(x => x.id === d.e); exLog(i, ex).push({ reps: '', lbs: '' }); save(); renderTop(); },
    rmset() { const i = inst(curNav().id), ex = wk(i.wid).ex.find(x => x.id === d.e), lg = exLog(i, ex); if (lg.length > 1) lg.pop(); save(); renderTop(); },
    usePrev() { const i = inst(curNav().id), ex = wk(i.wid).ex.find(x => x.id === d.e), pv = prevFor(ex, i); if (!pv || !pv[+d.k]) return; const s = exLog(i, ex)[+d.k]; s.reps = String(pv[+d.k].reps); s.lbs = String(pv[+d.k].lbs); save(); renderTop(); },
    rest() { const ex = wk(inst(curNav().id).wid).ex.find(x => x.id === d.e); menu('Rest between sets', [1, 1.5, 2, 3, 4, 5].map(m => ({ label: m + ' min' + (m === ex.rest ? '  ✓' : ''), icon: 'timer', fn: () => { ex.rest = m; save(); closeSheet(); renderTop(); } }))); },
    exmenu() { const i = inst(curNav().id), w = wk(i.wid), idx = w.ex.findIndex(x => x.id === d.e), ex = w.ex[idx]; menu(ex.name, [
      { label: 'Replace exercise', icon: 'repeat', fn: () => insertExSheet(w, ex.id, () => renderTop()) },
      { label: 'Edit exercise details', icon: 'pencil', fn: () => exerciseSheet(w, ex, () => renderTop()) },
      { label: 'Edit note', icon: 'note', fn: () => noteSheet(w, ex) },
      ...(idx > 0 ? [{ label: 'Move up', icon: 'up', fn: () => { w.ex.splice(idx - 1, 0, w.ex.splice(idx, 1)[0]); save(); closeSheet(); renderTop(); } }] : []),
      ...(idx < w.ex.length - 1 ? [{ label: 'Move down', icon: 'down', fn: () => { w.ex.splice(idx + 1, 0, w.ex.splice(idx, 1)[0]); save(); closeSheet(); renderTop(); } }] : []),
      { label: 'Remove from workout', icon: 'trash', danger: true, fn: () => confirmSheet('Remove exercise?', 'Removes “' + ex.name + '” from this workout template. Its history is kept if you add it back.', 'Remove', () => { w.ex.splice(idx, 1); save(); closeSheet(); renderTop(); }) }]); },
    insertex() { const w = wk(inst(curNav().id).wid); insertExSheet(w, null, () => renderTop()); },
    iepick() { const { w, replaceId, all, after } = window._ie; const src = all.find(e => e.name === d.n); if (!src) return; const ex = { ...src, id: 'x' + uid(), history: JSON.parse(JSON.stringify(src.history)).map(h => ({ ...h, instId: 'copy-' + h.instId })) };
      if (replaceId) { const k = w.ex.findIndex(x => x.id === replaceId); w.ex.splice(k, 1, ex); } else w.ex.push(ex); save(); closeSheet(); after && after(); toast('Exercise added'); },
    iecreate() { const { w, replaceId, after } = window._ie; closeSheet(); setTimeout(() => exerciseSheet(w, null, after, { name: d.n || '', replaceId }), 60); },
    addex() { const w = wk(d.w); insertExSheet(w, null, () => renderTop()); },
    exedit() { const w = wk(d.w), idx = w.ex.findIndex(x => x.id === d.e), ex = w.ex[idx]; menu(ex.name, [
      { label: 'Edit exercise', icon: 'pencil', fn: () => exerciseSheet(w, ex, () => renderTop()) },
      ...(idx > 0 ? [{ label: 'Move up', icon: 'up', fn: () => { w.ex.splice(idx - 1, 0, w.ex.splice(idx, 1)[0]); save(); closeSheet(); renderTop(); } }] : []),
      ...(idx < w.ex.length - 1 ? [{ label: 'Move down', icon: 'down', fn: () => { w.ex.splice(idx + 1, 0, w.ex.splice(idx, 1)[0]); save(); closeSheet(); renderTop(); } }] : []),
      { label: 'Remove from workout', icon: 'trash', danger: true, fn: () => confirmSheet('Remove exercise?', 'Removes “' + ex.name + '” from this workout.', 'Remove', () => { w.ex.splice(idx, 1); save(); closeSheet(); renderTop(); }) }]); },
    exf_kind() { exfRead(); exf.kind = d.v; exfRender(); },
    exf_eq() { exfRead(); const k = exf.equip.indexOf(d.v); k >= 0 ? exf.equip.splice(k, 1) : exf.equip.push(d.v); exfRender(); },
    exf_rest() { exfRead(); exf.rest = +d.v; exfRender(); },
    exf_addeq() { exfRead(); const v = ($('#x-neweq').value || '').trim(); if (!v) return toast('Type the equipment name'); S.equipment = S.equipment || []; if (!allEquip().some(e => e.toLowerCase() === v.toLowerCase())) S.equipment.push(v); const name = allEquip().find(e => e.toLowerCase() === v.toLowerCase()); if (!exf.equip.includes(name)) exf.equip.push(name); save(); exfRender(); },
    exf_save() { exfRead(); const name = exf.name.trim(); if (!name) return toast('Give the exercise a name'); const w = wk(exf.w);
      if (exf.exId) { const ex = w.ex.find(x => x.id === exf.exId); Object.assign(ex, { name, kind: exf.kind, equip: exf.equip, desc: exf.desc.trim() || ex.desc, rest: exf.rest, sets: exf.sets }); }
      else { const ex = { id: 'x' + uid(), name, kind: exf.kind, equip: exf.equip, desc: exf.desc.trim() || '2 sets x 6-10 Rep range both sets to FAILURE', rest: exf.rest, sets: exf.sets, note: '', history: [] }; if (exf.replaceId) { const k = w.ex.findIndex(x => x.id === exf.replaceId); w.ex.splice(k, 1, ex); } else w.ex.push(ex); }
      const cb = exf.after; save(); closeSheet(); cb && cb(); toast('Exercise saved'); },
    eqsheet() { equipSheet(wk(d.w)); },
    weq() { const w = window._eqw; w.equip = w.equip || []; const k = w.equip.indexOf(d.v); k >= 0 ? w.equip.splice(k, 1) : w.equip.push(d.v); save(); $('#eqbody').innerHTML = window._eqbody(); if (curNav()) renderTop(); },
    weq_add() { const w = window._eqw, v = ($('#eq-new').value || '').trim(); if (!v) return toast('Type the equipment name'); S.equipment = S.equipment || []; if (!allEquip().some(e => e.toLowerCase() === v.toLowerCase())) S.equipment.push(v); const nm = allEquip().find(e => e.toLowerCase() === v.toLowerCase()); w.equip = w.equip || []; if (!w.equip.includes(nm)) w.equip.push(nm); save(); $('#eqbody').innerHTML = window._eqbody(); if (curNav()) renderTop(); },
    wmenu2() { const w = wk(d.w); menu(w.name, [
      { label: 'Add exercise', icon: 'plus', fn: () => insertExSheet(w, null, () => renderTop()) },
      { label: 'Edit name, time & instructions', icon: 'pencil', fn: () => formSheet('Workout details', [{ id: 'n', label: 'Name', value: w.name }, { id: 'e', label: 'Estimated time', value: w.est, ph: 'e.g. 1h 10m' }, { id: 'i', label: 'Instructions', type: 'textarea', value: w.instr }], 'Save', () => { const n = $('#f-n').value.trim(); if (!n) return toast('Name is required'); w.name = n; w.est = $('#f-e').value.trim() || w.est; w.instr = $('#f-i').value; save(); closeSheet(); renderTop(); renderBase(); }) },
      { label: 'Edit equipment', icon: 'sliders', fn: () => equipSheet(w) },
      { label: 'Schedule on a day', icon: 'calendar', fn: () => scheduleSheet(w.id) },
      { label: 'Delete workout', icon: 'trash', danger: true, fn: () => confirmSheet('Delete workout?', 'Deletes “' + w.name + '” and removes it from your calendar. Saved lift history stays in your exercise pages only if you add those exercises elsewhere.', 'Delete', () => { delete S.workouts[w.id]; S.schedule = S.schedule.filter(x => x.wid !== w.id); if (S.active && !inst(S.active.id)) S.active = null; save(); closeSheet(); nav = []; $('#layers').innerHTML = ''; render(); toast('Workout deleted'); }) }]); },
    newworkout() { formSheet('New workout', [{ id: 'n', label: 'Name', ph: 'e.g. Push Day' }, { id: 'e', label: 'Estimated time', value: '45 minutes' }, { id: 'i', label: 'Instructions (optional)', type: 'textarea', ph: 'Rep ranges, progression rules…' }], 'Create', () => { const n = $('#f-n').value.trim(); if (!n) return toast('Give the workout a name'); const id = 'w' + uid(); S.workouts[id] = { id, name: n, est: $('#f-e').value.trim() || '45 minutes', instr: $('#f-i').value.trim(), equip: [], ex: [], custom: true }; save(); closeSheet(); renderBase(); pushScreen('preview', { wid: id }); toast('Workout created — add your exercises'); }); },
    addgoal() { menu('Add a goal', [
      { label: 'Body weight goal', icon: 'scale', fn: () => goalForm('weight') },
      { label: 'Lift goal (e.g. 225 lb bench)', icon: 'dumbbell', fn: () => goalForm('lift') },
      { label: 'Daily habit', icon: 'check', fn: () => A.addhabit() },
      { label: 'Custom goal', icon: 'target', fn: () => goalForm('custom') }]); },
    addhabit() { formSheet('New daily habit', [{ id: 'n', label: 'Habit', ph: 'e.g. Stretch for 10 minutes' }], 'Add', () => { const n = $('#f-n').value.trim(); if (!n) return toast('Name the habit'); S.habits.push({ id: 'h' + uid(), name: n, short: n.length > 38 ? n.slice(0, 37) + '…' : n, range: 'STARTED ' + niceDate(todayStr()).toUpperCase() + ' (EVERYDAY)', longest: 0 }); save(); closeSheet(); render(); toast('Habit added'); }); },
    habitmenu() { const h = S.habits.find(x => x.id === d.id); menu(h.short, [
      { label: 'Rename', icon: 'pencil', fn: () => formSheet('Rename habit', [{ id: 'n', label: 'Habit', value: h.name }], 'Save', () => { const n = $('#f-n').value.trim(); if (!n) return; h.name = n; h.short = n.length > 38 ? n.slice(0, 37) + '…' : n; save(); closeSheet(); render(); }) },
      { label: 'Delete habit', icon: 'trash', danger: true, fn: () => confirmSheet('Delete habit?', 'Removes “' + h.short + '” and its streak history.', 'Delete', () => { S.habits = S.habits.filter(x => x.id !== h.id); Object.keys(S.habitDone).forEach(k => { if (k.endsWith('|' + h.id)) delete S.habitDone[k]; }); save(); closeSheet(); render(); }) }]); },
    goalmenu() { const g = goalsList().find(x => x.id === d.id); menu(g.name, [
      ...(g.type === 'custom' ? [{ label: 'Update progress', icon: 'trend', fn: () => formSheet('Update progress', [{ id: 'c', label: 'Current value' + (g.unit ? ' (' + g.unit + ')' : ''), type: 'number', value: g.cur ?? g.startVal ?? 0 }], 'Save', () => { const v = num($('#f-c').value); if (isNaN(v)) return toast('Enter a number'); g.cur = v; save(); closeSheet(); render(); }) }] : []),
      { label: 'Edit goal', icon: 'pencil', fn: () => goalForm(g.type, g) },
      { label: 'Delete goal', icon: 'trash', danger: true, fn: () => confirmSheet('Delete goal?', 'Removes “' + g.name + '”.', 'Delete', () => { S.goals = goalsList().filter(x => x.id !== g.id); save(); closeSheet(); render(); }) }]); },
    finish() { finishWorkout(); },
    diffnote() { const t = curNav(); formSheet('Comment', [{ id: 'c', label: 'Comment on this workout', type: 'textarea', value: t.comment || '' }], 'Save', () => { t.comment = $('#f-c').value.trim(); closeSheet(); renderTop(); }); },
    diffdone() { const t = curNav(); afterSave(t.id, t.v, t.comment); },
    sumdone() { nav = []; $('#layers').innerHTML = ''; tab = 'home'; selDay = todayStr(); render(); },
    move() { moveSheet(inst(d.id)); },
    movemode() { moveSheet(inst(d.id), d.v); },
    moveto() { buzz(); applyMove(inst(d.id), d.d, d.mode); },
    schedule() { scheduleSheet(d.id); },
    schedto() { S.schedule.push({ id: uid(), wid: d.w, date: d.d, done: false, log: {}, diff: null }); save(); selDay = d.d; closeSheet(); toast('Scheduled for ' + lbl(d.d)); render(); },
    unschedule() { const i = inst(d.id); confirmSheet('Remove workout?', 'Removes it from ' + longDay(i.date) + '. Saved history stays in the exercise pages.', 'Remove', () => { S.schedule = S.schedule.filter(x => x.id !== i.id); if (S.active && S.active.id === i.id) S.active = null; save(); closeSheet(); nav = []; $('#layers').innerHTML = ''; render(); }); },
    dpnav() { const o = dpSheet || dp; if (!o) return; o.m += +d.n; if (o.m > 11) { o.m = 0; o.y++; } if (o.m < 0) { o.m = 11; o.y--; } const w = $('#dpwrap2') || $('#dpwrap'); w.innerHTML = calGrid(o.y, o.m, o.sel || selDay, o.mark || (x => itemsOn(x).length)); },
    dppick() { if (dpSheet) { const f = dpSheet.onPick; f && f(d.d); } else { selDay = d.d; renderBase(); } },
    weightlog() { weightQuick(d.d); },
    weightdel() { delete S.metrics.weight[d.d]; save(); closeSheet(); render(); toast('Entry deleted'); },
    metric() { pushScreen('metric', { k: d.k }); },
    mdate() { const cur = el.dataset.d; datePicker('Date', cur, x => { el.dataset.d = x; el.innerHTML = ic('calendar', 16) + ' ' + (x === todayStr() ? 'Today' : shortDate(x)); closeSheet(); }); },
    msave() { saveMetric(d.k, $('#mdate').dataset.d, $('#mval').value); if (curNav() && curNav().screen === 'metric') { renderTop(); } },
    medit() { const k = d.k, m = METRICS[k]; formSheet(m.name + ' · ' + lbl(d.d), [{ id: 'v', label: m.name + ' (' + m.unit + ')', type: m.text ? 'text' : 'number', value: S.metrics[k][d.d] }], 'Save', () => { const raw = $('#f-v').value; const v = m.text ? raw.trim() : num(raw); if (!v || (!m.text && v <= 0)) return toast('Enter a value'); S.metrics[k][d.d] = v; save(); closeSheet(); render(); }, `<button class="btn danger block" style="margin-top:10px" data-act="metricdel" data-k="${k}" data-d="${d.d}">Delete this entry</button>`); },
    metricdel() { delete S.metrics[d.k][d.d]; save(); closeSheet(); render(); },
    nutgraph() { pushScreen('nutgraph'); },
    editgoal() { const g = S.goal; formSheet('Daily goal', [{ id: 'cal', label: 'Calories', type: 'number', value: g.cal }, { id: 'p', label: 'Protein (g)', type: 'number', value: g.p }, { id: 'c', label: 'Carbs (g)', type: 'number', value: g.c }, { id: 'f', label: 'Fat (g)', type: 'number', value: g.f }], 'Save', () => { const n = id => num($('#f-' + id).value); if ([n('cal'), n('p'), n('c'), n('f')].some(x => isNaN(x) || x < 0)) return toast('Check the numbers'); S.goal = { cal: n('cal'), p: n('p'), c: n('c'), f: n('f') }; save(); closeSheet(); render(); }); },
    mealsseg() { mealsSeg = d.v; if (d.pick) selDay = d.pick; renderBase(); },
    logdate() { datePicker('Log meals to', selDay, x => { selDay = x; diaryDay = x; closeSheet(); renderBase(); }); },
    pday() { planDay = +d.n; renderBase(); },
    logmeal() { buzz(); logPlanMeal(selDay, +d.n, +d.k); renderBase(); },
    logday() { const arr = dayMeals(selDay), n = +d.n, D = MEAL_PLAN.days[n - 1]; const all = D.meals.every((m, k) => arr.some(x => x.id === `plan-${n}-${k}`)); D.meals.forEach((m, k) => { const has = arr.some(x => x.id === `plan-${n}-${k}`); if (all ? has : !has) logPlanMeal(selDay, n, k); }); renderBase(); toast(all ? 'Day removed from diary' : 'Day ' + n + ' logged to ' + lbl(selDay)); },
    diaryn() { diaryDay = addDays(diaryDay, +d.n); selDay = diaryDay; renderBase(); },
    addmeal() { addMealSheet(d.d || diaryDay); },
    delmeal() { S.diary[d.d].splice(+d.k, 1); save(); renderBase(); },
    grocheck() { const gc = S.plan.grocery; gc[d.n] = !gc[d.n]; save(); renderBase(); },
    groclear() { S.plan.grocery = {}; save(); renderBase(); },
    grocopy() { const txt = MEAL_PLAN.grocery.map(g => g[0] + '\n' + g[1].map(i => '- ' + i[0] + ': ' + i[1]).join('\n')).join('\n\n'); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Grocery list copied'), () => toast('Copy not available')); },
    planstart() { datePicker('Meal plan Day 1', S.plan.start, x => { S.plan.start = x; planDay = planDayFor(todayStr()); save(); closeSheet(); renderTop(); renderBase(); toast('Day 1 set to ' + shortDate(x)); }); },
    editnote() { const w = wk(d.w), ex = w.ex.find(x => x.id === d.e); noteSheet(w, ex); },
    delnote() { const ex = wk(d.w).ex.find(x => x.id === d.e); confirmSheet('Delete note?', 'This removes the note for ' + ex.name + '.', 'Delete', () => { ex.note = ''; save(); closeSheet(); renderTop(); }); },
    export() { exportData(); }, import() { importData(); },
    gympick() { gymSheet(d.id); },
    gymspage() { pushScreen('gyms'); },
    gymadd() { addGymSheet(null); },
    gymrename() { const g = S.gyms.find(x => x.id === d.g); formSheet('Rename gym', [{ id: 'n', label: 'Gym name', value: g.name }], 'Save', () => { const n = $('#f-n').value.trim(); if (!n) return; g.name = n; save(); closeSheet(); renderTop(); toast('Renamed'); }); },
    gymdel() { const g = S.gyms.find(x => x.id === d.g); if (S.gyms.length < 2) return toast('You need at least one gym'); const to = S.gyms.find(x => x.id !== g.id);
      confirmSheet('Delete ' + g.name + '?', 'Numbers logged there will move to ' + to.name + '.', 'Delete', () => { Object.values(S.workouts).forEach(w => w.ex.forEach(e => e.history.forEach(h => { if (h.gym === g.id) h.gym = to.id; }))); S.schedule.forEach(x => { if (x.gym === g.id) x.gym = to.id; }); S.gyms = S.gyms.filter(x => x.id !== g.id); ensureGyms(); save(); closeSheet(); renderTop(); toast('Gym deleted'); }); },
    exgym() { exGym = d.g; renderTop(); },
    mergeseed() { const done = n => { closeSheet(); render(); toast(n ? 'Added ' + n + ' missing items' : 'Already up to date'); };
      if (typeof seedState === 'function') return done(mergeStarter(seedState()));
      formSheet('Unlock code', [{ id: 'c', label: 'Your unlock code', ph: 'unlock code' }], 'Add', async () => { try { done(mergeStarter(await decryptSeed($('#f-c').value.trim().toLowerCase()))); } catch (e) { toast('That code did not work'); } }); },
    reset() { confirmSheet('Reset everything?', 'This erases everything you logged and restores the original numbers from the screen recording. Back up first if unsure.', 'Reset', () => { if (typeof seedState === 'function') { S = seedState(); syncPlan(); save(); closeSheet(); nav = []; $('#layers').innerHTML = ''; planDay = planDayFor(todayStr()); render(); toast('Reset to original data'); } else { localStorage.removeItem(KEY); location.reload(); } }); },
    restskip() { restT = null; renderOverlay(); },
    restadd() { if (restT) restT.left += 15; renderOverlay(); },
    closesheet() { closeSheet(); },
    menuitem() { const it = window._menu[+d.k]; if (!it) return; const sheetBefore = sheet; closeSheet(); setTimeout(() => it.fn && it.fn(), 30); },
    unlock() { unlockSeed($('#lockcode').value); },
    formok() { const cb = sheetCb; if (cb) cb(); }
  };
  if (A[a]) { try { A[a](); } catch (err) { console.error(err); (window.__errs = window.__errs || []).push(String(err && err.stack || err)); toast('Something went wrong — your data is safe. Try again.'); } }
});
window.addEventListener('error', e => { (window.__errs = window.__errs || []).push(e.message); });
window.addEventListener('unhandledrejection', e => { (window.__errs = window.__errs || []).push(String(e.reason)); });
let exGym = 'all';
function gymSheet(id) {
  const i = inst(id); if (!i) return; const cur = gymOf(i);
  menu('Which gym are you at?', [...S.gyms.map(g => ({ label: (g.id === cur ? '✓  ' : '') + g.name, icon: 'dumbbell', fn: () => setGym(id, g.id) })), { label: 'Add a new gym', icon: 'plus', fn: () => addGymSheet(id) }]);
}
function setGym(id, gid) {
  const i = inst(id); if (!i) return; i.gym = gid; S.gym = gid;
  if (i.done) Object.values(S.workouts).forEach(w => w.ex.forEach(e => e.history.forEach(h => { if (h.instId === i.id) h.gym = gid; })));
  save(); closeSheet(); renderTop(); renderBase(); toast('Gym: ' + gymName(gid));
}
function addGymSheet(id) {
  formSheet('New gym', [{ id: 'n', label: 'Gym name', ph: 'e.g. Crunch, 24 Hour Fitness, Lifetime' }], 'Add', () => {
    const n = $('#f-n').value.trim(); if (!n) return;
    let g = S.gyms.find(x => x.name.toLowerCase() === n.toLowerCase()); if (!g) { g = { id: 'g' + uid(), name: n }; S.gyms.push(g); }
    if (id) setGym(id, g.id); else { save(); closeSheet(); renderTop(); toast('Added ' + g.name); }
  });
}
function gymsView() {
  return `<div class="top"><button class="iconbtn" data-act="back">${ic('chevl')}</button><div class="t">Gyms</div><div class="sp" style="flex:0 0 40px"></div></div><div class="scroll">
  <div class="small mute" style="margin:0 4px 6px;line-height:1.5">Weights differ between gyms, so each gym keeps its own “Previous” numbers, history and personal bests. Pick the gym at the top of any workout.</div>
  ${S.gyms.map(g => { const n = new Set(S.schedule.filter(x => x.done && gymOf(x) === g.id).map(x => x.id)).size; return `<div class="card row" style="padding:14px 16px"><div class="thumb" style="width:44px;height:44px;border-radius:12px">${ic('dumbbell', 22)}</div><div class="grow"><b>${esc(g.name)}</b>${g.id === S.gym ? ' <span class="badge y">last used</span>' : ''}<div class="xs mute">${n} saved workout${n === 1 ? '' : 's'}</div></div><button class="iconbtn" data-act="gymrename" data-g="${g.id}" aria-label="Rename">${ic('pencil', 20)}</button>${S.gyms.length > 1 ? `<button class="iconbtn" data-act="gymdel" data-g="${g.id}" aria-label="Delete">${ic('trash', 20)}</button>` : ''}</div>`; }).join('')}
  <button class="add" data-act="gymadd" style="margin:14px auto">${ic('plus', 18, '', 2.4)} Add gym</button></div>`;
}
function noteSheet(w, ex) { formSheet(ex.name, [{ id: 'n', label: 'Note', type: 'textarea', value: ex.note, ph: 'Machine settings, form cues, how it felt…' }], 'Save', () => { ex.note = $('#f-n').value.trim(); save(); closeSheet(); if (curNav()) renderTop(); }); }

/* ---- gestures: swipe from left edge = back, drag down on logger header = minimize ---- */
let tx = null;
document.addEventListener('touchstart', e => { const t = e.touches[0]; tx = { x: t.clientX, y: t.clientY, t: Date.now(), top: !!e.target.closest('#lt') }; }, { passive: true });
document.addEventListener('touchend', e => {
  if (!tx) return; const t = e.changedTouches[0], dx = t.clientX - tx.x, dy = t.clientY - tx.y; const s = tx; tx = null;
  if (sheet) return; const cur = curNav(); if (!cur) return;
  if (cur.screen === 'logger' && s.top && dy > 90 && Math.abs(dx) < 70) return minimize();
  if (s.x < 28 && dx > 80 && Math.abs(dy) < 70 && !['logger', 'summary'].includes(cur.screen)) popScreen();
}, { passive: true });

/* ====================== lock screen (public build) ====================== */
function renderLock(msg) {
  $('#base').innerHTML = `<div class="scroll" style="display:flex;flex-direction:column;justify-content:center;padding:28px 26px 60px">
  <div class="avatar" style="width:64px;height:64px;font-size:26px;border-radius:20px">MT</div>
  <h1 style="font-size:30px;margin:22px 0 6px;letter-spacing:-.6px">My Training</h1>
  <div class="mute" style="line-height:1.5;margin-bottom:22px">First launch on this device: enter your unlock code to load your workouts, numbers and meal plan. You only do this once — everything is then stored on your phone.</div>
  <input class="fi" id="lockcode" placeholder="unlock code" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false" style="margin-bottom:12px;background:var(--card);border:1.5px solid var(--line)">
  <div id="lockmsg" style="color:var(--red);font-weight:600;min-height:22px;margin-bottom:8px">${msg || ''}</div>
  <button class="btn block" data-act="unlock">Unlock</button>
  <div class="small faint" style="margin-top:22px;text-align:center">Or restore a backup file: <button class="link" data-act="import">choose file</button></div></div>`;
}
async function decryptSeed(code) {
    const b64 = x => Uint8Array.from(atob(x), c => c.charCodeAt(0)), enc = new TextEncoder();
    const km = await crypto.subtle.importKey('raw', enc.encode(code.trim().toLowerCase()), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(SEED_ENC.salt), iterations: SEED_ENC.iter, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(SEED_ENC.iv) }, key, b64(SEED_ENC.ct));
    return JSON.parse(new TextDecoder().decode(pt));
}
// add starter-data history entries / notes that this device is missing, without touching anything you logged
function mergeStarter(seed) {
  let added = 0;
  Object.values(seed.workouts || {}).forEach(sw => { if (!S.workouts[sw.id]) { S.workouts[sw.id] = JSON.parse(JSON.stringify(sw)); added++;   // restore a deleted starter workout + its scheduled days
      (seed.schedule || []).filter(x => x.wid === sw.id && !S.schedule.some(y => y.id === x.id)).forEach(x => S.schedule.push(JSON.parse(JSON.stringify(x)))); } });
  Object.values(seed.workouts || {}).forEach(sw => { const w = S.workouts && S.workouts[sw.id]; if (!w) return;
    sw.ex.forEach(se => { const e = w.ex.find(x => x.id === se.id); if (!e) return; e.history = e.history || [];
      se.history.forEach(h => { if (!e.history.some(x => x.date === h.date)) { e.history.push(h); added++; } });
      e.history.sort((a, b) => b.date.localeCompare(a.date));
      if (!e.note && se.note) { e.note = se.note; added++; } }); });
  save(); return added;
}
async function unlockSeed(code) {
  try {
    S = await decryptSeed(code); save(); syncPlan(); planDay = planDayFor(todayStr()); selDay = todayStr(); render();
  } catch (e) { const m = $('#lockmsg'); if (m) m.textContent = 'That code did not work — check it and try again.'; }
}

/* ====================== boot ====================== */
if (S && S.active && !inst(S.active.id)) { S.active = null; save(); }
render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
