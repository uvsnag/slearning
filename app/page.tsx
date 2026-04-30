'use client';
import Link from 'next/link';
import React, { FC } from 'react';
import Notify from './notify/Notify';
import { NAV_SECTIONS } from './common/navLinks';

const Home: FC = () => {
  return (
    <div className="ui-page">
      <div className="ui-page-shell home-shell">
        <h1 className="ui-title">SLearning Studio</h1>
        <p className="ui-subtitle">
          {/* Unified navigation for desktop and mobile tools, with shared UI tokens. */}
        </p>

        <div className="home-menu-grid">
          {NAV_SECTIONS.map((section) => (
            <section className="ui-panel home-menu-panel" key={section.title}>
              <div className="common-toggle">{section.title}</div>
              <ul className="mst-menu">
                {section.links.map((link) => (
                  <li className="mst-menu-li" key={link.href}>
                    <Link className="home-nav-link" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {/* <iframe
            src="https://translate.google.com.vn"
            width="800"
            height="500"
            title="Example Site"
            loading="lazy"
            // sandbox="allow-scripts allow-same-origin"
            // allow="camera; microphone"
            // referrerpolicy="no-referrer"
          ></iframe> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
