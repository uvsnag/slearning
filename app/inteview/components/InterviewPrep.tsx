'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { PV_PARTS, PV_TOPICS } from '../data';
import { PvDifficulty, PvPart } from '../types';
import './pv.css';

type DiffFilter = 'all' | PvDifficulty;

interface CardEntry {
  key: string;
  topicId: string;
  num: number;
  q: string;
  a: string;
  difficulty: PvDifficulty;
  /** Lower-cased question + tag-stripped answer, for search matching. */
  searchText: string;
}

const stripTags = (html: string) => html.replace(/<[^>]*>/g, '');

/* Dark-mode flag lives in localStorage (same 'darkMode' key as the old static
   page), read via useSyncExternalStore so SSG prerenders the light theme. */
const DARK_EVENT = 'pv-darkmode-changed';
const subscribeDark = (onChange: () => void) => {
  window.addEventListener(DARK_EVENT, onChange);
  return () => window.removeEventListener(DARK_EVENT, onChange);
};
const readDark = () => localStorage.getItem('darkMode') === 'true';

const partHasVisible = (part: PvPart, visibleByTopic: Map<string, number>) =>
  part.topics.some((t) => (visibleByTopic.get(t.id) ?? 0) > 0);

/** Static data — flatten once at module load, numbering questions globally. */
const ALL_CARDS: CardEntry[] = (() => {
  const cards: CardEntry[] = [];
  let num = 0;
  for (const topic of PV_TOPICS) {
    topic.questions.forEach((item, i) => {
      num++;
      cards.push({
        key: `${topic.id}-${i}-${num}`,
        topicId: topic.id,
        num,
        q: item.q,
        a: item.a,
        difficulty: item.difficulty,
        searchText: `${item.q.toLowerCase()}\n${stripTags(item.a.toLowerCase())}`,
      });
    });
  }
  return cards;
})();

interface QuestionCardProps {
  card: CardEntry;
  open: boolean;
  hidden: boolean;
  onToggle: (key: string) => void;
}

const QuestionCard = React.memo(function QuestionCard({
  card,
  open,
  hidden,
  onToggle,
}: QuestionCardProps) {
  const copyQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(stripTags(card.q)).catch(() => {});
  };

  return (
    <div
      id={`pv-card-${card.key}`}
      className={`card ${open ? 'open' : ''} ${hidden ? 'hidden' : ''}`}
    >
      <div
        className="card-header"
        role="button"
        tabIndex={0}
        onClick={() => onToggle(card.key)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(card.key);
          }
        }}
      >
        <span className="num">{card.num}</span>
        <span className="question" dangerouslySetInnerHTML={{ __html: card.q }} />
        <span className={`diff diff-${card.difficulty}`}>
          <button type="button" title="Copy question" onClick={copyQuestion}>
            📋
          </button>{' '}
          {card.difficulty}
        </span>
        <span className="arrow">▼</span>
      </div>
      <div className="answer" dangerouslySetInnerHTML={{ __html: card.a }} />
    </div>
  );
});

/**
 * Interview Knowledge Base — React port of the former public/inteview/pv.html
 * static page (sidebar topic nav, search, difficulty filter, random question,
 * expand/collapse all, dark mode). All styles live in pv.css, scoped under
 * `.pv-root` so nothing leaks into the rest of the app.
 */
export default function InterviewPrep() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [diff, setDiff] = useState<DiffFilter>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openCards, setOpenCards] = useState<Set<string>>(() => new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);

  /* ----- filtering ----- */
  const visibleKeys = useMemo(() => {
    const q = query.toLowerCase().trim();
    const keys = new Set<string>();
    for (const card of ALL_CARDS) {
      const matchSearch = !q || card.searchText.includes(q);
      const matchDiff = diff === 'all' || card.difficulty === diff;
      if (matchSearch && matchDiff) keys.add(card.key);
    }
    return keys;
  }, [query, diff]);

  const visibleByTopic = useMemo(() => {
    const counts = new Map<string, number>();
    for (const card of ALL_CARDS) {
      if (visibleKeys.has(card.key)) {
        counts.set(card.topicId, (counts.get(card.topicId) ?? 0) + 1);
      }
    }
    return counts;
  }, [visibleKeys]);

  /* ----- card open/close ----- */
  const toggleCard = useCallback((key: string) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const expandAll = () => setOpenCards(new Set(visibleKeys));
  const collapseAll = () => setOpenCards(new Set());

  const randomQuestion = () => {
    const visible = ALL_CARDS.filter((c) => visibleKeys.has(c.key));
    if (visible.length === 0) return;
    const pick = visible[Math.floor(Math.random() * visible.length)];
    setOpenCards(new Set([pick.key]));
    document
      .getElementById(`pv-card-${pick.key}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ----- dark mode (persisted like the original page) ----- */
  const dark = useSyncExternalStore(subscribeDark, readDark, () => false);

  const toggleDark = () => {
    localStorage.setItem('darkMode', String(!dark));
    window.dispatchEvent(new Event(DARK_EVENT));
  };

  /* ----- highlight active nav link while scrolling ----- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.2 },
    );
    rootRef.current
      ?.querySelectorAll('.topic-section')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`pv-root ${dark ? 'pv-dark' : ''}`}>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Topics</h2>
          <input
            type="text"
            placeholder="Search questions..."
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <nav>
          {PV_PARTS.map((part) => (
            <React.Fragment key={part.id}>
              <div className="nav-part">
                {part.icon} {part.label}
              </div>
              {part.topics.map((topic) => (
                <a
                  key={topic.id}
                  href={`#section-${topic.id}`}
                  className={activeSection === `section-${topic.id}` ? 'active' : ''}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span>{topic.icon}</span> {topic.name}
                  <span className="badge">{topic.questions.length}</span>
                </a>
              ))}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="main">
        <header>
          <button
            type="button"
            className="menu-btn"
            aria-label="Toggle topics menu"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            ☰
          </button>
          <h1>Senior Developer Interview Prep</h1>
          <div className="stats">
            {visibleKeys.size} / {ALL_CARDS.length} questions
          </div>
        </header>

        <div className="controls">
          <select value={diff} onChange={(e) => setDiff(e.target.value as DiffFilter)}>
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="tricky">Tricky</option>
          </select>
          <button type="button" className="btn" onClick={randomQuestion}>
            Random Question
          </button>
          <button type="button" className="btn" onClick={expandAll}>
            Expand All
          </button>
          <button type="button" className="btn" onClick={collapseAll}>
            Collapse All
          </button>
          <button type="button" className="btn" onClick={toggleDark}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div>
          {PV_PARTS.map((part) => (
            <div
              key={part.id}
              style={{ display: partHasVisible(part, visibleByTopic) ? undefined : 'none' }}
            >
              <div className="part-title">
                {part.icon} {part.label}
              </div>
              {part.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="topic-section"
                  id={`section-${topic.id}`}
                  style={{ display: (visibleByTopic.get(topic.id) ?? 0) > 0 ? undefined : 'none' }}
                >
                  <div className="topic-title">
                    <span className="icon">{topic.icon}</span> {topic.name}
                  </div>
                  {ALL_CARDS.filter((c) => c.topicId === topic.id).map((card) => (
                    <QuestionCard
                      key={card.key}
                      card={card}
                      open={openCards.has(card.key)}
                      hidden={!visibleKeys.has(card.key)}
                      onToggle={toggleCard}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
