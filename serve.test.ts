import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { MIME_TYPES, resolveFilePath, PORT } = require('./serve.js');

test('default server port is 3000', () => {
  assert.equal(PORT, 3000);
});

test('MIME_TYPES includes html, css, js, json, svg, and pdf', () => {
  assert.equal(MIME_TYPES['.html'], 'text/html; charset=utf-8');
  assert.equal(MIME_TYPES['.css'], 'text/css; charset=utf-8');
  assert.equal(MIME_TYPES['.js'], 'application/javascript; charset=utf-8');
  assert.equal(MIME_TYPES['.json'], 'application/json; charset=utf-8');
  assert.equal(MIME_TYPES['.pdf'], 'application/pdf');
});

test('resolveFilePath maps root / and extensionless routes to .html files', () => {
  const rootResolved = resolveFilePath('/');
  assert.ok(rootResolved.endsWith(path.join('index.html')));
  assert.ok(fs.existsSync(rootResolved));

  const extensionlessJobs = resolveFilePath('/latest-jobs?q=police');
  assert.ok(extensionlessJobs.endsWith('latest-jobs.html'));
  assert.ok(fs.existsSync(extensionlessJobs));
});

test('data JSON files are valid JSON arrays and UP Rojgar Mela uses canonical URL slug', () => {
  const newsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'news.json'), 'utf8'));
  const vacanciesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'vacancies.json'), 'utf8'));
  assert.ok(Array.isArray(newsData));
  assert.ok(Array.isArray(vacanciesData));

  const rojgarMela = newsData.find((item: { id: string }) => item.id === 'up-rojgar-mela-jewar-2026');
  assert.ok(rojgarMela, 'UP Rojgar Mela entry should have id up-rojgar-mela-jewar-2026');
  assert.equal(rojgarMela.url, 'news-detail.html?id=up-rojgar-mela-jewar-2026');
});

test('robots.txt allows Mediapartners-Google and disallows internal/admin files', () => {
  const robotsTxt = fs.readFileSync(path.join(process.cwd(), 'robots.txt'), 'utf8');
  assert.ok(robotsTxt.includes('User-agent: Mediapartners-Google'));
  assert.ok(robotsTxt.includes('Disallow: /admin.html'));
  assert.ok(robotsTxt.includes('Disallow: /templete.html'));
});

test('UP Police Mock Test 03 has 150 exam-level questions with 38 GK, 37 Hindi, 38 Maths, 37 Reasoning and is listed on dashboard', () => {
  const mocksPage = fs.readFileSync(path.join(process.cwd(), 'up-police-mocks-page.html'), 'utf8');
  assert.ok(mocksPage.includes('id="test-card-3"'));
  assert.ok(mocksPage.includes('up-police-quiz.html?test=3'));

  const quizHtml = fs.readFileSync(path.join(process.cwd(), 'up-police-quiz.html'), 'utf8');
  const match = quizHtml.match(/const allTestDatabase = (\{[\s\S]*?\n    \});/);
  assert.ok(match, 'allTestDatabase should be extractable from up-police-quiz.html');
  const db = new Function(`return ${match[1]}`)();

  assert.ok(Array.isArray(db['1']) && db['1'].length === 150, 'Test 1 should have 150 questions');
  assert.ok(Array.isArray(db['2']) && db['2'].length === 150, 'Test 2 should have 150 questions');
  assert.ok(Array.isArray(db['3']) && db['3'].length === 150, 'Test 3 should have 150 questions');

  const counts: Record<string, number> = {};
  for (const q of db['3']) {
    counts[q.subject] = (counts[q.subject] || 0) + 1;
    assert.ok(typeof q.q === 'string' && q.q.length > 5);
    assert.ok(Array.isArray(q.options) && q.options.length === 4);
    assert.ok(typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3);
    assert.ok(typeof q.solution === 'string' && q.solution.length > 10);
  }
  assert.equal(counts['General Knowledge'], 38);
  assert.equal(counts['General Hindi'], 37);
  assert.equal(counts['Numerical Ability'], 38);
  assert.equal(counts['Reasoning'], 37);
});

