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

