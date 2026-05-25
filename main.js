function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("open");
}

const FEED_CONFIG = {
  refreshMs: 10 * 60 * 1000,
  cacheTtlMs: 15 * 60 * 1000,
  maxItemsPerFeed: 8,
  feeds: [
    { key: 'indiaNews', label: 'India News', url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml' },
    { key: 'educationNews', label: 'Education', url: 'https://www.thehindu.com/education/feeder/default.rss' },
    { key: 'jobsNews', label: 'Government Jobs', url: 'https://news.google.com/rss/search?q=india+government+jobs+exam&hl=en-IN&gl=IN&ceid=IN:en' },
    { key: 'resultsNews', label: 'Results & Admit Cards', url: 'https://news.google.com/rss/search?q=india+exam+result+admit+card&hl=en-IN&gl=IN&ceid=IN:en' }
  ]
};

function summarizeText(text, maxWords = 24) {
  const words = (text || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(' ');
  return words.slice(0, maxWords).join(' ') + (words.length > maxWords ? '…' : '');
}

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Updated recently';
  const mins = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
  if (mins < 60) return `Updated ${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `Updated ${hrs} hour${hrs > 1 ? 's' : ''} ago`;
}

function normalizeItem(item, sourceLabel) {
  return {
    title: (item.title || 'Untitled').trim(),
    link: item.link || '#',
    pubDate: item.pubDate || new Date().toISOString(),
    source: sourceLabel,
    summary: summarizeText(item.description || item.contentSnippet || item.title || '', 20)
  };
}

async function fetchRssFeed(feed) {
  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=${FEED_CONFIG.maxItemsPerFeed}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`RSS fetch failed for ${feed.key}`);
  const data = await res.json();
  return (data.items || []).map((item) => normalizeItem(item, data.feed?.title || feed.label));
}

function dedupeItems(items) {
  const seen = new Set();
  return items.filter((i) => {
    const key = `${i.title.toLowerCase()}|${i.link}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function saveFeedCache(payload) {
  localStorage.setItem('aapka_live_feed_cache_v2', JSON.stringify({ ts: Date.now(), payload }));
}

function loadFeedCache() {
  try {
    const raw = localStorage.getItem('aapka_live_feed_cache_v2');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > FEED_CONFIG.cacheTtlMs) return null;
    return parsed.payload;
  } catch {
    return null;
  }
}

function renderBreakingTicker(items) {
  const ticker = document.getElementById('breakingTickerTrack');
  if (!ticker) return;
  ticker.innerHTML = items.slice(0, 8).map((i) => `<a href="${i.link}" target="_blank" rel="noopener">${i.title}</a>`).join('<span>•</span>');
}

function renderFeedCards(items) {
  const wrap = document.getElementById('liveUpdatesGrid');
  if (!wrap) return;
  wrap.innerHTML = items.slice(0, 8).map((i) => `
    <article class="live-card">
      <p class="live-card-meta">${i.source} • ${timeAgo(i.pubDate)}</p>
      <h3><a href="${i.link}" target="_blank" rel="noopener">${i.title}</a></h3>
      <p>${i.summary}</p>
    </article>
  `).join('');
}

function renderTrending(items) {
  const list = document.getElementById('aiTrendingList');
  if (!list) return;
  list.innerHTML = items.slice(0, 6).map((i, idx) => `<li><span>#${idx + 1}</span><a href="${i.link}" target="_blank" rel="noopener">${i.title}</a></li>`).join('');
}

async function loadLiveContent() {
  const status = document.getElementById('liveUpdateStatus');
  const cached = loadFeedCache();
  if (cached) {
    renderBreakingTicker(cached.all);
    renderFeedCards(cached.all);
    renderTrending(cached.all);
    if (status) status.textContent = `Live cache loaded • ${timeAgo(cached.generatedAt)}`;
  }

  try {
    const feedResults = await Promise.all(FEED_CONFIG.feeds.map(fetchRssFeed));
    const all = dedupeItems(feedResults.flat()).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const payload = { generatedAt: new Date().toISOString(), all };
    saveFeedCache(payload);
    renderBreakingTicker(all);
    renderFeedCards(all);
    renderTrending(all);
    if (status) status.textContent = `Auto-updated • ${timeAgo(payload.generatedAt)}`;
  } catch {
    if (status) status.textContent = 'Live feeds temporarily unavailable. Showing cached/manual updates.';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const dropbtns = document.querySelectorAll('.dropbtn');
  dropbtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const dropdownContent = this.nextElementSibling;
      dropdownContent.classList.toggle('show');
    });
  });

  window.addEventListener('click', function(e) {
    if (!e.target.matches('.dropbtn')) {
      const dropdowns = document.querySelectorAll('.dropdown-content');
      dropdowns.forEach(function(dropdown) {
        if (dropdown.classList.contains('show')) dropdown.classList.remove('show');
      });
    }
    const navMenu = document.getElementById('navMenu');
    const menuBtn = document.querySelector('.menu');
    if (navMenu && menuBtn && navMenu.classList.contains('open')) {
      if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) navMenu.classList.remove('open');
    }
  });

  const modeBtn = document.getElementById('themeToggleBtn');
  if (modeBtn) {
    const current = localStorage.getItem('aapka_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', current);
    modeBtn.textContent = current === 'dark' ? '☀️ Light' : '🌙 Dark';
    modeBtn.addEventListener('click', function() {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('aapka_theme', next);
      modeBtn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  }

  const searchInput = document.getElementById('siteSearchInput');
  const searchResults = document.getElementById('siteSearchResults');
  const searchStatus = document.getElementById('siteSearchStatus');
  if (searchInput && searchResults && searchStatus) {
    const allLinks = Array.from(document.querySelectorAll('main a[href]')).map((link) => ({ title: link.textContent.trim(), href: link.getAttribute('href') })).filter((x) => x.title.length > 2);
    const unique = dedupeItems(allLinks.map((x) => ({ ...x, link: x.href, pubDate: new Date().toISOString(), source: 'Internal', summary: '' })));

    function suggestTerms(query) {
      const chips = document.getElementById('aiSuggestions');
      if (!chips) return;
      const q = query.toLowerCase().trim();
      const suggestions = ['UP Police', 'SSC GD', 'Railway', 'Admit Card', 'Result', 'Scholarship'].filter((x) => x.toLowerCase().includes(q) || q === '').slice(0, 4);
      chips.innerHTML = suggestions.map((s) => `<button type="button" class="ai-chip">${s}</button>`).join('');
      chips.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { searchInput.value = b.textContent; renderSearchResults(b.textContent); }));
    }

    function renderSearchResults(query) {
      const q = query.trim().toLowerCase();
      searchResults.innerHTML = '';
      suggestTerms(query);
      if (!q) { searchStatus.textContent = 'Popular: SSC GD, UP Police, Agniveer, DSSSB'; return; }
      const filtered = unique.filter((item) => item.title.toLowerCase().includes(q)).slice(0, 8);
      if (!filtered.length) { searchStatus.textContent = `No result found for "${query}"`; return; }
      searchStatus.textContent = `${filtered.length} smart matches found`;
      filtered.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${item.link}">${item.title}</a>`;
        searchResults.appendChild(li);
      });
    }
    searchInput.addEventListener('input', function() { renderSearchResults(this.value); });
    suggestTerms('');

    const voiceBtn = document.getElementById('voiceSearchBtn');
    if (voiceBtn && 'webkitSpeechRecognition' in window) {
      voiceBtn.addEventListener('click', () => {
        const rec = new webkitSpeechRecognition();
        rec.lang = 'en-IN'; rec.start();
        rec.onresult = (ev) => {
          const text = ev.results[0][0].transcript || '';
          searchInput.value = text;
          renderSearchResults(text);
        };
      });
    } else if (voiceBtn) {
      voiceBtn.disabled = true;
      voiceBtn.textContent = 'Voice N/A';
    }
  }

  const visitCounterElement = document.getElementById('homeVisitCounter');
  if (visitCounterElement) {
    fetch('https://api.countapi.xyz/hit/aapkaresult-in/website-total-visits')
      .then((response) => response.json())
      .then((data) => { visitCounterElement.textContent = Number(data.value || 0).toLocaleString('en-IN'); })
      .catch(() => { visitCounterElement.textContent = 'Counter unavailable'; });
  }

  const chatForm = document.getElementById('aiChatForm');
  const chatOutput = document.getElementById('aiChatOutput');
  if (chatForm && chatOutput) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('aiChatInput');
      const q = input.value.trim();
      if (!q) return;
      let ans = 'Aap official notification check karein. Main aapko related page suggest karta hoon: Latest Jobs, Results, Admit Cards.';
      if (/result/i.test(q)) ans = 'Results section kholiye aur exam keyword search kijiye. Roll number aur DOB ready rakhein.';
      if (/admit/i.test(q)) ans = 'Admit Card updates daily refresh hote hain. Exam date se pehle print copy zaroor nikalein.';
      if (/age|eligibility|apply/i.test(q)) ans = 'Eligibility har notification me alag hoti hai. Apply se pehle age, fees aur documents verify karein.';
      chatOutput.innerHTML = `<p><strong>You:</strong> ${q}</p><p><strong>AI Assistant:</strong> ${ans}</p>`;
      input.value = '';
    });
  }

  loadLiveContent();
  setInterval(loadLiveContent, FEED_CONFIG.refreshMs);
});
