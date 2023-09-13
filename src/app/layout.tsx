import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import TopHeadPage from '@/TopHead';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Putaxa - Art Toys',
  description: 'Shop Art toys, blind box',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={inter.className}
        suppressHydrationWarning>
        <TopHeadPage />
        {children}
      </body>
    </html>
  );
}
