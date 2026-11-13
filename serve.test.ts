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

test('data JSON files are valid JSON arrays and all news articles have valid URLs, summaries, images, and sitemap entries', () => {
  const newsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'news.json'), 'utf8'));
  const vacanciesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'vacancies.json'), 'utf8'));
  const sitemapXml = fs.readFileSync(path.join(process.cwd(), 'sitemap.xml'), 'utf8');
  assert.ok(Array.isArray(newsData));
  assert.ok(Array.isArray(vacanciesData));

  for (const item of newsData) {
    assert.ok(!item.id.includes(' '), `News id "${item.id}" must not contain spaces`);
    assert.ok(!item.url.includes(' '), `News url "${item.url}" must not contain spaces`);
    assert.ok(item.summary && item.summary.trim().length > 10, `News "${item.id}" must have a summary`);
    assert.ok(item.leadSummary && item.leadSummary.trim().length > 10, `News "${item.id}" must have a leadSummary`);
    assert.ok(fs.existsSync(path.join(process.cwd(), item.image)), `Image "${item.image}" for "${item.id}" must exist`);
    assert.ok(sitemapXml.includes(`news-detail.html?id=${item.id}`), `News "${item.id}" must be in sitemap.xml`);
  }

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

test('All indexable HTML pages have unique titles/descriptions, valid sitemap entries, and required AdSense policy pages', () => {
  const requiredPolicies = [
    'about-us.html', 'contact-us.html', 'privacy-policy.html',
    'disclaimer.html', 'terms-and-conditions.html',
    'editorial-policy.html', 'fact-verification-policy.html', 'content-ownership-policy.html'
  ];
  for (const policy of requiredPolicies) {
    assert.ok(fs.existsSync(path.join(process.cwd(), policy)), `Policy page ${policy} must exist`);
  }

  const sitemapXml = fs.readFileSync(path.join(process.cwd(), 'sitemap.xml'), 'utf8');
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  for (const u of sitemapUrls) {
    const rel = u.replace('https://aapkaresult.in/', '').split('?')[0];
    if (rel) {
      assert.ok(fs.existsSync(path.join(process.cwd(), rel)), `Sitemap target ${rel} must exist`);
    }
  }

  const htmlFiles = fs.readdirSync(process.cwd()).filter(
    f => f.endsWith('.html') && f !== 'admin.html' && f !== 'templete.html' && !f.startsWith('google')
  );
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    const isNoindex = /name="robots"[^>]*noindex/i.test(html);
    const expectedUrl = file === 'index.html' ? 'https://aapkaresult.in/' : `https://aapkaresult.in/${file}`;

    if (isNoindex) {
      assert.ok(!sitemapUrls.includes(expectedUrl), `Noindex page ${file} should not be in sitemap.xml`);
      continue;
    }
    if (file === '404.html' || file === 'news-detail.html') continue;

    assert.ok(sitemapUrls.includes(expectedUrl), `Indexable page ${file} must be in sitemap.xml`);
    assert.ok(/<h1[\s>]/i.test(html), `${file} must have an <h1> heading`);
    assert.ok(html.includes('privacy-policy.html'), `${file} footer must link to privacy-policy.html`);
    assert.ok(/property=["']og:title["']/i.test(html), `${file} must have og:title`);
    assert.ok(/property=["']og:description["']/i.test(html), `${file} must have og:description`);
    assert.ok(html.includes(`href="${expectedUrl}"`), `${file} must have matching canonical URL ${expectedUrl}`);
    assert.ok(!html.includes('${1}'), `${file} must not contain stray replacement tokens`);
    assert.ok(html.includes('sizes="384x384"'), `${file} must declare sizes="384x384" for favicon.png`);
    assert.ok(!/href=["']http:\/\//i.test(html), `${file} must not contain insecure http:// links`);
    assert.ok(!/href=["']#["']/i.test(html), `${file} must not contain empty href="#" links`);

    const visibleText = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = visibleText.split(' ').filter(Boolean).length;
    assert.ok(wordCount >= 350, `Indexable page ${file} must have >= 350 words (found ${wordCount})`);

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    assert.ok(titleMatch && titleMatch[1].trim().length > 5, `${file} must have a valid <title>`);
    assert.ok(!titles.has(titleMatch[1].trim()), `Duplicate <title> found in ${file}`);
    titles.add(titleMatch[1].trim());

    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    assert.ok(descMatch && descMatch[1].trim().length > 20, `${file} must have a meta description`);
    assert.ok(!descriptions.has(descMatch[1].trim()), `Duplicate meta description found in ${file}`);
    descriptions.add(descMatch[1].trim());
  }
});

test('admin.html does not expose hardcoded GitHub tokens and remains noindex', () => {
  const adminHtml = fs.readFileSync(path.join(process.cwd(), 'admin.html'), 'utf8');
  assert.ok(/name="robots"[^>]*noindex/i.test(adminHtml), 'admin.html must have noindex meta tag');
  assert.ok(!adminHtml.includes('ghp_'), 'admin.html must not contain hardcoded ghp_ tokens');
  assert.ok(!adminHtml.includes('github_pat_'), 'admin.html must not contain hardcoded github_pat_ tokens');
  assert.ok(!adminHtml.includes('[103, 104, 112'), 'admin.html must not contain obfuscated token arrays');
  assert.ok(adminHtml.includes('function clearPatSetting()'), 'admin.html should provide clearPatSetting');
  assert.ok(adminHtml.includes('mobile-bottom-nav'), 'admin.html should provide mobile bottom navigation');
  assert.ok(adminHtml.includes('function saveNewsDraft()'), 'admin.html should support auto-draft saving');
  assert.ok(adminHtml.includes('function editVacancy('), 'admin.html should support editing vacancies');
  assert.ok(adminHtml.includes('function copySharePost('), 'admin.html should support WhatsApp/Telegram share text copy');
  assert.ok(adminHtml.includes('function downloadJsonBackup('), 'admin.html should support JSON backup download');
});

