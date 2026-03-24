'use client';
import './globals.css';
import StickyQuickTools from './common/components/sticky/StickyQuickTools';
import { PracticeStoreProvider } from './common/hooks/usePracticeStore';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>SLearning</title>
      </head>
      <body>
        <PracticeStoreProvider>
          <StickyQuickTools />
          {children}
        </PracticeStoreProvider>
      </body>
    </html>
  );
}
