// Interview App Logic
// Topics are loaded from pv-data-*.js files into window.__pvTopics
// ====================== APP LOGIC ======================

// Topics data loaded from pv-data-*.js files
const topics = window.__pvTopics || [];

const topicNav = document.getElementById('topicNav');
const contentDiv = document.getElementById('content');
const searchBox = document.getElementById('searchBox');
const diffFilter = document.getElementById('difficultyFilter');
const statsEl = document.getElementById('stats');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const randomBtn = document.getElementById('randomBtn');
const expandBtn = document.getElementById('expandAllBtn');
const collapseBtn = document.getElementById('collapseAllBtn');
const darkBtn = document.getElementById('darkModeBtn');

let allCards = [];

// ---- Build sidebar nav ----
function buildNav() {
  topicNav.innerHTML = '';
  topics.forEach((t) => {
    const a = document.createElement('a');
    a.href = '#section-' + t.id;
    a.innerHTML = `<span>${t.icon}</span> ${t.name} <span class="badge">${t.questions.length}</span>`;
    a.addEventListener('click', () => sidebar.classList.remove('open'));
    topicNav.appendChild(a);
  });
}

// ---- Build content cards ----
function buildContent() {
  contentDiv.innerHTML = '';
  allCards = [];
  let globalNum = 0;

  topics.forEach((topic) => {
    const section = document.createElement('div');
    section.className = 'topic-section';
    section.id = 'section-' + topic.id;
    section.innerHTML = `<div class="topic-title"><span class="icon">${topic.icon}</span> ${topic.name}</div>`;

    topic.questions.forEach((item, i) => {
      globalNum++;
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.difficulty = item.difficulty;
      card.dataset.topic = topic.id;
      card.dataset.question = item.q.toLowerCase();
      card.dataset.answer = item.a.toLowerCase().replace(/<[^>]*>/g, '');

      card.innerHTML = `
        <div class="card-header" role="button" tabindex="0">
          <span class="num">${globalNum}</span>
          <span class="question">${item.q}</span>
          <span class="diff diff-${item.difficulty}">${item.difficulty}</span>
          <span class="arrow">▼</span>
        </div>
        <div class="answer">${item.a}</div>`;

      const header = card.querySelector('.card-header');
      header.addEventListener('click', () => card.classList.toggle('open'));
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') card.classList.toggle('open');
      });

      section.appendChild(card);
      allCards.push(card);
    });

    contentDiv.appendChild(section);
  });

  updateStats();
}

// ---- Filter ----
function applyFilters() {
  const query = searchBox.value.toLowerCase().trim();
  const diff = diffFilter.value;

  allCards.forEach((card) => {
    const matchSearch =
      !query || card.dataset.question.includes(query) || card.dataset.answer.includes(query);
    const matchDiff = diff === 'all' || card.dataset.difficulty === diff;
    card.classList.toggle('hidden', !(matchSearch && matchDiff));
  });

  // Show/hide topic sections if all cards hidden
  document.querySelectorAll('.topic-section').forEach((sec) => {
    const visible = sec.querySelectorAll('.card:not(.hidden)').length;
    sec.style.display = visible ? '' : 'none';
  });

  updateStats();
}

function updateStats() {
  const visible = allCards.filter((c) => !c.classList.contains('hidden')).length;
  const total = allCards.length;
  statsEl.textContent = `${visible} / ${total} questions`;
}

// ---- Events ----
searchBox.addEventListener('input', applyFilters);
diffFilter.addEventListener('change', applyFilters);

menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));

randomBtn.addEventListener('click', () => {
  const visible = allCards.filter((c) => !c.classList.contains('hidden'));
  if (!visible.length) return;
  // Collapse all first
  allCards.forEach((c) => c.classList.remove('open'));
  const rand = visible[Math.floor(Math.random() * visible.length)];
  rand.classList.add('open');
  rand.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

expandBtn.addEventListener('click', () =>
  allCards.forEach((c) => {
    if (!c.classList.contains('hidden')) c.classList.add('open');
  }),
);
collapseBtn.addEventListener('click', () => allCards.forEach((c) => c.classList.remove('open')));

darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  darkBtn.textContent = document.body.classList.contains('dark') ? '☀️ Light' : '🌙 Dark';
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Restore dark mode
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  darkBtn.textContent = '☀️ Light';
}

// ---- Highlight active nav on scroll ----
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('nav a').forEach((a) => a.classList.remove('active'));
        const link = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  },
  { threshold: 0.2 },
);

// ---- Init ----
buildNav();
buildContent();
document.querySelectorAll('.topic-section').forEach((sec) => observer.observe(sec));
