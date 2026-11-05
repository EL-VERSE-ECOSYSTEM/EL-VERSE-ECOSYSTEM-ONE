import React from 'react';
import { ThemeToggle } from '@elverse/shared-ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
