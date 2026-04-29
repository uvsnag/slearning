'use client';
import './globals.css';
import StickyQuickTools from './common/components/sticky/StickyQuickTools';
import { PracticeStoreProvider } from './common/hooks/usePracticeStore';
import Notify from './notify/Notify';
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
