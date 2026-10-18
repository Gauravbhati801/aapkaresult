/**
 * AapkaResult.in - Sarkari Tools & Calculators 2026 Engine
 * High-performance, zero-dependency tools for Indian recruitment aspirants:
 * 1. Sarkari Age & Eligibility Calculator
 * 2. SSC / Railway / Police 10-Minute Typing Speed Test
 * 3. Physical Standards (Height / Chest / BMI) Checker
 * 4. Percentage to CGPA & Academic Marks Calculator
 */

// -------------------------------------------------------------
// TAB NAVIGATION CONTROLLER
// -------------------------------------------------------------
function switchToolTab(tabId) {
  // Update Tab buttons
  document.querySelectorAll('.tool-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  // Update Panels
  document.querySelectorAll('.tool-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
  });
  // Update URL hash without jumping
  if (history.replaceState) {
    history.replaceState(null, null, '#' + tabId);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Tab click listeners
  document.querySelectorAll('.tool-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchToolTab(btn.dataset.tab);
    });
  });

  // Handle URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    switchToolTab(hash);
  }

  // Auto-init individual tools if forms exist
  if (document.getElementById('ageCalculatorForm')) initAgeCalculator();
  if (document.getElementById('typingTestContainer')) initTypingTest();
  if (document.getElementById('physicalCheckerForm')) initPhysicalChecker();
  if (document.getElementById('cgpaConverterContainer')) initCgpaCalculator();
});

// -------------------------------------------------------------
// 1. SARKARI AGE & ELIGIBILITY CALCULATOR
// -------------------------------------------------------------
const SARKARI_EXAMS = [
  { id: 'up-police', name: 'UP Police Constable 2026', minAge: 18, maxAgeMale: 22, maxAgeFemale: 25, url: 'up-police-constable.html' },
  { id: 'up-si', name: 'UP Police Sub Inspector (SI)', minAge: 21, maxAgeMale: 28, maxAgeFemale: 28, url: 'latest-jobs.html' },
  { id: 'ssc-gd', name: 'SSC GD Constable (Paramilitary)', minAge: 18, maxAgeMale: 23, maxAgeFemale: 23, url: 'ssc-gd-constable.html' },
  { id: 'ssc-chsl', name: 'SSC CHSL (10+2 LDC/DEO)', minAge: 18, maxAgeMale: 27, maxAgeFemale: 27, url: 'latest-jobs.html' },
  { id: 'ssc-cgl', name: 'SSC CGL (Graduate Level)', minAge: 18, maxAgeMale: 32, maxAgeFemale: 32, url: 'latest-jobs.html' },
  { id: 'rrb-ntpc', name: 'Railway RRB NTPC (Grad/UG)', minAge: 18, maxAgeMale: 33, maxAgeFemale: 33, url: 'rrb-ntpc-graduate.html' },
  { id: 'rrb-group-d', name: 'Railway RRB Group D', minAge: 18, maxAgeMale: 33, maxAgeFemale: 33, url: 'rrb-group-d.html' },
  { id: 'army-agniveer', name: 'Indian Army Agniveer GD', minAge: 17.5, maxAgeMale: 21, maxAgeFemale: 21, url: 'latest-jobs.html' },
  { id: 'delhi-police', name: 'Delhi Police Constable', minAge: 18, maxAgeMale: 25, maxAgeFemale: 25, url: 'latest-jobs.html' },
  { id: 'rpf-constable', name: 'RPF Constable & SI', minAge: 18, maxAgeMale: 28, maxAgeFemale: 28, url: 'latest-jobs.html' },
  { id: 'upsc-cse', name: 'UPSC Civil Services (IAS/IPS)', minAge: 21, maxAgeMale: 32, maxAgeFemale: 32, url: 'latest-jobs.html' },
  { id: 'india-post-gds', name: 'India Post GDS (Gramin Dak)', minAge: 18, maxAgeMale: 40, maxAgeFemale: 40, url: 'india-post-gds.html' }
];

function initAgeCalculator() {
  const form = document.getElementById('ageCalculatorForm');
  const asOnInput = document.getElementById('ageAsOnDate');
  
  // Set default As On date to today if empty, or allow quick toggle to 01/07/2026
  if (asOnInput && !asOnInput.value) {
    const today = new Date();
    asOnInput.value = today.toISOString().split('T')[0];
  }

  // Quick preset buttons (Today, 01/07/2026, 01/01/2026)
  document.querySelectorAll('.date-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (asOnInput) {
        asOnInput.value = btn.dataset.date;
        calculateAgeAction();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateAgeAction();
  });
}

