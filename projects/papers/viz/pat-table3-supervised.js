/* viz: pat-table3-supervised
 * PatchTST (ICLR 2023) Table 3 — Multivariate supervised forecasting across 8 datasets × 4 horizons × 8 models.
 * paper exact values.
 */

(function () {
  const U = window.VIZ_UTIL;

  // dataset → horizon → { model: [MSE, MAE] }
  const T3 = {
    Weather: {
      96:  { 'PatchTST/64':[0.149,0.198], 'PatchTST/42':[0.152,0.199], DLinear:[0.176,0.237], FEDformer:[0.238,0.314], Autoformer:[0.249,0.329], Informer:[0.354,0.405], Pyraformer:[0.896,0.556], LogTrans:[0.458,0.490] },
      192: { 'PatchTST/64':[0.194,0.241], 'PatchTST/42':[0.197,0.243], DLinear:[0.220,0.282], FEDformer:[0.275,0.329], Autoformer:[0.325,0.370], Informer:[0.419,0.434], Pyraformer:[0.622,0.624], LogTrans:[0.658,0.589] },
      336: { 'PatchTST/64':[0.245,0.282], 'PatchTST/42':[0.249,0.283], DLinear:[0.265,0.319], FEDformer:[0.339,0.377], Autoformer:[0.351,0.391], Informer:[0.583,0.543], Pyraformer:[0.739,0.753], LogTrans:[0.797,0.652] },
      720: { 'PatchTST/64':[0.314,0.334], 'PatchTST/42':[0.320,0.335], DLinear:[0.323,0.362], FEDformer:[0.389,0.409], Autoformer:[0.415,0.426], Informer:[0.916,0.705], Pyraformer:[1.004,0.934], LogTrans:[0.869,0.675] }
    },
    Traffic: {
      96:  { 'PatchTST/64':[0.360,0.249], 'PatchTST/42':[0.367,0.251], DLinear:[0.410,0.282], FEDformer:[0.576,0.359], Autoformer:[0.597,0.371], Informer:[0.733,0.410], Pyraformer:[2.085,0.468], LogTrans:[0.684,0.384] },
      192: { 'PatchTST/64':[0.379,0.256], 'PatchTST/42':[0.385,0.259], DLinear:[0.423,0.287], FEDformer:[0.610,0.380], Autoformer:[0.607,0.382], Informer:[0.777,0.435], Pyraformer:[0.867,0.467], LogTrans:[0.685,0.390] },
      336: { 'PatchTST/64':[0.392,0.264], 'PatchTST/42':[0.398,0.265], DLinear:[0.436,0.296], FEDformer:[0.608,0.375], Autoformer:[0.623,0.387], Informer:[0.776,0.434], Pyraformer:[0.869,0.469], LogTrans:[0.734,0.408] },
      720: { 'PatchTST/64':[0.432,0.286], 'PatchTST/42':[0.434,0.287], DLinear:[0.466,0.315], FEDformer:[0.621,0.375], Autoformer:[0.639,0.395], Informer:[0.827,0.466], Pyraformer:[0.881,0.473], LogTrans:[0.717,0.396] }
    },
    Electricity: {
      96:  { 'PatchTST/64':[0.129,0.222], 'PatchTST/42':[0.130,0.222], DLinear:[0.140,0.237], FEDformer:[0.186,0.302], Autoformer:[0.196,0.313], Informer:[0.304,0.393], Pyraformer:[0.386,0.449], LogTrans:[0.258,0.357] },
      192: { 'PatchTST/64':[0.147,0.240], 'PatchTST/42':[0.148,0.240], DLinear:[0.153,0.249], FEDformer:[0.197,0.311], Autoformer:[0.211,0.324], Informer:[0.327,0.417], Pyraformer:[0.386,0.443], LogTrans:[0.266,0.368] },
      336: { 'PatchTST/64':[0.163,0.259], 'PatchTST/42':[0.167,0.261], DLinear:[0.169,0.267], FEDformer:[0.213,0.328], Autoformer:[0.214,0.327], Informer:[0.333,0.422], Pyraformer:[0.378,0.443], LogTrans:[0.280,0.380] },
      720: { 'PatchTST/64':[0.197,0.290], 'PatchTST/42':[0.202,0.291], DLinear:[0.203,0.301], FEDformer:[0.233,0.344], Autoformer:[0.236,0.342], Informer:[0.351,0.427], Pyraformer:[0.376,0.445], LogTrans:[0.283,0.376] }
    },
    ILI: {
      24: { 'PatchTST/64':[1.319,0.754], 'PatchTST/42':[1.522,0.814], DLinear:[2.215,1.081], FEDformer:[2.624,1.095], Autoformer:[2.906,1.182], Informer:[4.657,1.449], Pyraformer:[1.420,2.012], LogTrans:[4.480,1.444] },
      36: { 'PatchTST/64':[1.579,0.870], 'PatchTST/42':[1.430,0.834], DLinear:[1.963,0.963], FEDformer:[2.516,1.021], Autoformer:[2.585,1.038], Informer:[4.650,1.463], Pyraformer:[7.394,2.031], LogTrans:[4.799,1.467] },
      48: { 'PatchTST/64':[1.553,0.815], 'PatchTST/42':[1.673,0.854], DLinear:[2.130,1.024], FEDformer:[2.505,1.041], Autoformer:[3.024,1.145], Informer:[5.004,1.542], Pyraformer:[7.551,2.057], LogTrans:[4.800,1.468] },
      60: { 'PatchTST/64':[1.470,0.788], 'PatchTST/42':[1.529,0.862], DLinear:[2.368,1.096], FEDformer:[2.742,1.122], Autoformer:[2.761,1.114], Informer:[5.071,1.543], Pyraformer:[7.662,2.100], LogTrans:[5.278,1.560] }
    },
    ETTh1: {
      96:  { 'PatchTST/64':[0.370,0.400], 'PatchTST/42':[0.375,0.399], DLinear:[0.375,0.399], FEDformer:[0.376,0.415], Autoformer:[0.435,0.446], Informer:[0.941,0.769], Pyraformer:[0.664,0.612], LogTrans:[0.878,0.740] },
      192: { 'PatchTST/64':[0.413,0.429], 'PatchTST/42':[0.414,0.421], DLinear:[0.405,0.416], FEDformer:[0.423,0.446], Autoformer:[0.456,0.457], Informer:[1.007,0.786], Pyraformer:[0.790,0.681], LogTrans:[1.037,0.824] },
      336: { 'PatchTST/64':[0.422,0.440], 'PatchTST/42':[0.431,0.436], DLinear:[0.439,0.443], FEDformer:[0.444,0.462], Autoformer:[0.486,0.487], Informer:[1.038,0.784], Pyraformer:[0.891,0.738], LogTrans:[1.238,0.932] },
      720: { 'PatchTST/64':[0.447,0.468], 'PatchTST/42':[0.449,0.466], DLinear:[0.472,0.490], FEDformer:[0.469,0.492], Autoformer:[0.515,0.517], Informer:[1.144,0.857], Pyraformer:[0.963,0.782], LogTrans:[1.135,0.852] }
    },
    ETTh2: {
      96:  { 'PatchTST/64':[0.274,0.337], 'PatchTST/42':[0.274,0.336], DLinear:[0.289,0.353], FEDformer:[0.332,0.374], Autoformer:[0.332,0.368], Informer:[1.549,0.952], Pyraformer:[0.645,0.597], LogTrans:[2.116,1.197] },
      192: { 'PatchTST/64':[0.341,0.382], 'PatchTST/42':[0.339,0.379], DLinear:[0.383,0.418], FEDformer:[0.407,0.446], Autoformer:[0.426,0.434], Informer:[3.792,1.542], Pyraformer:[0.788,0.683], LogTrans:[4.315,1.635] },
      336: { 'PatchTST/64':[0.329,0.384], 'PatchTST/42':[0.331,0.380], DLinear:[0.448,0.465], FEDformer:[0.400,0.447], Autoformer:[0.477,0.479], Informer:[4.215,1.642], Pyraformer:[0.907,0.747], LogTrans:[1.124,1.604] },
      720: { 'PatchTST/64':[0.379,0.422], 'PatchTST/42':[0.379,0.422], DLinear:[0.605,0.551], FEDformer:[0.412,0.469], Autoformer:[0.453,0.490], Informer:[3.656,1.619], Pyraformer:[0.963,0.783], LogTrans:[3.188,1.540] }
    },
    ETTm1: {
      96:  { 'PatchTST/64':[0.293,0.346], 'PatchTST/42':[0.290,0.342], DLinear:[0.299,0.343], FEDformer:[0.326,0.390], Autoformer:[0.510,0.492], Informer:[0.626,0.560], Pyraformer:[0.543,0.510], LogTrans:[0.600,0.546] },
      192: { 'PatchTST/64':[0.333,0.370], 'PatchTST/42':[0.332,0.369], DLinear:[0.335,0.365], FEDformer:[0.365,0.415], Autoformer:[0.514,0.495], Informer:[0.725,0.619], Pyraformer:[0.557,0.537], LogTrans:[0.837,0.700] },
      336: { 'PatchTST/64':[0.369,0.392], 'PatchTST/42':[0.366,0.392], DLinear:[0.369,0.386], FEDformer:[0.392,0.425], Autoformer:[0.510,0.492], Informer:[1.005,0.741], Pyraformer:[0.754,0.655], LogTrans:[1.124,0.832] },
      720: { 'PatchTST/64':[0.416,0.420], 'PatchTST/42':[0.420,0.424], DLinear:[0.425,0.421], FEDformer:[0.446,0.458], Autoformer:[0.527,0.493], Informer:[1.133,0.845], Pyraformer:[0.908,0.724], LogTrans:[1.153,0.820] }
    },
    ETTm2: {
      96:  { 'PatchTST/64':[0.166,0.256], 'PatchTST/42':[0.165,0.255], DLinear:[0.167,0.260], FEDformer:[0.180,0.271], Autoformer:[0.205,0.293], Informer:[0.355,0.462], Pyraformer:[0.435,0.507], LogTrans:[0.768,0.642] },
      192: { 'PatchTST/64':[0.223,0.296], 'PatchTST/42':[0.220,0.292], DLinear:[0.224,0.303], FEDformer:[0.252,0.318], Autoformer:[0.278,0.336], Informer:[0.595,0.586], Pyraformer:[0.730,0.673], LogTrans:[0.989,0.757] },
      336: { 'PatchTST/64':[0.274,0.329], 'PatchTST/42':[0.278,0.329], DLinear:[0.281,0.342], FEDformer:[0.324,0.364], Autoformer:[0.343,0.379], Informer:[1.270,0.871], Pyraformer:[1.201,0.845], LogTrans:[1.334,0.872] },
      720: { 'PatchTST/64':[0.362,0.385], 'PatchTST/42':[0.367,0.385], DLinear:[0.397,0.421], FEDformer:[0.410,0.420], Autoformer:[0.414,0.419], Informer:[3.001,1.267], Pyraformer:[3.625,1.451], LogTrans:[3.048,1.328] }
    }
  };

  const MODELS = ['PatchTST/64','PatchTST/42','DLinear','FEDformer','Autoformer','Informer','Pyraformer','LogTrans'];
  const COLORS = {
    'PatchTST/64':'#ef4444', 'PatchTST/42':'#f97316',
    DLinear:'#fbbf24',
    FEDformer:'#a78bfa', Autoformer:'#60a5fa', Informer:'#22d3ee',
    Pyraformer:'#84cc16', LogTrans:'#94a3b8'
  };
  const ETT_HORIZONS = [96, 192, 336, 720];
  const ILI_HORIZONS = [24, 36, 48, 60];

  VIZ_REGISTRY['pat-table3-supervised'] = function (canvas, controls, params) {
    let dataset = params.dataset || 'Weather';
    let horizon = params.horizon || (dataset === 'ILI' ? 24 : 96);
    let metric  = params.metric || 'MSE';

    function makeToggle(label, items, current, onSelect) {
      const wb = document.createElement('label');
      const lb = document.createElement('span'); lb.textContent = label;
      wb.appendChild(lb);
      items.forEach(it => {
        const btn = document.createElement('button');
        btn.textContent = String(it);
        btn.style.cssText = 'margin-left:6px;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);cursor:pointer;font-family:inherit;font-size:0.82rem;';
        if (it === current) { btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent(); }
        btn.addEventListener('click', () => {
          wb.querySelectorAll('button').forEach(x => { x.style.background='var(--surface)'; x.style.color='var(--text-secondary)'; x.style.borderColor='var(--border)'; });
          btn.style.background = U.accent(); btn.style.color = '#fff'; btn.style.borderColor = U.accent();
          onSelect(it);
        });
        wb.appendChild(btn);
      });
      controls.appendChild(wb);
      return wb;
    }

    let datasetToggle, horizonToggle, metricToggle;
    function rebuildToggles() {
      controls.innerHTML = '';
      datasetToggle = makeToggle('Dataset', Object.keys(T3), dataset, d => { dataset = d; horizon = (d === 'ILI') ? 24 : 96; rebuildToggles(); draw(); });
      horizonToggle = makeToggle('Horizon T', dataset === 'ILI' ? ILI_HORIZONS : ETT_HORIZONS, horizon, h => { horizon = h; draw(); });
      metricToggle  = makeToggle('Metric', ['MSE', 'MAE'], metric, m => { metric = m; draw(); });
    }
    rebuildToggles();

    function draw() {
      const { ctx, w, h } = U.setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const padL = 64, padR = 28, padT = 38, padB = 100;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const row = T3[dataset][horizon];
      const idx = metric === 'MSE' ? 0 : 1;
      const vals = MODELS.map(m => row[m] ? row[m][idx] : null);
      const valid = vals.filter(v => v !== null);
      const yMin = 0;
      const yMax = Math.max(...valid) * 1.15;
      const yToPix = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * innerH;

      // Grid
      ctx.strokeStyle = U.cssVar('--border', '#e5e7eb');
      ctx.lineWidth = 1;
      const ySteps = 5;
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        const yp = yToPix(yv);
        ctx.beginPath(); ctx.moveTo(padL, yp); ctx.lineTo(w-padR, yp);
        ctx.globalAlpha = (i === 0) ? 0.8 : 0.3; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = U.textMuted();
      ctx.font = '11px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= ySteps; i++) {
        const yv = yMin + (yMax - yMin) * i / ySteps;
        ctx.fillText(yv.toFixed(2), padL - 8, yToPix(yv));
      }

      ctx.save();
      ctx.translate(14, h/2); ctx.rotate(-Math.PI/2);
      ctx.fillStyle = U.text();
      ctx.font = '600 12px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center';
      ctx.fillText(metric + ' (lower = better)', 0, 0);
      ctx.restore();

      ctx.fillStyle = U.text();
      ctx.font = '600 13px ' + U.cssVar('--font-display', 'Inter, sans-serif');
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`paper Table 3 · ${dataset} · T=${horizon} · ${metric}`, w/2, padT - 24);

      const groupW = innerW / MODELS.length;
      const barW = groupW * 0.55;
      const minVal = Math.min(...valid);
      MODELS.forEach((m, mi) => {
        const cx = padL + groupW * (mi + 0.5);
        const v = row[m] ? row[m][idx] : null;
        if (v === null) {
          ctx.fillStyle = U.textMuted();
          ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('—', cx, yToPix(yMax / 2));
        } else {
          const top = yToPix(v);
          const barH = (h - padB) - top;
          ctx.fillStyle = COLORS[m];
          ctx.globalAlpha = (Math.abs(v - minVal) < 1e-9) ? 1.0 : 0.78;
          ctx.fillRect(cx - barW/2, top, barW, barH);
          ctx.globalAlpha = 1;
          ctx.fillStyle = U.text();
          ctx.font = '600 10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(v.toFixed(3), cx, top - 8);
        }
        ctx.fillStyle = U.text();
        ctx.font = '10px ' + U.cssVar('--font-display', 'Inter, sans-serif');
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.save();
        ctx.translate(cx, h - padB + 8);
        ctx.rotate(Math.PI / 6);
        ctx.fillText(m, 0, 0);
        ctx.restore();
      });

      ctx.strokeStyle = U.cssVar('--text-muted', '#6b7280');
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, h-padB); ctx.lineTo(w-padR, h-padB);
      ctx.stroke();
    }

    draw();
    window.addEventListener('resize', () => draw(), { passive: true });
  };
})();
