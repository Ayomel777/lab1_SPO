import './style.css';
import { Analyze, ReadFile, SelectFile } from '../wailsjs/go/main/App';

const app = document.getElementById('app');

app.innerHTML = `
  <h1>Ruby Halstead Analyzer</h1>
  <div class="layout">
    <div class="panel">
      <h2>Исходный код Ruby</h2>
      <textarea id="source" placeholder="Вставь сюда Ruby-код или открой файл .rb"></textarea>
      <div class="buttons">
        <button id="btn-analyze">Анализировать</button>
        <button id="btn-open">Открыть .rb</button>
      </div>
    </div>
    <div class="panel">
      <h2>Результат</h2>
      <div id="result" class="result"></div>
    </div>
  </div>
`;

const $source = document.getElementById('source');
const $result = document.getElementById('result');

document.getElementById('btn-analyze').addEventListener('click', runAnalysis);

document.getElementById('btn-open').addEventListener('click', async () => {
    try {
        const path = await SelectFile();
        if (!path) return;
        const content = await ReadFile(path);
        $source.value = content;
        runAnalysis();
    } catch (e) {
        $result.innerHTML = `<p style="color:#f87171">Ошибка открытия: ${e}</p>`;
    }
});

async function runAnalysis() {
    const src = $source.value;
    if (!src.trim()) {
        $result.innerHTML = '<p>Введите код.</p>';
        return;
    }
    try {
        const res = await Analyze(src);
        render(res);
    } catch (e) {
        $result.innerHTML = `<p style="color:#f87171">Ошибка: ${e}</p>`;
    }
}

function render(res) {
    const opTable = tableHTML('ОПЕРАТОРЫ', res.operators, 'Оператор', 'f1j');
    const odTable = tableHTML('ОПЕРАНДЫ', res.operands, 'Операнд', 'f2i');
    const m = res.metrics;

    $result.innerHTML = `
    ${opTable}
    ${odTable}
    <h2>БАЗОВЫЕ МЕТРИКИ ХОЛСТЕДА</h2>
    <div class="metrics">
      <div><span>Словарь программы n</span><b>${m.nu}</b></div>
      <div><span>Длина программы N</span><b>${m.N}</b></div>
      <div><span>Объём программы V</span><b>${m.V.toFixed(2)}</b></div>
    </div>
    <p style="font-size:12px;color:#71717a;margin-top:12px;line-height:1.6">
      n = n₁ + n₂ = ${m.nu1} + ${m.nu2} = ${m.nu}<br>
      N = N₁ + N₂ = ${m.n1} + ${m.n2} = ${m.N}<br>
      V = N · log₂(n) = ${m.N} · log₂(${m.nu}) ≈ ${m.V.toFixed(2)}
    </p>
  `;
}

function tableHTML(title, entries, colName, colFreq) {
    if (!entries || entries.length === 0) return '';
    const rows = entries.map((e, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(e.name)}</td><td class="num">${e.count}</td></tr>`
    ).join('');
    return `
    <h2>${title}</h2>
    <table>
      <thead><tr><th>j</th><th>${colName}</th><th>${colFreq}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}