function calculateAgeAction() {
  const dobVal = document.getElementById('ageDob').value;
  const asOnVal = document.getElementById('ageAsOnDate').value;
  const category = document.getElementById('ageCategory').value;
  const gender = document.getElementById('ageGender').value;

  if (!dobVal || !asOnVal) {
    alert('कृपया अपनी जन्मतिथि (DOB) और गणना की तारीख (As on Date) भरें।');
    return;
  }

  const birthDate = new Date(dobVal);
  const targetDate = new Date(asOnVal);

  if (birthDate > targetDate) {
    alert('जन्मतिथि (DOB) गणना की तारीख से पहले होनी चाहिए।');
    return;
  }

  // Exact age calculation
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Total metrics
  const diffTime = Math.abs(targetDate - birthDate);
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Next birthday calculation
  let nextBday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBday < targetDate) {
    nextBday.setFullYear(targetDate.getFullYear() + 1);
  }
  const daysToNextBday = Math.ceil((nextBday - targetDate) / (1000 * 60 * 60 * 24));

  // Category Age Relaxation Years
  let relaxationYears = 0;
  let relaxationLabel = 'कोई छूट नहीं (General / EWS)';
  if (category === 'obc') {
    relaxationYears = 3;
    relaxationLabel = '3 वर्ष की ऊपरी आयु सीमा छूट (OBC Non-Creamy Layer)';
  } else if (category === 'sc_st') {
    relaxationYears = 5;
    relaxationLabel = '5 वर्ष की ऊपरी आयु सीमा छूट (SC / ST Category)';
  } else if (category === 'pwd_gen') {
    relaxationYears = 10;
    relaxationLabel = '10 वर्ष की ऊपरी आयु सीमा छूट (PwD General/EWS)';
  } else if (category === 'pwd_obc') {
    relaxationYears = 13;
    relaxationLabel = '13 वर्ष की ऊपरी आयु सीमा छूट (PwD OBC)';
  } else if (category === 'pwd_sc_st') {
    relaxationYears = 15;
    relaxationLabel = '15 वर्ष की ऊपरी आयु सीमा छूट (PwD SC/ST)';
  } else if (category === 'esm') {
    relaxationYears = 3;
    relaxationLabel = 'सैन्य सेवा + 3 वर्ष की छूट (Ex-Servicemen)';
  }

  // Update UI Elements
  document.getElementById('resYears').textContent = years;
  document.getElementById('resMonths').textContent = months;
  document.getElementById('resDays').textContent = days;
  document.getElementById('resTotalDays').textContent = totalDays.toLocaleString('en-IN');
  document.getElementById('resTotalWeeks').textContent = totalWeeks.toLocaleString('en-IN') + ' सप्ताह';
  document.getElementById('resTotalHours').textContent = totalHours.toLocaleString('en-IN') + ' घंटे';
  document.getElementById('resNextBday').textContent = `🎂 आपके अगले जन्मदिन में केवल ${daysToNextBday} दिन बाकी हैं!`;
  document.getElementById('resRelaxation').textContent = relaxationLabel;

  // Decimal age for precise eligibility checking
  const exactAgeDecimal = years + (months / 12) + (days / 365.25);

  // Populate Exam Eligibility Table
  const tbody = document.getElementById('examEligibilityBody');
  if (tbody) {
    tbody.innerHTML = '';
    SARKARI_EXAMS.forEach(exam => {
      const baseMaxAge = gender === 'female' ? exam.maxAgeFemale : exam.maxAgeMale;
      const effectiveMaxAge = baseMaxAge + relaxationYears;
      let statusHtml = '';

      if (exactAgeDecimal < exam.minAge) {
        statusHtml = `<span class="status-pill underage">⏳ कम उम्र (${(exam.minAge - exactAgeDecimal).toFixed(1)} वर्ष बाकी)</span>`;
      } else if (exactAgeDecimal <= effectiveMaxAge) {
        statusHtml = `<span class="status-pill eligible">✅ पात्र (Eligible)</span>`;
      } else {
        const overBy = (exactAgeDecimal - effectiveMaxAge).toFixed(1);
        statusHtml = `<span class="status-pill overage">❌ अधिक उम्र (+${overBy} वर्ष)</span>`;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${exam.name}</strong></td>
        <td>${exam.minAge} &ndash; ${baseMaxAge} वर्ष</td>
        <td><strong style="color: #2563eb;">${exam.minAge} &ndash; ${effectiveMaxAge} वर्ष</strong></td>
        <td>${statusHtml}</td>
        <td><a href="${exam.url}" style="font-size:12px; font-weight:700; color:#1e3a8a; text-decoration:underline;">विवरण / फॉर्म</a></td>
      `;
      tbody.appendChild(tr);
    });
  }

  const resultBox = document.getElementById('ageResultBox');
  if (resultBox) {
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// -------------------------------------------------------------
// 2. SSC & RAILWAY 10-MIN TYPING SPEED TEST ENGINE
// -------------------------------------------------------------
const TYPING_PASSAGES = {
  en: [
    `The digital revolution has transformed public administration in India, providing seamless services to citizens across the country. Government schemes and welfare initiatives are now tracked in real time through advanced databases and direct benefit transfers. Efficient documentation and fast data entry skills are essential for ministerial staff working in central secretariats, postal offices, and railway divisions. Aspirants preparing for clerical examinations like SSC CHSL and Railway NTPC must practice daily to build finger muscle memory, maintain continuous concentration, and achieve high keyboard accuracy. Precision is always more valuable than mere raw speed in competitive computer tests.`,
    `Indian Railways represents the lifeline of national transportation, connecting remote villages to bustling metropolises. Modern computer networks manage ticketing systems, freight logistics, passenger reservations, and train scheduling across dozens of operating zones. Junior accounts assistants and senior clerks must maintain precise typing speeds of thirty words per minute with minimum ninety-five percent accuracy. Maintaining proper sitting posture, resting wrists comfortably, and looking steadily at the computer screen rather than looking down at keys prevents physical fatigue during rigorous government examination sessions.`,
    `Fundamental rights guaranteed under the Indian Constitution protect individual liberties and promote social justice. Article fourteen ensures equality before the law, while Article twenty-one guarantees the protection of life and personal liberty. Effective civil governance relies upon accurate clerical records, official gazette notifications, and judicial proceedings. Candidates appearing for High Court stenographer and clerk recruitment tests must possess flawless typing ability in both English and Hindi. Regular practice on varied standard passages guarantees confidence on final examination day.`
  ],
  hi: [
    `भारतीय प्रशासनिक सेवा और विभिन्न सरकारी विभागों में कंप्यूटर आधारित कार्यप्रणाली का विस्तार बहुत तीव्र गति से हो रहा है। आज लगभग सभी फाइलों, पत्राचार और जनहित योजनाओं का प्रबंधन डिजिटल माध्यम से किया जाता है। कर्मचारी चयन आयोग (SSC) और उत्तर प्रदेश पुलिस कंप्यूटर ऑपरेटर जैसी महत्वपूर्ण परीक्षाओं में हिंदी टाइपिंग परीक्षा अनिवार्य होती है। अभ्यर्थियों को मंगल फॉन्ट और रेमिंगटन गेल अथवा इनस्क्रिप्ट कीबोर्ड लेआउट पर नियमित अभ्यास करना चाहिए ताकि वे निर्धारित समय सीमा में न्यूनतम त्रुटियों के साथ परीक्षा उत्तीर्ण कर सकें।`,
    `रेलवे भर्ती बोर्ड द्वारा आयोजित एनटीपीसी परीक्षा में कनिष्ठ लिपिक और वरिष्ठ लेखा सहायकों के लिए टाइपिंग दक्षता अनिवार्य है। हिंदी माध्यम में पच्चीस शब्द प्रति मिनट तथा अंग्रेजी में तीस शब्द प्रति मिनट की गति अपेक्षित होती है। अभ्यर्थियों को अभ्यास करते समय केवल गति बढ़ाने पर ध्यान केंद्रित करने के बजाय शुद्धता बनाए रखने पर अधिक जोर देना चाहिए। परीक्षा हॉल में शांत मन और नियमित श्वास नियंत्रण से अनावश्यक त्रुटियों से बचा जा सकता है और आत्मविश्वास में वृद्धि होती है।`
  ]
};

let typingTimer = null;
let typingTimeLeft = 600; // default 10 min
let typingDuration = 600;
let typingIsRunning = false;
let typingWordsArray = [];
let typingCurrentWordIndex = 0;
let typingCharIndex = 0;
let typingMistakes = 0;
let typingKeystrokes = 0;
let typingCorrectWords = 0;

function initTypingTest() {
  const langSelect = document.getElementById('typingLanguage');
  const durSelect = document.getElementById('typingDuration');
  const startBtn = document.getElementById('startTypingBtn');
  const resetBtn = document.getElementById('resetTypingBtn');
  const inputArea = document.getElementById('typingInput');

  if (langSelect) langSelect.addEventListener('change', loadTypingPassage);
  if (durSelect) {
    durSelect.addEventListener('change', () => {
      typingDuration = parseInt(durSelect.value, 10);
      typingTimeLeft = typingDuration;
      document.getElementById('typingTimerVal').textContent = formatTypingTime(typingTimeLeft);
    });
  }

  if (startBtn) startBtn.addEventListener('click', startTypingSession);
  if (resetBtn) resetBtn.addEventListener('click', resetTypingSession);
  if (inputArea) inputArea.addEventListener('input', handleTypingInput);

  loadTypingPassage();
}

function loadTypingPassage() {
  const lang = document.getElementById('typingLanguage')?.value || 'en';
  const list = TYPING_PASSAGES[lang] || TYPING_PASSAGES['en'];
  const text = list[Math.floor(Math.random() * list.length)];
  const displayBox = document.getElementById('typingPassageBox');

  if (!displayBox) return;

  typingWordsArray = text.trim().split(/\s+/);
  displayBox.innerHTML = '';
  typingWordsArray.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'typing-word' + (index === 0 ? ' active-word' : '');
    span.id = `tw-${index}`;
    span.textContent = word + ' ';
    displayBox.appendChild(span);
  });

  typingCurrentWordIndex = 0;
  typingMistakes = 0;
  typingKeystrokes = 0;
  typingCorrectWords = 0;
}

function startTypingSession() {
  const input = document.getElementById('typingInput');
  const startBtn = document.getElementById('startTypingBtn');
  const durSelect = document.getElementById('typingDuration');

  if (typingIsRunning) return;

  typingDuration = parseInt(durSelect.value, 10);
  typingTimeLeft = typingDuration;
  typingIsRunning = true;
  typingMistakes = 0;
  typingKeystrokes = 0;
  typingCorrectWords = 0;
  typingCurrentWordIndex = 0;

  input.disabled = false;
  input.value = '';
  input.focus();
  startBtn.textContent = '⏱️ टेस्ट जारी है...';
  startBtn.disabled = true;

  clearInterval(typingTimer);
  typingTimer = setInterval(() => {
    typingTimeLeft--;
    document.getElementById('typingTimerVal').textContent = formatTypingTime(typingTimeLeft);
    updateTypingStats();

    if (typingTimeLeft <= 0) {
      endTypingSession();
    }
  }, 1000);
}

function handleTypingInput(e) {
  if (!typingIsRunning) {
    startTypingSession();
  }

  const input = e.target;
  const val = input.value;
  typingKeystrokes++;

  // Check if user pressed space (word complete)
  if (val.endsWith(' ')) {
    const typedWord = val.trim();
    const targetWord = typingWordsArray[typingCurrentWordIndex];
    const currentSpan = document.getElementById(`tw-${typingCurrentWordIndex}`);

    if (currentSpan) {
      if (typedWord === targetWord) {
        currentSpan.className = 'typing-word correct';
        typingCorrectWords++;
      } else {
        currentSpan.className = 'typing-word error';
        typingMistakes++;
      }
    }

    typingCurrentWordIndex++;
    input.value = '';

    // Highlight next word
    if (typingCurrentWordIndex < typingWordsArray.length) {
      const nextSpan = document.getElementById(`tw-${typingCurrentWordIndex}`);
      if (nextSpan) {
        nextSpan.className = 'typing-word active-word';
        // Auto scroll passage box
        const box = document.getElementById('typingPassageBox');
        if (nextSpan.offsetTop > box.scrollTop + 100) {
          box.scrollTop = nextSpan.offsetTop - 50;
        }
      }
    } else {
      endTypingSession();
    }
  } else {
    // Character-level live check on active word
    const currentSpan = document.getElementById(`tw-${typingCurrentWordIndex}`);
    const targetWord = typingWordsArray[typingCurrentWordIndex];
    if (currentSpan && targetWord) {
      if (!targetWord.startsWith(val)) {
        currentSpan.classList.add('error');
      } else {
        currentSpan.classList.remove('error');
      }
    }
  }

  updateTypingStats();
}

function updateTypingStats() {
  const timeElapsedSec = Math.max(1, typingDuration - typingTimeLeft);
  const timeElapsedMin = timeElapsedSec / 60;

  // Standard typing measurement: 5 strokes = 1 word
  const grossWords = typingKeystrokes / 5;
  const grossWpm = Math.round(grossWords / timeElapsedMin);
  const netWpm = Math.max(0, Math.round((grossWords - typingMistakes) / timeElapsedMin));
  const accuracy = typingKeystrokes > 0 
    ? Math.max(0, Math.round(((typingKeystrokes - (typingMistakes * 5)) / typingKeystrokes) * 100))
    : 100;

  document.getElementById('typingGrossWpm').textContent = grossWpm || 0;
  document.getElementById('typingNetWpm').textContent = netWpm || 0;
  document.getElementById('typingAccuracy').textContent = accuracy + '%';
  document.getElementById('typingErrors').textContent = typingMistakes;
}

function endTypingSession() {
  clearInterval(typingTimer);
  typingIsRunning = false;

  const input = document.getElementById('typingInput');
  const startBtn = document.getElementById('startTypingBtn');
  input.disabled = true;
  startBtn.textContent = '🚀 दोबारा टेस्ट शुरू करें';
  startBtn.disabled = false;

  const timeElapsedSec = typingDuration - typingTimeLeft || 1;
  const timeElapsedMin = timeElapsedSec / 60;
  const grossWords = typingKeystrokes / 5;
  const grossWpm = Math.round(grossWords / timeElapsedMin);
  const netWpm = Math.max(0, Math.round((grossWords - typingMistakes) / timeElapsedMin));
  const accuracy = typingKeystrokes > 0 
    ? Math.max(0, Math.round(((typingKeystrokes - (typingMistakes * 5)) / typingKeystrokes) * 100))
    : 100;

  const lang = document.getElementById('typingLanguage')?.value || 'en';
  const targetReq = lang === 'en' ? 35 : 30;
  const qualified = netWpm >= targetReq && accuracy >= 95;

  // Show Modal Scorecard
  const modal = document.getElementById('typingScoreModal');
  if (modal) {
    document.getElementById('modalNetWpm').textContent = netWpm;
    document.getElementById('modalGrossWpm').textContent = grossWpm;
    document.getElementById('modalAccuracy').textContent = accuracy + '%';
    document.getElementById('modalMistakes').textContent = typingMistakes;
    document.getElementById('modalKeystrokes').textContent = typingKeystrokes;
    
    const verdict = document.getElementById('modalVerdict');
    if (qualified) {
      verdict.innerHTML = `<span style="color:#16a34a; font-weight:800; font-size:1.15rem;">🎉 बधाई हो! आप SSC CHSL / Railway NTPC टाइपिंग मानदंड (Benchmark: ${targetReq} WPM @ 95%) के अनुसार योग्य (QUALIFIED) हैं!</span>`;
    } else {
      verdict.innerHTML = `<span style="color:#dc2626; font-weight:700;">⚠️ और अभ्यास की आवश्यकता है! सरकारी परीक्षाओं के लिए न्यूनतम ${targetReq} Net WPM और 95% शुद्धता अनिवार्य है।</span>`;
    }
    modal.style.display = 'flex';
  }
}

function resetTypingSession() {
  clearInterval(typingTimer);
  typingIsRunning = false;
  const durSelect = document.getElementById('typingDuration');
  typingDuration = parseInt(durSelect?.value || '600', 10);
  typingTimeLeft = typingDuration;

  document.getElementById('typingTimerVal').textContent = formatTypingTime(typingTimeLeft);
  document.getElementById('typingGrossWpm').textContent = '0';
  document.getElementById('typingNetWpm').textContent = '0';
  document.getElementById('typingAccuracy').textContent = '100%';
  document.getElementById('typingErrors').textContent = '0';

  const input = document.getElementById('typingInput');
  const startBtn = document.getElementById('startTypingBtn');
  input.disabled = false;
  input.value = '';
  startBtn.textContent = '🚀 टाइपिंग टेस्ट शुरू करें';
  startBtn.disabled = false;

  loadTypingPassage();
}

function formatTypingTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function closeTypingModal() {
  const modal = document.getElementById('typingScoreModal');
  if (modal) modal.style.display = 'none';
  resetTypingSession();
}

// -------------------------------------------------------------
// 3. PHYSICAL STANDARDS (HEIGHT / CHEST / BMI) CHECKER
// -------------------------------------------------------------
const PHYSICAL_STANDARDS = [
  {
    force: 'UP Police Constable & SI',
    slug: 'up-police-constable.html',
    male: { genHeight: 168, stHeight: 160, chestNorm: 79, chestExp: 84 },
    female: { genHeight: 152, stHeight: 147, minWeight: 40 }
  },
  {
    force: 'SSC GD Constable (CAPFs)',
    slug: 'ssc-gd-constable.html',
    male: { genHeight: 170, stHeight: 162.5, chestNorm: 80, chestExp: 85, stChestNorm: 76, stChestExp: 81 },
    female: { genHeight: 157, stHeight: 150, minWeight: null }
  },
  {
    force: 'Delhi Police Constable (Exec)',
    slug: 'latest-jobs.html',
    male: { genHeight: 170, stHeight: 165, chestNorm: 81, chestExp: 85 },
    female: { genHeight: 157, stHeight: 155, minWeight: null }
  },
  {
    force: 'Railway RPF Constable & SI',
    slug: 'latest-jobs.html',
    male: { genHeight: 165, stHeight: 160, chestNorm: 80, chestExp: 85 },
    female: { genHeight: 157, stHeight: 152, minWeight: null }
  },
  {
    force: 'Indian Army Agniveer GD',
    slug: 'latest-jobs.html',
    male: { genHeight: 169, stHeight: 162, chestNorm: 77, chestExp: 82 },
    female: { genHeight: 162, stHeight: 158, minWeight: null }
  },
  {
    force: 'CISF Head Constable / ASI',
    slug: 'latest-jobs.html',
    male: { genHeight: 165, stHeight: 162.5, chestNorm: 77, chestExp: 82 },
    female: { genHeight: 155, stHeight: 150, minWeight: null }
  }
];

function initPhysicalChecker() {
  const form = document.getElementById('physicalCheckerForm');
  const heightInput = document.getElementById('physHeight');
  const genderSelect = document.getElementById('physGender');

  if (heightInput) {
    heightInput.addEventListener('input', () => {
      const cm = parseFloat(heightInput.value);
      const ftInSpan = document.getElementById('physHeightFtIn');
      if (cm && cm > 0 && ftInSpan) {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = (totalInches % 12).toFixed(1);
        ftInSpan.textContent = `(${feet} फीट ${inches} इंच)`;
      } else if (ftInSpan) {
        ftInSpan.textContent = '';
      }
    });
  }

  if (genderSelect) {
    genderSelect.addEventListener('change', () => {
      const chestFields = document.querySelectorAll('.male-chest-field');
      if (genderSelect.value === 'female') {
        chestFields.forEach(f => f.style.display = 'none');
      } else {
        chestFields.forEach(f => f.style.display = 'flex');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      evaluatePhysicalStandards();
    });
  }
}

function evaluatePhysicalStandards() {
  const gender = document.getElementById('physGender').value;
  const category = document.getElementById('physCategory').value;
  const height = parseFloat(document.getElementById('physHeight').value);
  const weight = parseFloat(document.getElementById('physWeight').value);
  const chestNorm = parseFloat(document.getElementById('physChestNorm')?.value || '0');
  const chestExp = parseFloat(document.getElementById('physChestExp')?.value || '0');

  if (!height || !weight) {
    alert('कृपया अपनी सटीक लंबाई (Height) और वजन (Weight) दर्ज करें।');
    return;
  }

  if (gender === 'male' && (!chestNorm || !chestExp)) {
    alert('कृपया बिना फुलाए और फुलाने के बाद सीने का माप दर्ज करें।');
    return;
  }

  // 1. BMI Calculation: kg / (m^2)
  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);
  let bmiCategory = '';
  let bmiColor = '';
  let bmiAdvice = '';

  if (bmi < 18.5) {
    bmiCategory = 'कम वजन (Underweight)';
    bmiColor = '#0284c7';
    bmiAdvice = 'मेडिकल बोर्ड में वजन कम होने पर री-मेडिकल मिल सकता है। पौष्टिक आहार और प्रोटीन इनटेक बढ़ाएं।';
  } else if (bmi <= 24.9) {
    bmiCategory = 'आदर्श वजन (Fit / Normal Range)';
    bmiColor = '#16a34a';
    bmiAdvice = 'उत्कृष्ट! आपका वजन और बीएमआई डिफेंस तथा पुलिस मेडिकल मानकों के पूर्णतः अनुकूल है।';
  } else if (bmi <= 29.9) {
    bmiCategory = 'अधिक वजन (Overweight)';
    bmiColor = '#d97706';
    bmiAdvice = 'दौड़ और कार्डियो ट्रेनिंग से वजन कम करें ताकि मेडिकल में ओवरवेट रिजेक्शन से बचा जा सके।';
  } else {
    bmiCategory = 'मोटापा (Obese)';
    bmiColor = '#dc2626';
    bmiAdvice = 'वजन अधिक होने के कारण दौड़ने की गति और स्टैमिना प्रभावित हो सकता है। वजन तुरंत नियंत्रित करें।';
  }

  document.getElementById('physBmiVal').textContent = bmi;
  document.getElementById('physBmiStatus').textContent = bmiCategory;
  document.getElementById('physBmiStatus').style.color = bmiColor;
  document.getElementById('physBmiAdvice').textContent = bmiAdvice;

  // 2. Chest Expansion Check (Min 5 cm required for all males)
  const chestExpansion = chestExp - chestNorm;
  const chestExpCard = document.getElementById('physChestAnalysis');
  if (gender === 'male' && chestExpCard) {
    chestExpCard.style.display = 'block';
    document.getElementById('physChestDiff').textContent = chestExpansion.toFixed(1) + ' cm';
    if (chestExpansion >= 5) {
      document.getElementById('physChestStatus').textContent = '✅ सीने का फुलाव सही है (न्यूनतम 5 सेमी आवश्यक)';
      document.getElementById('physChestStatus').style.color = '#16a34a';
    } else {
      document.getElementById('physChestStatus').textContent = `❌ फुलाव कम है (${(5 - chestExpansion).toFixed(1)} सेमी और चाहिए)। पुश-अप्स और प्राणायाम करें।`;
      document.getElementById('physChestStatus').style.color = '#dc2626';
    }
  } else if (chestExpCard) {
    chestExpCard.style.display = 'none';
  }

  // 3. Evaluate each force standards
  const grid = document.getElementById('physicalResultsGrid');
  if (grid) {
    grid.innerHTML = '';
    const isST = (category === 'st');

    PHYSICAL_STANDARDS.forEach(item => {
      let isHeightOk = false;
      let isChestOk = true;
      let isWeightOk = true;
      let reqHeight = 0;
      let reqChest = '';

      if (gender === 'male') {
        reqHeight = isST ? item.male.stHeight : item.male.genHeight;
        isHeightOk = (height >= reqHeight);
        const minNorm = isST ? (item.male.stChestNorm || (item.male.chestNorm - 2)) : item.male.chestNorm;
        const minExp = isST ? (item.male.stChestExp || (item.male.chestExp - 2)) : item.male.chestExp;
        reqChest = `${minNorm} - ${minExp} cm`;
        isChestOk = (chestNorm >= minNorm && chestExpansion >= 5);
      } else {
        reqHeight = isST ? item.female.stHeight : item.female.genHeight;
        isHeightOk = (height >= reqHeight);
        reqChest = 'लागू नहीं (Not Applicable)';
        if (item.female.minWeight) {
          isWeightOk = (weight >= item.female.minWeight);
        }
      }

      const isAllFit = isHeightOk && isChestOk && isWeightOk;

      const card = document.createElement('div');
      card.className = 'force-card ' + (isAllFit ? 'fit' : 'unfit');
      card.innerHTML = `
        <div>
          <div class="force-card-header">
            <h3>${item.force}</h3>
            <span class="status-pill ${isAllFit ? 'eligible' : 'overage'}">
              ${isAllFit ? '✅ शारीरिक रूप से फिट' : '⚠️ अपात्र / सुधार जरूरी'}
            </span>
          </div>
          <div style="font-size: 13px; color: #475569; line-height: 1.6; margin: 8px 0;">
            <div>📏 <strong>न्यूनतम ऊंचाई:</strong> ${reqHeight} cm (${isHeightOk ? '<span style="color:#16a34a; font-weight:700;">पास</span>' : '<span style="color:#dc2626; font-weight:700;">' + (reqHeight - height).toFixed(1) + ' cm कम</span>'})</div>
            ${gender === 'male' ? `<div>💪 <strong>सीना माप:</strong> ${reqChest} (${isChestOk ? '<span style="color:#16a34a; font-weight:700;">पास</span>' : '<span style="color:#dc2626; font-weight:700;">फेल</span>'})</div>` : ''}
            ${gender === 'female' && item.female.minWeight ? `<div>⚖️ <strong>न्यूनतम वजन:</strong> 40 kg (${isWeightOk ? '<span style="color:#16a34a; font-weight:700;">पास</span>' : '<span style="color:#dc2626; font-weight:700;">कम</span>'})</div>` : ''}
          </div>
        </div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
          <a href="${item.slug}" style="font-size: 12.5px; font-weight: 700; color: #1e3a8a; text-decoration: underline;">
            फिजिकल व भर्ती डिटेल्स देखें &rarr;
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  const resultBox = document.getElementById('physicalResultBox');
  if (resultBox) {
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// -------------------------------------------------------------
// 4. PERCENTAGE TO CGPA & MARKS CONVERTER
// -------------------------------------------------------------
function initCgpaCalculator() {
  // Mode switcher tabs (CGPA to %, % to CGPA, Marks to %, Best 5 Aggregate)
  document.querySelectorAll('.cgpa-mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.cgpa-mode-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cgpa-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panelId = btn.dataset.target;
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Mode 1: CGPA to %
  const form1 = document.getElementById('formCgpaToPercent');
  if (form1) {
    form1.addEventListener('submit', (e) => {
      e.preventDefault();
      const cgpa = parseFloat(document.getElementById('inputCgpaVal').value);
      const univ = document.getElementById('selectUnivFormula').value;
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        alert('कृपया 0 से 10 के बीच वैध CGPA दर्ज करें।');
        return;
      }

      let percent = 0;
      let formulaText = '';
      if (univ === 'cbse') {
        percent = cgpa * 9.5;
        formulaText = `प्रतिशत = CGPA × 9.5 (${cgpa} × 9.5 = ${percent.toFixed(2)}%)`;
      } else if (univ === 'aktu') {
        percent = cgpa * 10;
        formulaText = `प्रतिशत = CGPA × 10 (${cgpa} × 10 = ${percent.toFixed(2)}%)`;
      } else if (univ === 'aicte') {
        percent = (cgpa - 0.75) * 10;
        formulaText = `प्रतिशत = (CGPA - 0.75) × 10 ((${cgpa} - 0.75) × 10 = ${percent.toFixed(2)}%)`;
      } else if (univ === 'mumbai') {
        percent = 7.1 * cgpa + 11;
        formulaText = `प्रतिशत = 7.1 × CGPA + 11 (${cgpa} × 7.1 + 11 = ${percent.toFixed(2)}%)`;
      } else if (univ === 'gtu') {
        percent = (cgpa - 0.5) * 10;
        formulaText = `प्रतिशत = (CGPA - 0.5) × 10 ((${cgpa} - 0.5) × 10 = ${percent.toFixed(2)}%)`;
      }

      percent = Math.min(100, Math.max(0, percent));
      let division = percent >= 75 ? 'प्रथम श्रेणी विशेष योग्यता सहित (Distinction)' : (percent >= 60 ? 'प्रथम श्रेणी (First Division)' : (percent >= 50 ? 'द्वितीय श्रेणी (Second Division)' : 'तृतीय श्रेणी (Pass)'));

      document.getElementById('resCgpaPercent').textContent = percent.toFixed(2) + '%';
      document.getElementById('resCgpaFormula').textContent = formulaText;
      document.getElementById('resCgpaDivision').textContent = division;
      document.getElementById('boxCgpaToPercent').style.display = 'block';
    });
  }

  // Mode 2: % to CGPA
  const form2 = document.getElementById('formPercentToCgpa');
  if (form2) {
    form2.addEventListener('submit', (e) => {
      e.preventDefault();
      const pct = parseFloat(document.getElementById('inputPercentVal').value);
      if (isNaN(pct) || pct < 0 || pct > 100) {
        alert('कृपया 0 से 100 के बीच वैध प्रतिशत दर्ज करें।');
        return;
      }
      const cgpa = (pct / 9.5).toFixed(2);
      document.getElementById('resPercentCgpa').textContent = cgpa;
      document.getElementById('resPercentFormula').textContent = `CGPA = प्रतिशत ÷ 9.5 (${pct} ÷ 9.5 = ${cgpa})`;
      document.getElementById('boxPercentToCgpa').style.display = 'block';
    });
  }

  // Mode 3: Total Marks to Percentage
  const form3 = document.getElementById('formMarksToPercent');
  if (form3) {
    form3.addEventListener('submit', (e) => {
      e.preventDefault();
      const obtained = parseFloat(document.getElementById('inputMarksObtained').value);
      const maximum = parseFloat(document.getElementById('inputMarksMax').value);

      if (isNaN(obtained) || isNaN(maximum) || maximum <= 0 || obtained > maximum) {
        alert('कृपया वैध प्राप्तांक (Obtained) और पूर्णांक (Maximum) दर्ज करें।');
        return;
      }

      const pct = (obtained / maximum) * 100;
      const missed = maximum - obtained;
      let div = pct >= 60 ? 'First Division (प्रथम श्रेणी)' : (pct >= 45 ? 'Second Division (द्वितीय श्रेणी)' : (pct >= 33 ? 'Third Division (तृतीय श्रेणी)' : 'अनुत्तीर्ण (Failed)'));

      document.getElementById('resMarksPercent').textContent = pct.toFixed(2) + '%';
      document.getElementById('resMarksLost').textContent = missed + ' अंक कटे';
      document.getElementById('resMarksDiv').textContent = div;
      document.getElementById('boxMarksToPercent').style.display = 'block';
    });
  }

  // Mode 4: Best 5 Subject Aggregate Calculator
  const calcBest5Btn = document.getElementById('calcBest5Btn');
  if (calcBest5Btn) {
    calcBest5Btn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.sub-mark-input');
      const marks = [];
      let total = 0;
      let validCount = 0;

      inputs.forEach(inp => {
        const val = parseFloat(inp.value);
        if (!isNaN(val) && val >= 0) {
          marks.push(val);
          total += val;
          validCount++;
        }
      });

      if (marks.length < 5) {
        alert('कृपया कम से कम 5 विषयों के प्राप्तांक दर्ज करें।');
        return;
      }

      // Sort descending to find top 5
      marks.sort((a, b) => b - a);
      const best5 = marks.slice(0, 5);
      const best5Sum = best5.reduce((sum, val) => sum + val, 0);
      const best5Percent = (best5Sum / 500) * 100;
      const overallPercent = (total / (validCount * 100)) * 100;

      document.getElementById('resBest5Percent').textContent = best5Percent.toFixed(2) + '%';
      document.getElementById('resBest5Sum').textContent = `${best5Sum} / 500 (अंक: ${best5.join(', ')})`;
      document.getElementById('resOverallPercent').textContent = `सभी ${validCount} विषयों का कुल प्रतिशत: ${overallPercent.toFixed(2)}%`;
      document.getElementById('boxBest5Result').style.display = 'block';
    });
  }
}
