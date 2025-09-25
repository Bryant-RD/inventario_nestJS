// artillery/scripts/generate-html-report.js
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const resultsDir = path.join(__dirname, "../results");
const reportsDir = path.join(__dirname, "../reports");

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

const files = fs.readdirSync(resultsDir).filter(f => f.endsWith(".json"));
if (files.length === 0) {
  console.error("No se encontraron archivos de resultados en 'results'.");
  process.exit(1);
}

const lastResult = files.sort(
  (a, b) =>
    fs.statSync(path.join(resultsDir, b)).mtime -
    fs.statSync(path.join(resultsDir, a)).mtime
)[0];

const resultPath = path.join(resultsDir, lastResult);
const outputPath = path.join(reportsDir, lastResult.replace(".json", ".html"));

console.log(`📊 Generando reporte en HTML a partir de: ${resultPath}`);

try {
  // Llamamos al CLI del plugin
  execSync(
    `npx artillery-plugin-html-report ${resultPath} -o ${outputPath}`,
    { stdio: "inherit" }
  );

  console.log(`✅ Reporte HTML generado en: ${outputPath}`);
} catch (err) {
  console.error("❌ Error ejecutando el generador de reportes:", err.message);
  process.exit(1);
}
