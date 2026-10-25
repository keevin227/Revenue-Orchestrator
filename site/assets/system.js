/* The system slide: data silos → Signal Refinery & Context Pipeline → engine boundary →
   orchestration engine with four algorithms → execution surfaces. Revealed step by step,
   animated continuously. Layout is in stage pixels (1600×900). */
(() => {
  const slide = document.getElementById('s-system');
  if (!slide) return;
  const layer = document.getElementById('sys-layer');
  const overlay = document.getElementById('sys-overlay');
  const cv = document.getElementById('sys-canvas');
  const ctx = cv.getContext('2d');

  /* ---------- layout ---------- */
  const SOURCES = ['whatsapp', 'zoom', 'googlemeet', 'gmail', 'googlecalendar', 'googlemaps', 'hubspot',
    'zendesk', 'shopify', 'stripe', 'quickbooks', 'xero', 'sap', 'odoo'];
  const src = SOURCES.map((k, i) => ({ k, x: i % 2 ? 190 : 95, y: 205 + Math.floor(i / 2) * 96 }));
  const TUBE = { x0: 340, x1: 900, y: 500, h: 120 };
  const ZONES = [
    { x: 340, n: '01', l: 'Clean' }, { x: 452, n: '02', l: 'Resolve<br>identity' }, { x: 564, n: '03', l: 'Extract<br>signals' },
    { x: 676, n: '04', l: '+ RAG', cls: 'vi' }, { x: 788, n: '05', l: '+ Prompt', cls: 'gold' },
  ];
  const GATES = [452, 564, 676, 788];
  const BX = 965;
  const ENG = { x: 1180, y: 500, r: 100 };
  const ALGOS = [
    { x: 1075, y: 250, t: 'Contribution', s: 'financial' }, { x: 1285, y: 250, t: 'Sentinel', s: 'retention' },
    { x: 1075, y: 750, t: 'Resonance', s: 'persuasion' }, { x: 1285, y: 750, t: 'Radar', s: 'discovery' },
  ];
  const OUTS = [
    { k: 'card', t: 'Signal Card', s: 'sales · every call', c: '#3fd8ff' },
    { k: 'lead', t: 'New leads', s: 'qualified & routed', c: '#4ade80' },
    { k: 'quiet', t: 'Gone quiet', s: 're-engaged on time', c: '#ffb547' },
    { k: 'loyal', t: 'Loyal customers', s: 'rewarded & expanded', c: '#ff7ab6' },
    { k: 'mail', t: 'Correspondence', s: 'replies drafted', c: '#7aa2ff' },
    { k: 'mic', t: 'Leaders', s: 'decide by voice', c: '#a395ff' },
  ].map((o, i) => ({ ...o, x: 1405, y: 200 + i * 100 }));
  const LABELS = ['intent ↑', 'price doubt', 'renewal 34d', 'margin 41%', 'churn risk', 'new site', 'reply lag 6d',
    'competitor ×3', 'ticket urgent', 'expansion', 'loyalty 96', 'payment slow', 'champion', 'budget Q1'];

  /* ---------- DOM ---------- */
  const el = (parent, cls, html, style, f) => {
    const d = document.createElement('div');
    d.className = cls; if (html) d.innerHTML = html; Object.assign(d.style, style);
    if (f !== undefined) d.dataset.f = f;
    parent.appendChild(d); return d;
  };
  const px = v => v + 'px';

  el(overlay, 'sec-h', 'Data silos', { left: px(68), top: px(160) }, 0);
  const srcEls = src.map(s => el(overlay, 'src', `<i class="logo" data-logo="${s.k}"></i><small>${window.BRANDS[s.k].title}</small>`,
    { left: px(s.x - 27), top: px(s.y - 27) }, 0));

  el(layer, 'tube', '', { left: px(TUBE.x0), top: px(TUBE.y - TUBE.h / 2), width: px(TUBE.x1 - TUBE.x0), height: px(TUBE.h) }, 1);
  GATES.forEach(x => el(layer, 'gate', '', { left: px(x), top: px(TUBE.y - TUBE.h / 2 + 8), height: px(TUBE.h - 16) }, 1));
  el(overlay, 'sec-h', 'Signal Refinery &amp; Context Pipeline', { left: px(TUBE.x0), top: px(352), color: 'var(--cy)' }, 1);
  ZONES.forEach(z => el(overlay, `zone-l ${z.cls || ''}`, `<b>${z.n}</b>${z.l}`, { left: px(z.x + 56), top: px(388) }, 1));
  el(overlay, 'sec-h', 'raw data', { left: px(TUBE.x0 + 4), top: px(578), color: 'var(--dim)' }, 1);

  el(overlay, 'boundary', '', { left: px(BX), top: px(205), height: px(625) }, 2);
  el(overlay, 'b-top', 'Engine boundary', { left: px(BX), top: px(182) }, 2);
  el(overlay, 'b-left', 'Data stops here.', { left: px(BX - 16), top: px(572) }, 2);
  el(overlay, 'b-right', 'Context crosses.', { left: px(BX + 16), top: px(572) }, 2);

  el(layer, 'engine-ring', '', { left: px(ENG.x - ENG.r), top: px(ENG.y - ENG.r), width: px(ENG.r * 2), height: px(ENG.r * 2) }, 3);
  el(overlay, 'engine-l', '<b>Orchestration Engine</b><span>brain · revenue context graph</span>', { left: px(ENG.x), top: px(ENG.y + ENG.r + 12) }, 3);
  ALGOS.forEach(a => el(overlay, 'chip-algo', `<i>Algorithm</i><b>${a.t}<span>${a.s}</span></b>`, { left: px(a.x - 93), top: px(a.y - 31) }, 3));

  el(overlay, 'sec-h', 'Execution', { left: px(1405), top: px(138) }, 4);
  const outEls = OUTS.map(o => {
    const d = el(overlay, 'outp', `<span class="out-ico" data-ico="${o.k}"></span><b>${o.t}</b><span class="s">${o.s}</span>`,
      { left: px(o.x), top: px(o.y - 35) }, 4);
    d.style.setProperty('--c', o.c);
    return d;
  });
  window.Deck.hydrate(slide);

  /* ---------- state ---------- */
  let step = 0;
  const graph = new window.Graph({ n: 46, k: 3, seed: 11 });
  const alpha = { engine: 0, outs: 0, algos: 0, guides: 0 };
  let parts = [];
  const acc = { raw: 0, alg: 0, out: 0 };
  let lastPing = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rate = window.Deck.reducedMotion ? 0.4 : 1;

  window.Deck.onStep(slide, s => { step = s; });
  let k = 1;
  window.Deck.onResize(() => { k = window.Deck.fit(cv, 1600, 900); });

  const bez = (a, c, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const hex = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

  function ping(elm, ms = 260) { elm.classList.add('ping'); setTimeout(() => elm.classList.remove('ping'), ms); }

  function spawnRaw(t) {
    const i = Math.floor(Math.random() * src.length), s = src[i];
    parts.push({ type: 'raw', sx: s.x, sy: s.y, ex: TUBE.x0, ey: TUBE.y + rnd(-26, 26), cx: 280, cy: (s.y + TUBE.y) / 2, t: 0, dur: rnd(1.3, 2.1) });
    if (t - lastPing > 140) { lastPing = t; ping(srcEls[i].querySelector('.logo'), 220); }
  }
  function spawnTube(y) {
    parts.push({ type: 'tube', x: TUBE.x0, y: y, ph: rnd(0, Math.PI * 2), r: 2.2, gate: 0, fade: 1, merging: false, sig: false, rag: false });
  }
  let lastLabel = 0;
  function spawnCap(y) {
    const now = performance.now();
    const labeled = now - lastLabel > 650 && Math.random() < 0.5;
    if (labeled) lastLabel = now;
    const label = labeled ? window.deckTranslate(LABELS[Math.floor(Math.random() * LABELS.length)]) : null;
    let w = 0;
    if (label) { ctx.font = '500 10.5px "JetBrains Mono", monospace'; w = ctx.measureText(label).width + 16; }
    parts.push({ type: 'cap', sx: TUBE.x1, sy: y, ex: ENG.x - ENG.r + 6, ey: ENG.y + rnd(-14, 14), lane: labeled ? rnd(-55, 55) : rnd(-30, 30), t: 0, dur: labeled ? 2.6 : rnd(1.3, 1.8), label, w });
  }
  function spawnAlg() {
    const a = ALGOS[Math.floor(Math.random() * ALGOS.length)];
    const ang = Math.atan2(ENG.y - a.y, ENG.x - a.x);
    parts.push({ type: 'alg', sx: a.x, sy: a.y + (a.y < ENG.y ? 31 : -31), ex: ENG.x - Math.cos(ang) * (ENG.r - 10), ey: ENG.y - Math.sin(ang) * (ENG.r - 10), t: 0, dur: rnd(0.9, 1.3) });
  }
  function spawnOut() {
    const i = Math.floor(Math.random() * OUTS.length), o = OUTS[i];
    const ang = Math.atan2(o.y - ENG.y, o.x - ENG.x);
    const sx = ENG.x + Math.cos(ang) * ENG.r, sy = ENG.y + Math.sin(ang) * ENG.r;
    parts.push({ type: 'out', i, sx, sy, ex: o.x - 4, ey: o.y, cx: (sx + o.x) / 2 + 20, cy: o.y, t: 0, dur: rnd(1.0, 1.4), c: o.c });
  }

  function guides() {
    // silos → inlet
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(125,133,151,0.13)';
    for (const s of src) { ctx.beginPath(); ctx.moveTo(s.x + 27, s.y); ctx.quadraticCurveTo(280, (s.y + TUBE.y) / 2, TUBE.x0, TUBE.y); ctx.stroke(); }
    // tube → engine
    if (step >= 2) {
      ctx.strokeStyle = 'rgba(255,198,92,0.16)';
      ctx.beginPath(); ctx.moveTo(TUBE.x1, TUBE.y); ctx.lineTo(ENG.x - ENG.r, ENG.y); ctx.stroke();
    }
    if (alpha.algos > 0.01) {
      ctx.setLineDash([4, 8]); ctx.lineDashOffset = -performance.now() / 40;
      ctx.strokeStyle = `rgba(163,149,255,${0.55 * alpha.algos})`;
      for (const a of ALGOS) {
        const ang = Math.atan2(ENG.y - a.y, ENG.x - a.x);
        ctx.beginPath(); ctx.moveTo(a.x, a.y + (a.y < ENG.y ? 31 : -31));
        ctx.lineTo(ENG.x - Math.cos(ang) * ENG.r, ENG.y - Math.sin(ang) * ENG.r); ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    if (alpha.outs > 0.01) {
      for (const o of OUTS) {
        const ang = Math.atan2(o.y - ENG.y, o.x - ENG.x);
        const sx = ENG.x + Math.cos(ang) * ENG.r, sy = ENG.y + Math.sin(ang) * ENG.r;
        ctx.strokeStyle = hex(o.c, 0.22 * alpha.outs);
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + o.x) / 2 + 20, o.y, o.x - 4, o.y); ctx.stroke();
      }
    }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function frame(t, dt) {
    const toward = (v, target, s) => v + (target - v) * Math.min(1, dt * s);
    alpha.engine = toward(alpha.engine, step >= 3 ? 1 : 0, 3);
    alpha.algos = toward(alpha.algos, step >= 3 ? 1 : 0, 3);
    alpha.outs = toward(alpha.outs, step >= 4 ? 1 : 0, 3);

    // spawn
    acc.raw += dt * 24 * rate;
    while (acc.raw > 1) { acc.raw--; if (parts.length < 520) spawnRaw(t); }
    if (step >= 3) { acc.alg += dt * 9 * rate; while (acc.alg > 1) { acc.alg--; spawnAlg(); } }
    if (step >= 4) { acc.out += dt * 9 * rate; while (acc.out > 1) { acc.out--; spawnOut(); } }

    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, 1600, 900);
    guides();

    if (alpha.engine > 0.01) graph.draw(ctx, ENG.x, ENG.y, 74, t, dt, { alpha: alpha.engine, speed: 1.6, pulseRate: 5 });

    const keep = [];
    for (const p of parts) {
      if (p.type === 'raw') {
        p.t += dt / p.dur;
        if (p.t >= 1) {
          if (step >= 1) spawnTube(p.ey);
          continue;
        }
        const e = ease(p.t);
        const x = bez(p.sx, p.cx, p.ex, e), y = bez(p.sy, p.cy, p.ey, e);
        const a = Math.min(1, p.t * 6) * (step >= 1 ? 1 : 1 - Math.max(0, (p.t - 0.75) * 4));
        ctx.fillStyle = `rgba(150,158,176,${0.85 * a})`;
        ctx.fillRect(x - 1.6, y - 1.6, 3.2, 3.2);
        keep.push(p);
      } else if (p.type === 'tube') {
        p.x += dt * 165;
        const prog = (p.x - TUBE.x0) / (TUBE.x1 - TUBE.x0);
        let y = p.y + Math.sin(p.ph + p.x * 0.028) * 10;
        y = TUBE.y + (y - TUBE.y) * (1 - prog * 0.65);
        if (p.gate < 1 && p.x >= GATES[0]) p.gate = 1;
        if (p.gate < 2 && p.x >= GATES[1]) { p.gate = 2; if (Math.random() < 0.5) p.merging = true; else p.r += 1.1; }
        if (p.gate < 3 && p.x >= GATES[2]) { p.gate = 3; p.sig = true; }
        if (p.gate < 4 && p.x >= GATES[3]) { p.gate = 4; p.rag = true; }
        if (p.merging) { p.fade -= dt * 4; y = TUBE.y + (y - TUBE.y) * p.fade; if (p.fade <= 0) continue; }
        if (p.x >= TUBE.x1) { if (step >= 2) spawnCap(y); continue; }
        const a = p.fade * Math.min(1, prog * 30);
        if (p.gate === 0) { ctx.fillStyle = `rgba(150,158,176,${a})`; ctx.fillRect(p.x - 1.6, y - 1.6, 3.2, 3.2); }
        else {
          const col = p.sig ? '63,216,255' : '214,220,232';
          if (p.sig) { ctx.fillStyle = `rgba(${col},${0.16 * a})`; ctx.beginPath(); ctx.arc(p.x, y, p.r + 5, 0, 7); ctx.fill(); }
          ctx.fillStyle = `rgba(${col},${a})`; ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, 7); ctx.fill();
          if (p.rag) { ctx.strokeStyle = `rgba(163,149,255,${0.85 * a})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, y, p.r + 3.2, 0, 7); ctx.stroke(); }
          if (p.gate >= 4 && p.x > GATES[3] + 50) { // framed by the prompt layer: a gold bracket
            ctx.strokeStyle = `rgba(255,198,92,${0.9 * a})`; ctx.lineWidth = 1.2;
            const s = p.r + 5.5; roundRect(p.x - s, y - s, s * 2, s * 2, 3); ctx.stroke();
          }
        }
        keep.push(p);
      } else if (p.type === 'cap') {
        p.t += dt / p.dur;
        const engineOn = step >= 3;
        if (p.t >= 1) { if (engineOn) graph.flash(p.label ? 0.25 : 0.08); continue; }
        const e = p.t;
        const x = p.sx + (p.ex - p.sx) * e;
        const y = p.sy + (p.ey - p.sy) * ease(e) + p.lane * Math.sin(Math.PI * e);
        let a = Math.min(1, e * 8);
        if (!engineOn) a *= 1 - Math.max(0, (x - 1040) / 40);
        if (a <= 0) continue;
        if (p.label) {
          const h = 19, w = p.w;
          ctx.fillStyle = `rgba(20,16,8,${0.92 * a})`; roundRect(x - w / 2, y - h / 2, w, h, 9.5); ctx.fill();
          ctx.strokeStyle = `rgba(255,198,92,${0.85 * a})`; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = `rgba(255,214,140,${a})`; ctx.font = '500 10.5px "JetBrains Mono", monospace';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.label, x, y + 0.5);
        } else {
          ctx.fillStyle = `rgba(255,198,92,${0.18 * a})`; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill();
          ctx.fillStyle = `rgba(255,198,92,${a})`; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill();
        }
        keep.push(p);
      } else if (p.type === 'alg') {
        p.t += dt / p.dur;
        if (p.t >= 1) { graph.flash(0.05); continue; }
        const x = p.sx + (p.ex - p.sx) * p.t, y = p.sy + (p.ey - p.sy) * p.t;
        const a = alpha.algos * Math.min(1, p.t * 5);
        ctx.fillStyle = `rgba(163,149,255,${0.2 * a})`; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill();
        ctx.fillStyle = `rgba(214,206,255,${a})`; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fill();
        keep.push(p);
      } else if (p.type === 'out') {
        p.t += dt / p.dur;
        if (p.t >= 1) { ping(outEls[p.i]); continue; }
        const e = ease(p.t);
        const x = bez(p.sx, p.cx, p.ex, e), y = bez(p.sy, p.cy, p.ey, e);
        const a = alpha.outs * Math.min(1, p.t * 6);
        ctx.fillStyle = hex(p.c, 0.2 * a); ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fill();
        ctx.fillStyle = hex(p.c, a); roundRect(x - 5, y - 3.5, 10, 7, 2); ctx.fill();
        keep.push(p);
      }
    }
    parts = keep;
  }

  window.Deck.render(slide, frame);
})();
