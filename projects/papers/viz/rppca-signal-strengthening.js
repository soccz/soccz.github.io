/* viz: signal-strengthening
 * γ가 신호를 "끌어올리는" 모습을 적층 막대로 시각화.
 * 신호 = σ²_F + (1+γ)·μ²_F  (논문 4번째 해석)
 * 막대 분할:
 *   파란층 = σ²_F (분산 신호; γ 무관)
 *   주황층 = (1+γ)·μ²_F (평균 신호; γ에 따라 증가)
 * 임계선 (검출 임계 θ_crit) 을 가로선으로.
 */

(function () {
  const U = window.VIZ_UTIL;

  VIZ_REGISTRY['rppca-signal-strengthening'] = function (canvas, controls, params) {
    let sigma_e2 = parseFloat(params.sigma_e2 || '1');
    let c = parseFloat(params.c || '0.5');
    let gamma = parseFloat(params.gamma || '0');

    // 4 factors: index 0..3
    const factors = [
      { name: 'F1 (시장)',     sigma2: 5.0,  SR: 0.12 },
      { name: 'F2 (강함)',     sigma2: 0.3,  SR: 0.10 },
      { name: 'F3 (약함)',     sigma2: 0.10, SR: 0.30 },
      { name: 'F4 (매우약함)', sigma2: 0.03, SR: 0.80 }   // weak+high-SR — 핵심
    ];

    U.addSlider(controls, {
      label: 'γ', min: -1, max: 30, step: 0.5, value: gamma,
      onInput: (v) => { gamma = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 1)
    });
    U.addSlider(controls, {
      label: 'c = N/T', min: 0.1, max: 1.0, step: 0.05, value: c,
      onInput: (v) => { c = v; draw(); },
      fmt: (v) => U.fmt(parseFloat(v), 2)
    });

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const padL = 80, padR = 26, padT = 28, padB = 50;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const crit = sigma_e2 * (c + Math.sqrt(c));

      // compute signals
      const data = factors.map(f => {
        const mu2 = (f.SR * f.SR) * f.sigma2; // μ² = SR² · σ²
        return {
          name: f.name,
          variance: f.sigma2,
          mean: (1 + gamma) * mu2,
          total: f.sigma2 + (1 + gamma) * mu2,
          mu2_raw: mu2
        };
      });

      // log-scale y to show wide range
      // y range: from 0 to max signal
      const yMax = Math.max(...data.map(d => d.total), crit) * 1.15;
      const yMin = 0;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      // grid
      U.drawHGrid(ctx, w, h, padL, padR, padT, padB, 5);
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const y = padT + innerH * i / 5;
        const v = yMax - (yMax - yMin) * i / 5;
        ctx.fillText(U.fmt(v, 2), padL - 8, y);
      }

      // axes
      U.drawAxes(ctx, w, h, padL, padR, padT, padB);

      // critical line
      ctx.strokeStyle = U.bad();
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, yToPix(crit));
      ctx.lineTo(w - padR, yToPix(crit));
      ctx.stroke();
      ctx.setLineDash([]);
      U.text(ctx, `θ_crit = ${crit.toFixed(2)}`, w - padR - 6, yToPix(crit) - 6,
             { color: U.bad(), size: 11, align: 'right', bold: true });

      // bars
      const bn = data.length;
      const barW = innerW / bn * 0.55;
      const slot  = innerW / bn;
      for (let i = 0; i < bn; i++) {
        const cx = padL + slot * (i + 0.5);
        const x = cx - barW / 2;
        const d = data[i];

        // bottom: variance (blue/info)
        const yVarTop = yToPix(d.variance);
        const yBase = yToPix(0);
        ctx.fillStyle = U.info();
        ctx.fillRect(x, yVarTop, barW, yBase - yVarTop);

        // top: mean signal (accent)
        const yMeanTop = yToPix(d.total);
        if (d.mean > 0) {
          ctx.fillStyle = U.accent();
          ctx.fillRect(x, yMeanTop, barW, yVarTop - yMeanTop);
        }

        // total value text
        U.text(ctx, U.fmt(d.total, 2), cx, yMeanTop - 6,
               { color: U.text(), size: 11, align: 'center', bold: true });

        // x labels
        ctx.fillStyle = U.text();
        ctx.font = '600 11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(d.name, cx, h - padB + 8);
        ctx.fillStyle = U.textMuted();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.fillText(`σ²=${d.variance}, μ²=${d.mu2_raw.toFixed(3)}`, cx, h - padB + 24);

        // detection mark
        const detected = d.total > crit;
        ctx.fillStyle = detected ? U.good() : U.textMuted();
        ctx.beginPath();
        ctx.arc(cx, padT + 4, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Legend
      const lx = padL, ly = padT - 14;
      ctx.fillStyle = U.info();
      ctx.fillRect(lx, ly, 10, 10);
      U.text(ctx, 'σ²_F (분산 신호)', lx + 16, ly + 9, { size: 11, color: U.textSecondary || U.text() });
      ctx.fillStyle = U.accent();
      ctx.fillRect(lx + 140, ly, 10, 10);
      U.text(ctx, '(1+γ)·μ²_F (평균 신호)', lx + 156, ly + 9, { size: 11, color: U.textSecondary || U.text() });
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
