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
        if (!path) return; // пользователь отменил выбор
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
    const opTable = tableHTML('ОПЕРАТОРЫ', res.operators);
    const odTable = tableHTML('ОПЕРАНДЫ', res.operands);
    const m = res.metrics;

    $result.innerHTML = `
    ${opTable}
    ${odTable}
    <h2>МЕТРИКИ ХОЛСТЕДА</h2>
    <div class="metrics">
      <div><span>n1 (уник. операторы)</span><b>${m.nu1}</b></div>
      <div><span>n2 (уник. операнды)</span><b>${m.nu2}</b></div>
      <div><span>N1 (всего операторов)</span><b>${m.n1}</b></div>
      <div><span>N2 (всего операндов)</span><b>${m.n2}</b></div>
      <div><span>n (словарь)</span><b>${m.nu}</b></div>
      <div><span>N (длина)</span><b>${m.N}</b></div>
      <div><span>V (объём)</span><b>${m.V.toFixed(2)}</b></div>
      <div><span>D (сложность)</span><b>${m.D.toFixed(2)}</b></div>
      <div><span>E (усилие)</span><b>${m.E.toFixed(2)}</b></div>
      <div><span>B (ошибки)</span><b>${m.B.toFixed(3)}</b></div>
      <div><span>T (время, сек)</span><b>${m.T.toFixed(2)}</b></div>
    </div>
  `;
}

function tableHTML(title, entries) {
    if (!entries || entries.length === 0) return '';
    const rows = entries.map((e, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(e.name)}</td><td class="num">${e.count}</td></tr>`
    ).join('');
    return `
    <h2>${title}</h2>
    <table>
      <thead><tr><th>№</th><th>Обозначение</th><th>Количество</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}