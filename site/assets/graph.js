/* A rotating 3D constellation used as "the brain": nodes on a sphere, nearest-neighbour edges,
   and pulses travelling along edges. Purely visual; it draws onto any 2D context. */
(() => {
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  class Graph {
    constructor({ n = 90, k = 3, seed = 7, hue = [163, 149, 255] } = {}) {
      const rand = rng(seed);
      this.hue = hue;
      this.pts = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
        const j = 0.86 + rand() * 0.22; // slight radial jitter so it reads as organic, not a ball
        this.pts.push({ x: Math.cos(th) * r * j, y: y * j, z: Math.sin(th) * r * j, glow: 0 });
      }
      const seen = new Set();
      this.edges = [];
      this.pts.forEach((p, i) => {
        const near = this.pts.map((q, j) => [j, (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2])
          .filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, k);
        near.forEach(([j]) => { const key = i < j ? `${i}-${j}` : `${j}-${i}`; if (!seen.has(key)) { seen.add(key); this.edges.push([i, j]); } });
      });
      this.pulses = [];
      this.energy = 0;
      this.rand = rand;
      this.proj = this.pts.map(() => ({ x: 0, y: 0, z: 0 }));
    }

    /* Brighten the graph briefly, e.g. when context arrives. */
    flash(v = 1) { this.energy = Math.min(2, this.energy + v); for (let i = 0; i < 3; i++) this.spawn(); }

    spawn() {
      const e = this.edges[Math.floor(this.rand() * this.edges.length)];
      this.pulses.push({ e, p: 0, dir: this.rand() < 0.5, v: 0.6 + this.rand() * 0.9 });
    }

    draw(ctx, cx, cy, r, t, dt, o = {}) {
      const speed = o.speed ?? 1, alpha = o.alpha ?? 1, [h1, h2, h3] = this.hue;
      const a = t * 0.00016 * speed, tilt = 0.42;
      const ca = Math.cos(a), sa = Math.sin(a), ct = Math.cos(tilt), st = Math.sin(tilt);
      this.energy = Math.max(0, this.energy - dt * 0.8);
      const boost = 1 + this.energy * 0.6;

      this.pts.forEach((p, i) => {
        const x = p.x * ca + p.z * sa, z0 = -p.x * sa + p.z * ca;
        const y = p.y * ct - z0 * st, z = p.y * st + z0 * ct;
        const q = this.proj[i]; q.x = cx + x * r; q.y = cy + y * r; q.z = z;
      });

      // core glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.25);
      g.addColorStop(0, `rgba(${h1},${h2},${h3},${0.22 * alpha * boost})`);
      g.addColorStop(1, `rgba(${h1},${h2},${h3},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2); ctx.fill();

      ctx.lineWidth = 1;
      for (const [i, j] of this.edges) {
        const p = this.proj[i], q = this.proj[j];
        const d = ((p.z + q.z) / 2 + 1) / 2;
        ctx.strokeStyle = `rgba(${h1},${h2},${h3},${(0.05 + d * 0.32) * alpha * boost})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
      for (const q of this.proj) {
        const d = (q.z + 1) / 2;
        ctx.fillStyle = `rgba(235,232,255,${(0.25 + d * 0.75) * alpha})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, (0.8 + d * 1.9) * (r / 160 + 0.4), 0, Math.PI * 2); ctx.fill();
      }

      if (this.rand() < dt * (o.pulseRate ?? 6) * boost) this.spawn();
      const pc = o.pulse || [255, 198, 92];
      this.pulses = this.pulses.filter(pl => (pl.p += dt * pl.v) < 1);
      for (const pl of this.pulses) {
        const [i, j] = pl.dir ? pl.e : [pl.e[1], pl.e[0]];
        const p = this.proj[i], q = this.proj[j];
        const x = p.x + (q.x - p.x) * pl.p, y = p.y + (q.y - p.y) * pl.p;
        ctx.fillStyle = `rgba(${pc[0]},${pc[1]},${pc[2]},${0.18 * alpha})`;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${pc[0]},${pc[1]},${pc[2]},${0.95 * alpha})`;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  window.Graph = Graph;
})();
