import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#050507', color: '#FFFFFF', fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
