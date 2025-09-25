// artillery/scripts/generate-html-report.js
import { existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import open from "open";

// Helper para obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resultsDir = join(__dirname, "../results");
const reportsDir = join(__dirname, "../reports");

(async () => {
if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true });

const files = readdirSync(resultsDir).filter(f => f.endsWith(".json"));
if (files.length === 0) {
  console.error("No se encontraron archivos de resultados en 'results'.");
  process.exit(1);
}

const lastResult = files.sort(
  (a, b) =>
    statSync(join(resultsDir, b)).mtime -
    statSync(join(resultsDir, a)).mtime
)[0];

const resultPath = join(resultsDir, lastResult);
const outputPath = join(reportsDir, lastResult.replace(".json", ".html"));

console.log(`📊 Generando reporte HTML a partir de: ${resultPath}`);

try {
  const data = JSON.parse(readFileSync(resultPath, "utf-8"));

  // Métricas agregadas
  const aggregate = data.aggregate || {};
  const requestsCompleted = aggregate.requestsCompleted || 0;
  const scenariosCreated = aggregate.scenariosCreated || 0;
  const scenariosCompleted = aggregate.scenariosCompleted || 0;
  const latency = aggregate.latency || {};
  const codes = aggregate.codes || {};
  const errors = aggregate.errors || {};

  // Extraer percentiles
  const p95 = latency.p95 || 0;
  const p99 = latency.p99 || 0;
  const minLatency = latency.min || 0;
  const maxLatency = latency.max || 0;
  const meanLatency = latency.mean || 0;

  // Requests por segundo (si existe)
  const rps = data.intermediate?.map(point => ({
    timestamp: point.timestamp,
    rps: point.rps,
    latency: point.latency?.mean || 0 // Usamos optional chaining y un valor por defecto
  })) || [];

  // HTML avanzado
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte Stress Test</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  body { font-family: Arial; margin: 20px; }
  h1, h2 { text-align: center; }
  .card { background: #f9f9f9; padding: 20px; margin: 10px 0; border-radius: 10px; }
  canvas { max-width: 800px; margin: 20px auto; display: block; }
  pre { background: #eee; padding: 10px; border-radius: 5px; overflow-x: auto; }
</style>
</head>
<body>
<h1>Stress Test Report</h1>

<div class="card">
<h2>Resumen General</h2>
<p><strong>Escenarios creados:</strong> ${scenariosCreated}</p>
<p><strong>Escenarios completados:</strong> ${scenariosCompleted}</p>
<p><strong>Requests completados:</strong> ${requestsCompleted}</p>
<p><strong>Latencia (ms):</strong> min ${minLatency}, max ${maxLatency}, mean ${meanLatency}, p95 ${p95}, p99 ${p99}</p>
</div>

<div class="card">
<h2>Distribución de Status Codes</h2>
<canvas id="codesChart"></canvas>
</div>

<div class="card">
<h2>Errores</h2>
<pre>${JSON.stringify(errors, null, 2)}</pre>
</div>

<div class="card">
<h2>Requests por Segundo & Latencia</h2>
<canvas id="rpsChart"></canvas>
</div>

<script>
const ctxCodes = document.getElementById('codesChart');
new Chart(ctxCodes, {
  type: 'pie',
  data: {
    labels: ${JSON.stringify(Object.keys(codes))},
    datasets: [{
      label: 'Status Codes',
      data: ${JSON.stringify(Object.values(codes))},
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
  }
});

const ctxRPS = document.getElementById('rpsChart');
new Chart(ctxRPS, {
  type: 'line',
  data: {
    labels: ${JSON.stringify(rps.map(r => new Date(r.timestamp).toLocaleTimeString()))},
    datasets: [
      {
        label: 'Requests por Segundo',
        data: ${JSON.stringify(rps.map(r => r.rps))},
        borderColor: 'blue',
        yAxisID: 'y1'
      },
      {
        label: 'Latencia Media (ms)',
        data: ${JSON.stringify(rps.map(r => r.latency))},
        borderColor: 'red',
        yAxisID: 'y2'
      }
    ]
  },
  options: {
    scales: {
      y1: { type: 'linear', position: 'left', title: { display: true, text: 'RPS' } },
      y2: { type: 'linear', position: 'right', title: { display: true, text: 'Latencia (ms)' } }
    }
  }
});
</script>
</body>
</html>
`;

  writeFileSync(outputPath, html, "utf-8");
  console.log(`✅ Reporte HTML generado en: ${outputPath}`);
  await open(outputPath);

} catch (err) {
  console.error("❌ Error generando reporte:", err.message);
  process.exit(1);
}}
)();
