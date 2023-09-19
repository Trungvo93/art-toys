import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import TopHeadPage from '@/TopHead';
import { Providers } from './providers';
import 'bootstrap-icons/font/bootstrap-icons.css';

const poppins = Poppins({ subsets: ['latin'], weight: '400' });

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
      <head>
        <link
          rel='icon'
          href='/assets/header/logoMetadata.png'
        />
      </head>
      <body
        className={poppins.className}
        suppressHydrationWarning>
        <Providers>
          <TopHeadPage />
          <div className=''>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