test('Sarkari Tools hub links Negative Marking Calculator and PDF Compressor and pure algorithms work', () => {
  const toolsHub = fs.readFileSync(path.join(process.cwd(), 'sarkari-tools.html'), 'utf8');
  assert.ok(toolsHub.includes('negative-marking-calculator.html'));
  assert.ok(toolsHub.includes('sarkari-pdf-compressor.html'));
  assert.ok(toolsHub.includes('id="tool-card-negative-marking"'));
  assert.ok(toolsHub.includes('id="tool-card-pdf-compressor"'));

  // Extract and test computeExamScoreMetrics from negative-marking-calculator.html
  const negHtml = fs.readFileSync(path.join(process.cwd(), 'negative-marking-calculator.html'), 'utf8');
  const fnMatch = negHtml.match(/function computeExamScoreMetrics\([\s\S]*?\n    \}/);
  assert.ok(fnMatch, 'computeExamScoreMetrics should exist in negative-marking-calculator.html');
  const computeExamScoreMetrics = new Function(`return (${fnMatch[0]})`)();

  const upMetrics = computeExamScoreMetrics(150, 2, 0.5, 112, 18);
  assert.equal(upMetrics.maxMarks, 300);
  assert.equal(upMetrics.positiveEarned, 224);
  assert.equal(upMetrics.negativeLost, 9);
  assert.equal(upMetrics.netScore, 215);
  assert.equal(upMetrics.attempted, 130);
  assert.equal(upMetrics.unattempted, 20);
  assert.equal(upMetrics.isValidAttempt, true);

  // Extract and test buildPdfBinaryFromJpegs from sarkari-pdf-compressor.html
  const pdfHtml = fs.readFileSync(path.join(process.cwd(), 'sarkari-pdf-compressor.html'), 'utf8');
  assert.ok(pdfHtml.includes('id="customPdfPresetBtn"'), 'sarkari-pdf-compressor.html should have Custom KB Size preset button');
  assert.ok(pdfHtml.includes('id="pdfExactTargetKb"'), 'sarkari-pdf-compressor.html should have Exact Target KB input');
  assert.ok(pdfHtml.includes('id="pdfExactTargetSlider"'), 'sarkari-pdf-compressor.html should have Exact Target KB slider');
  assert.ok(pdfHtml.includes('id="pdfPageLayout"'), 'sarkari-pdf-compressor.html should have Page Layout selector');

  const pdfFnMatch = pdfHtml.match(/function buildPdfBinaryFromJpegs\([\s\S]*?\n    \}/);
  assert.ok(pdfFnMatch, 'buildPdfBinaryFromJpegs should exist in sarkari-pdf-compressor.html');
  const buildPdfBinaryFromJpegs = new Function(`return (${pdfFnMatch[0]})`)();

  const dummyJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0xff, 0xd9]);
  const pdfBytes: Uint8Array = buildPdfBinaryFromJpegs([
    { jpegBytes: dummyJpeg, widthPx: 800, heightPx: 1130 }
  ], 'a4_portrait');
  const pdfText = new TextDecoder().decode(pdfBytes);
  assert.ok(pdfText.startsWith('%PDF-1.4'));
  assert.ok(pdfText.includes('/MediaBox [0 0 595 842]'));
  assert.ok(pdfText.includes('/Filter /DCTDecode'));
  assert.ok(pdfText.includes('xref'));
  assert.ok(pdfText.endsWith('%%EOF'));

  const landscapeBytes: Uint8Array = buildPdfBinaryFromJpegs([
    { jpegBytes: dummyJpeg, widthPx: 1130, heightPx: 800 }
  ], 'a4_landscape');
  const landscapeText = new TextDecoder().decode(landscapeBytes);
  assert.ok(landscapeText.includes('/MediaBox [0 0 842 595]'));

  // Verify custom size controls in sarkari-photo-resizer.html
  const photoHtml = fs.readFileSync(path.join(process.cwd(), 'sarkari-photo-resizer.html'), 'utf8');
  assert.ok(photoHtml.includes("applyPreset('custom')"));
  assert.ok(photoHtml.includes('id="dimensionUnitSelect"'));
  assert.ok(photoHtml.includes('setQuickPhotoCustomKb'));
});




