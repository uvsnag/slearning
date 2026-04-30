'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import Link from 'next/link';
import { NAV_SECTIONS } from '../../navLinks';

interface StickyNavMenuProps {
  isSticky?: 'Y' | 'N';
  stickyBottom?: number;
  isVisible?: boolean;
  onOpen?: (isOpen: boolean) => void;
}

export interface StickyNavMenuHandle {
  close: () => void;
}

const StickyNavMenu = forwardRef<StickyNavMenuHandle, StickyNavMenuProps>(
  ({ isSticky = 'Y', stickyBottom, isVisible = true, onOpen }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      close: () => {
        setIsOpen(false);
        onOpen?.(false);
      },
    }));

    const toggle = () => {
      const next = !isOpen;
      setIsOpen(next);
      onOpen?.(next);
    };

    return (
      <div
        className={`right sticky-home-card ${isSticky === 'Y' ? 'sticky-ai-float' : ''} ${
          isVisible ? '' : 'sticky-item-hidden'
        } ${isOpen ? 'open' : ''}`}
        style={
          isSticky === 'Y' && typeof stickyBottom === 'number'
            ? { bottom: `${stickyBottom}px` }
            : undefined
        }
      >
        <div className={`collapse-content sticky-ai-pop-wrap sticky-nav-pop-wrap ${isOpen ? 'open' : ''}`}>
          <div className="sticky-nav-content">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="sticky-nav-section">
                <div className="sticky-nav-section-title">{section.title}</div>
                <div className="sticky-nav-links">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="sticky-nav-link"
                      onClick={() => {
                        setIsOpen(false);
                        onOpen?.(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={`sticky-ai-toggle sticky-home-toggle ${isOpen ? 'open' : ''}`}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          title="Navigation"
          onClick={toggle}
        >
          🏠
        </button>
      </div>
    );
  },
);

StickyNavMenu.displayName = 'StickyNavMenu';

export default StickyNavMenu;
