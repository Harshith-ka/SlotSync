import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SlotSync — Multi-Tenant Booking & Scheduling Infrastructure SaaS',
  description:
    'High-performance, conflict-safe scheduling infrastructure engine with temporary holds, timezone intelligence, and staff management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
