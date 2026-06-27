import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Understand any research paper',
  description: 'Understand any research paper - Built with Rust + Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
