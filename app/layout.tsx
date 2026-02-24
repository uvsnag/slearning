'use client';
import './globals.css';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import type { ChangeEvent } from 'react';
import { useEffect } from 'react';
export const handleCheckboxDarkChange = (e: ChangeEvent<HTMLInputElement>) => {
  // const targetDiv = document.getElementById("root");
  const bodyElement = document.body;
  if (bodyElement) {
    if (e.target.checked) {
      bodyElement.classList.add('dark-90');
    } else {
      bodyElement.classList.remove('dark-90');
    }
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.body.classList.add('dark-90');
  }, []);
  return (
    <html lang="en">
      <head>
        <title>SLearning</title>
      </head>
      <body>
        <div className="app-topbar ui-panel">
          <Link href="/" className="app-home-link">
            <FaHome />
            <label>Home</label>
          </Link>
          <label className="app-dark-switch">
            <input type="checkbox" onChange={handleCheckboxDarkChange} defaultChecked={true} />
            Dark mode
          </label>
        </div>
        {children}
      </body>
    </html>
  );
}
