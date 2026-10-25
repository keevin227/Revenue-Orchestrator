/* Per-slide canvases: the brain constellation on the title, engine and "one brain" slides,
   plus the voice waveform. */
(() => {
  const Deck = window.Deck;

  function graphCanvas(selector, opts) {
    const cv = document.querySelector(selector);
    if (!cv) return;
    const slide = cv.closest('.slide');
    const ctx = cv.getContext('2d');
    const w = opts.w, h = opts.h;
    const g = new window.Graph(opts.graph);
    let k = 1;
    Deck.onResize(() => { k = Deck.fit(cv, w, h); });
    Deck.render(slide, (t, dt) => {
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, w, h);
      g.draw(ctx, opts.cx, opts.cy, opts.r, t, dt, opts.draw);
    });
    if (opts.flashOnStep) Deck.onStep(slide, () => g.flash(1.2));
    return g;
  }

  graphCanvas('[data-graph="title"]', {
    w: 1600, h: 900, cx: 1180, cy: 430, r: 330,
    graph: { n: 150, k: 3, seed: 3 }, draw: { alpha: 0.85, speed: 0.6, pulseRate: 10 },
  });
  graphCanvas('[data-graph="engine"]', {
    w: 500, h: 500, cx: 250, cy: 250, r: 180,
    graph: { n: 110, k: 3, seed: 5 }, draw: { alpha: 1, speed: 1, pulseRate: 9 }, flashOnStep: true,
  });
  graphCanvas('[data-graph="one"]', {
    w: 420, h: 420, cx: 210, cy: 210, r: 150,
    graph: { n: 90, k: 3, seed: 9 }, draw: { alpha: 1, speed: 1.2, pulseRate: 8 },
  });

  const wave = document.getElementById('wave');
  if (wave) {
    wave.innerHTML = Array.from({ length: 34 }, (_, i) => {
      const h = 12 + Math.round(Math.abs(Math.sin(i * 1.7)) * 34 + (i % 3) * 4);
      return `<i style="--h:${h}px;animation-delay:${(-(i * 0.09)).toFixed(2)}s"></i>`;
    }).join('');
  }
})();
