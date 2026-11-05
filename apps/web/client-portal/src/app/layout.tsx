import React from 'react';
import { ThemeToggle } from '@elverse/shared-ui';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
