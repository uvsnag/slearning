'use client';
import Link from 'next/link';
import React, { FC } from 'react';

const DASHBOARD_LINKS = [
  { href: '/dash-board2', label: 'AI Only' },
  { href: '/youtube-sub', label: 'YT' },
  { href: '/dash-board1', label: 'Sentence & YT' },
];
const SINGLE_PRACT_LINKS = [
  { href: '/practice-word', label: 'Word (Meaning)' },
  { href: '/listen', label: 'Word (Listen)' },
  { href: '/notify', label: 'Notify' },
  { href: '/next-sentence', label: 'Sentence' },
];

const MOBILE_LINKS = [
  { href: '/mobile/speak-ai', label: 'Speak AI' },
  { href: '/mobile/youtube-sub', label: 'Listen Board' },
];

const Home: FC = () => {
  return (
    <div className="ui-page">
      <div className="ui-page-shell home-shell">
        <h1 className="ui-title">SLearning Studio</h1>
        <p className="ui-subtitle">
          {/* Unified navigation for desktop and mobile tools, with shared UI tokens. */}
        </p>

        <div className="home-menu-grid">
          <section className="ui-panel home-menu-panel">
            <div className="common-toggle">Dash Board</div>
            <ul className="mst-menu">
              {DASHBOARD_LINKS.map((link) => (
                <li className="mst-menu-li" key={link.href}>
                  <Link className="home-nav-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="ui-panel home-menu-panel">
            <div className="common-toggle">Single Practice</div>
            <ul className="mst-menu">
              {SINGLE_PRACT_LINKS.map((link) => (
                <li className="mst-menu-li" key={link.href}>
                  <Link className="home-nav-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="ui-panel home-menu-panel">
            <div className="common-toggle">Mobile</div>
            <ul className="mst-menu">
              {MOBILE_LINKS.map((link) => (
                <li className="mst-menu-li" key={link.href}>
                  <Link className="home-nav-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;

