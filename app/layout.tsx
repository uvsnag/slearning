'use client';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { useEffect } from 'react';
import logoImg from '@/public/logo.png';
export const handleCheckboxDarkChange = (e: any) => {
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
        {/* <link rel="icon" href={logoImg.src} /> */}
      </head>
      <body>
        {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
        <div>
          <Link href="/">
            <FaHome />
          </Link>
          <label>
            <input type="checkbox" onChange={handleCheckboxDarkChange} defaultChecked={true} />
            Dark mode
          </label>
        </div>
        {children}
      </body>
    </html>
  );
}