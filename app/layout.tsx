'use client';
import './globals.css';
import StickyQuickTools from './common/components/sticky/StickyQuickTools';
import VSCodeLayout from './common/components/vscode/VSCodeLayout';
import { PracticeStoreProvider } from './common/hooks/usePracticeStore';
import { LAYOUT_PRELOAD_SCRIPT } from './common/layoutMode';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SLearning</title>
        <link rel="icon" href="/slearning/logo.png" />
        <script dangerouslySetInnerHTML={{ __html: LAYOUT_PRELOAD_SCRIPT }} />
      </head>
      <body>
        <PracticeStoreProvider>
          <VSCodeLayout tools={<StickyQuickTools />}>{children}</VSCodeLayout>
        </PracticeStoreProvider>
      </body>
    </html>
  );
}
